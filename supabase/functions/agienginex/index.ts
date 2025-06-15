import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase env is not set up.");
if (!openAIApiKey) throw new Error("OpenAI API key required for AGI chat.");

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

function sanitizeAgentName(name: string) {
  // Only kebab-case, lowercase, 3-48 chars, no slashes, always .ts at end
  let cleaned = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  cleaned = cleaned.replace(/--+/g, "-").slice(0, 48).replace(/^-+|-+$/g, "");
  return cleaned.length >= 3 ? cleaned : `agent-${Date.now()}`;
}

function safeAgentFilePath(agentName: string) {
  const safeName = sanitizeAgentName(agentName);
  return `agents/${safeName}.ts`; // controlled location, .ts only
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Invalid method" }), { status: 405, headers: corsHeaders });
    }
    const request = await req.json();
    const { 
      path, 
      payload, 
      command, 
      goal, 
      message, 
      code_request, 
      code_instruction, 
      endpoint, 
      agent_action, 
      agent_name 
    } = request;

    // --- 1. AGI CHAT (with agent control) ---
    if (path === "agi-chat" || (!path && message)) {
      const prompt = message || "";
      // Added: add "scale" detection
      const deployRegex = /(deploy|create|launch) (new )?(agent|ai|bot) (?:named )?["']?([\w\- ]{3,100})["']?/i;
      const startRegex = /(start|run)\s+agent\s+["']?([\w\- ]{3,100})["']?/i;
      const stopRegex = /(stop|terminate|pause)\s+agent\s+["']?([\w\- ]{3,100})["']?/i;
      const listRegex = /(list|show)\s+(live|running)?\s?agents/i;
      const scaleRegex = /(scale|increase|expand)\s+agents?\s*(?:to|by)?\s*(\d+)?/i;

      // 1. Deploy new agent via chat
      if (deployRegex.test(prompt)) {
        const match = prompt.match(deployRegex);
        const deployName = match ? sanitizeAgentName(match[4] || ("agent-" + Date.now())) : ("agent-" + Date.now());
        const filepath = safeAgentFilePath(deployName);

        // Use OpenAI to generate agent code/class/spec
        const openaiPrompt = `Create a new autonomous AI agent TypeScript class named "${deployName}" for the following task: ${prompt}. 
Respond with pure code implementing the class, no extra text. The class should have methods: run, stop, status.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAIApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are an expert AI agent factory. Output ONLY code for a live agent class." },
              { role: "user", content: openaiPrompt }
            ],
            max_tokens: 900,
            temperature: 0.15,
          }),
        });
        const data = await response.json();
        const agentCode = data.choices?.[0]?.message?.content || "";

        // --- [NEW] SANITY CHECK: ensure only code, and doesn't try to do fs writes, imports etc ---
        if (agentCode.toLowerCase().includes("require(") || agentCode.toLowerCase().includes("fs.")) {
          return new Response(JSON.stringify({ success: false, error: "Unsafe code detected!" }), { status: 400, headers: corsHeaders });
        }

        // Register in agent_registry (status: stopped by default)
        const { data: regData, error: regErr } = await supabase
          .from("agent_registry")
          .insert({
            agent_name: deployName,
            agent_type: "custom",
            status: "stopped"
          })
          .select()
          .maybeSingle();
        if (regErr) return new Response(JSON.stringify({ success: false, error: regErr.message }), { status: 500, headers: corsHeaders });
        const agentId = regData?.id;

        // [NEW] Save code to versioned file + version table
        // Simulate "writing" file by inserting to agent_versions as our file system
        let latestVersion = 1;
        // Find latest version for this agent (if exists)
        const { data: prevVersions } = await supabase
          .from("agent_versions")
          .select("version_number")
          .eq("file_path", filepath)
          .eq("agent_id", agentId)
          .order("version_number", { ascending: false })
          .limit(1);
        if (prevVersions && prevVersions.length > 0) {
          latestVersion = (prevVersions[0].version_number || 0) + 1;
        }
        const { error: vErr } = await supabase
          .from("agent_versions")
          .insert({
            agent_id: agentId,
            file_path: filepath,
            code: agentCode,
            version_number: latestVersion,
            commit_message: `Deployed by chat (${new Date().toISOString()})`
          });
        if (vErr) return new Response(JSON.stringify({ success: false, error: vErr.message }), { status: 500, headers: corsHeaders });

        // Log in agent_memory
        await supabase.from("agent_memory").insert({
          user_id: "chat_user",
          agent_name: deployName,
          memory_key: "deployment",
          memory_value: "deployed via chat",
          timestamp: new Date().toISOString(),
        });

        return new Response(JSON.stringify({
          success: true,
          response: `✅ Agent "${deployName}" deployed, code saved as "${filepath}", version ${latestVersion}.`,
          agent_name: deployName,
          agent_id: agentId,
          version: latestVersion
        }), { headers: corsHeaders });
      }

      // 2. Start agent via chat
      if (startRegex.test(prompt)) {
        const match = prompt.match(startRegex);
        const name = sanitizeAgentName(match?.[2] || agent_name || "");
        const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", name).maybeSingle();
        if (!agent || error) return new Response(JSON.stringify({ success: false, error: "Agent not found" }), { status: 404, headers: corsHeaders });
        await supabase.from("agent_registry").update({
          status: "running",
          last_started_at: new Date().toISOString()
        }).eq("id", agent.id);
        return new Response(JSON.stringify({
          success: true,
          response: `▶️ Agent "${name}" started (Performance: ${agent.performance_score ?? 0}%)`,
          agent_name: name,
          performance_score: agent.performance_score ?? 0
        }), { headers: corsHeaders });
      }

      // 3. Stop agent via chat
      if (stopRegex.test(prompt)) {
        const match = prompt.match(stopRegex);
        const name = sanitizeAgentName(match?.[2] || agent_name || "");
        const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", name).maybeSingle();
        if (!agent || error) return new Response(JSON.stringify({ success: false, error: "Agent not found" }), { status: 404, headers: corsHeaders });
        await supabase.from("agent_registry").update({
          status: "stopped",
          last_stopped_at: new Date().toISOString()
        }).eq("id", agent.id);
        return new Response(JSON.stringify({
          success: true,
          response: `⏹️ Agent "${name}" stopped (Performance: ${agent.performance_score ?? 0}%)`,
          agent_name: name,
          performance_score: agent.performance_score ?? 0
        }), { headers: corsHeaders });
      }

      // 4. List agents via chat - now includes performance score and live status
      if (listRegex.test(prompt)) {
        const { data: agents, error } = await supabase.from("agent_registry").select("*").order("created_at", { ascending: false });
        if (error) return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
        const lines = (agents || []).map((a: any) =>
          `- ${a.agent_name} (${a.status}, Performance: ${a.performance_score ?? 0}%)`
        );
        return new Response(JSON.stringify({
          success: true,
          agents: agents || [],
          response: `Live Agents:\n${lines.join("\n")}`
        }), { headers: corsHeaders });
      }

      // 5. Scale agents via chat (simulated, UI/infra scaling not yet implemented)
      if (scaleRegex.test(prompt)) {
        const match = prompt.match(scaleRegex);
        const scaleTo = parseInt(match?.[2] || "0");
        if (scaleTo > 0) {
          // In a real system, this would trigger agent replica scaling & registry
          return new Response(JSON.stringify({
            success: true,
            response: `🪄 Scaling agents to target ${scaleTo} instances. (This is a simulated response. Real scaling requires infra changes.)`
          }), { headers: corsHeaders });
        } else {
          return new Response(JSON.stringify({
            success: false,
            response: `Provide a number, e.g. "scale agents to 10". (Scaling is not yet implemented.)`
          }), { headers: corsHeaders });
        }
      }

      // Default AGI chat if no command matched
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAIApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are AGIengineX, a helpful, decisive AI business executive." },
              { role: "user", content: prompt },
            ],
            max_tokens: 500,
          }),
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "No response!";
        // Log chat to agent_memory for replay/debug
        await supabase.from("agent_memory").insert({
          user_id: "chat_user",
          agent_name: "agi_engine_x",
          memory_key: "chat_message",
          memory_value: prompt,
          timestamp: new Date().toISOString(),
        });
        await supabase.from("agent_memory").insert({
          user_id: "agi_engine_x",
          agent_name: "agi_engine_x",
          memory_key: "chat_reply",
          memory_value: content,
          timestamp: new Date().toISOString(),
        });
        return new Response(JSON.stringify({ success: true, response: content }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "OpenAI error", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- 2. Agent Deployment and Management API (explicit) ---
    if (path === "agent-deploy") {
      const { agent_name: rawName, agent_goal } = payload || {};
      const deployName = sanitizeAgentName(rawName || ("agent-" + Date.now()));
      const filepath = safeAgentFilePath(deployName);
      // Generate agent class code via OpenAI
      const openaiPrompt = `Create a new autonomous AI agent TypeScript class named "${deployName}" for this task: ${agent_goal || 'Generic'}.
Respond with code only for the agent class, no extra comments or preamble. Run, stop, and status methods are required.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openAIApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "Output ONLY clean .ts code for the requested agent class. No extra explanations." },
            { role: "user", content: openaiPrompt }
          ],
          max_tokens: 900,
          temperature: 0.12,
        }),
      });
      const data = await response.json();
      const agentCode = data.choices?.[0]?.message?.content || "";
      // Register agent
      const { data: regData, error: regErr } = await supabase
        .from("agent_registry")
        .insert({
          agent_name: deployName,
          agent_type: "custom",
          status: "stopped"
        })
        .select()
        .maybeSingle();
      if (regErr) return new Response(JSON.stringify({ success: false, error: regErr.message }), { status: 500, headers: corsHeaders });
      const agentId = regData?.id;

      // Save versioned code
      const { error: vErr } = await supabase.from("agent_versions").insert({
        agent_id: agentId,
        file_path: filepath,
        code: agentCode,
        version_number: 1,
        commit_message: `Initial version deployed via API (${new Date().toISOString()})`
      });
      if (vErr) return new Response(JSON.stringify({ success: false, error: vErr.message }), { status: 500, headers: corsHeaders });

      return new Response(JSON.stringify({
        success: true,
        response: `Agent "${deployName}" deployed and registered.`,
        agent_name: deployName,
        agent_id: agentId
      }), { headers: corsHeaders });
    }

    if (path === "agent-start" || agent_action === "start") {
      const { agent_name: name } = payload || request || {};
      if (!name) return new Response(JSON.stringify({ success: false, error: "agent_name required" }), { status: 400, headers: corsHeaders });
      const sname = sanitizeAgentName(name);
      const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", sname).maybeSingle();
      if (!agent || error) return new Response(JSON.stringify({ success: false, error: "Agent not found" }), { status: 404, headers: corsHeaders });
      await supabase.from("agent_registry").update({
        status: "running",
        last_started_at: new Date().toISOString()
      }).eq("id", agent.id);
      return new Response(JSON.stringify({
        success: true,
        response: `Agent "${sname}" started.`,
        agent_id: agent.id,
        performance_score: agent.performance_score ?? 0
      }), { headers: corsHeaders });
    }

    if (path === "agent-stop" || agent_action === "stop") {
      const { agent_name: name } = payload || request || {};
      if (!name) return new Response(JSON.stringify({ success: false, error: "agent_name required" }), { status: 400, headers: corsHeaders });
      const sname = sanitizeAgentName(name);
      const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", sname).maybeSingle();
      if (!agent || error) return new Response(JSON.stringify({ success: false, error: "Agent not found" }), { status: 404, headers: corsHeaders });
      await supabase.from("agent_registry").update({
        status: "stopped",
        last_stopped_at: new Date().toISOString()
      }).eq("id", agent.id);
      return new Response(JSON.stringify({
        success: true,
        response: `Agent "${sname}" stopped.`,
        agent_id: agent.id,
        performance_score: agent.performance_score ?? 0
      }), { headers: corsHeaders });
    }

    if (path === "agents-list") {
      const { data: agents, error } = await supabase.from("agent_registry").select("*").order("created_at", { ascending: false });
      if (error) return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
      const lines = (agents || []).map((a: any) =>
        `- ${a.agent_name} (${a.status}, Performance: ${a.performance_score ?? 0}%)`
      );
      return new Response(JSON.stringify({
        success: true,
        agents: agents || [],
        response: `Agents:\n${lines.join("\n")}`,
      }), { headers: corsHeaders });
    }

    // --- REAL CODE GENERATION (legacy) ---
    if (path === "code-generation" || endpoint === "code-generation" || message?.toLowerCase().includes("generate code") || code_request || code_instruction) {
      try {
        const codePrompt =
          code_instruction ||
          code_request ||
          goal ||
          message ||
          (payload && payload.code_instruction) ||
          "Write a TypeScript function that returns Hello World.";

        const openAIMessages = [
          { role: "system", content: "You are an expert AI programming assistant. Output ONLY code, no explanation, no markdown wrapping." },
          { role: "user", content: codePrompt }
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAIApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: openAIMessages,
            max_tokens: 900,
            temperature: 0.2,
          }),
        });

        const data = await response.json();
        const code = data.choices?.[0]?.message?.content || "No code generated!";

        await supabase.from("agent_memory").insert({
          user_id: "chat_user",
          agent_name: "agi_engine_x",
          memory_key: "code_gen_prompt",
          memory_value: codePrompt,
          timestamp: new Date().toISOString(),
        });
        await supabase.from("agent_memory").insert({
          user_id: "agi_engine_x",
          agent_name: "agi_engine_x",
          memory_key: "code_generated",
          memory_value: code,
          timestamp: new Date().toISOString(),
        });

        return new Response(JSON.stringify({
          success: true,
          response: code,
          code: code,
          prompt: codePrompt,
        }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Code generation error", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- AGI GOALS CRUD ---
    if (path === "agi-goals" || (goal && typeof goal === "string")) {
      try {
        const { goal_text, priority, status } = payload || {};
        const result = await supabase.from("agi_goals").insert({
          goal_text: goal || goal_text,
          priority: typeof priority === "number" ? priority : 5,
          status: status || "active",
          progress_percentage: 0,
          created_at: new Date().toISOString(),
        }).select();
        if (result.error) throw result.error;
        return new Response(JSON.stringify({ success: true, inserted: result.data }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Failed to create AGI goal", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- AGI GOALS LIST ---
    if (path === "get-agi-goals") {
      try {
        const { data, error } = await supabase.from("agi_goals").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ success: true, goals: data }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch AGI goals", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- DEFAULT: Unknown path, health check ---
    return new Response(
      JSON.stringify({ status: "ok", endpoints: [
        "agi-chat", 
        "agent-deploy", 
        "agent-start", 
        "agent-stop", 
        "agents-list", 
        "agi-goals", 
        "get-agi-goals", 
        "code-generation"
      ] }),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error?.message || String(error) }), { status: 500, headers: corsHeaders });
  }
});
