import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { sanitizeAgentName } from "./utils/sanitization.ts";
import { 
  executeRealLeadGeneration, 
  detectLeadGenerationCommand 
} from "./handlers/leadGeneration.ts";
import { 
  deployAgent, 
  startAgent, 
  stopAgent, 
  listAgents 
} from "./handlers/agentManagement.ts";
import { 
  processAGIChat, 
  generateCode 
} from "./handlers/chatProcessor.ts";
import { 
  createGoal, 
  getGoals 
} from "./handlers/goalManagement.ts";

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
      goal,
      message,
      endpoint
    } = request;

    // --- 1. AGI CHAT: Delegate to SupervisorAgent via API ---
    if (
      path === "agi-chat" ||
      (!path && message)
    ) {
      const prompt = message || "";

      // Instead of local logic, we POST to our own backend SupervisorAgent API
      const supervisorApiUrl = "https://dab85fe5-494f-4f16-b3d1-6b26f771a943.lovableproject.com/api/supervisor-agent";
      let supervisorResponse;
      try {
        const supRes = await fetch(supervisorApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: "agi_chat_user",
            input: { goal: prompt, message: prompt }
          })
        });

        if (!supRes.ok) {
          const errText = await supRes.text();
          return new Response(JSON.stringify({
            success: false,
            response: `SupervisorAgent API Error: ${supRes.status} - ${errText}`
          }), { status: supRes.status, headers: corsHeaders });
        }

        supervisorResponse = await supRes.json();
      } catch (e) {
        return new Response(JSON.stringify({
          success: false,
          response: "Could not reach SupervisorAgent API: " + (e?.message || String(e))
        }), { status: 500, headers: corsHeaders });
      }

      // Proof: Echo live SupervisorAgent result for traceability & diagnostics
      return new Response(JSON.stringify({
        success: supervisorResponse.success,
        supervisor_agent: true,
        supervisor_message: supervisorResponse.message,
        supervisor_data: supervisorResponse.data,
        proof_of_execution: {
          total_leads_in_db: supervisorResponse.data?.total_leads_db,
          total_supervisor_actions: supervisorResponse.data?.total_supervisor_actions,
          last_agent_run: supervisorResponse.data?.last_agent_run
        },
        timestamp: new Date().toISOString()
      }), { headers: corsHeaders });
    }

    // --- 2. Agent Deployment and Management API (explicit) ---
    if (path === "agent-deploy") {
      try {
        const { agent_name: rawName, agent_goal } = payload || {};
        const agentNameToUse = rawName || ("agent-" + Date.now());
        const result = await deployAgent(agentNameToUse, agent_goal || 'Generic', openAIApiKey, supabase);
        
        return new Response(JSON.stringify({
          success: true,
          response: `Agent "${result.agent_name}" deployed and registered.`,
          agent_name: result.agent_name,
          agent_id: result.agent_id
        }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (path === "agent-start" || agent_action === "start") {
      try {
        const { agent_name: name } = payload || request || {};
        if (!name) return new Response(JSON.stringify({ success: false, error: "agent_name required" }), { status: 400, headers: corsHeaders });
        const agent = await startAgent(name, supabase);
        return new Response(JSON.stringify({
          success: true,
          response: `Agent "${sanitizeAgentName(name)}" started.`,
          agent_id: agent.id,
          performance_score: agent.performance_score ?? 0
        }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 404, headers: corsHeaders });
      }
    }

    if (path === "agent-stop" || agent_action === "stop") {
      try {
        const { agent_name: name } = payload || request || {};
        if (!name) return new Response(JSON.stringify({ success: false, error: "agent_name required" }), { status: 400, headers: corsHeaders });
        const agent = await stopAgent(name, supabase);
        return new Response(JSON.stringify({
          success: true,
          response: `Agent "${sanitizeAgentName(name)}" stopped.`,
          agent_id: agent.id,
          performance_score: agent.performance_score ?? 0
        }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 404, headers: corsHeaders });
      }
    }

    if (path === "agents-list") {
      try {
        const agents = await listAgents(supabase);
        const lines = agents.map((a: any) =>
          `- ${a.agent_name} (${a.status}, Performance: ${a.performance_score ?? 0}%)`
        );
        return new Response(JSON.stringify({
          success: true,
          agents: agents,
          response: `Agents:\n${lines.join("\n")}`,
        }), { headers: corsHeaders });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
      }
    }

    // --- CODE GENERATION ---
    if (path === "code-generation" || endpoint === "code-generation" || message?.toLowerCase().includes("generate code") || code_request || code_instruction) {
      try {
        const codePrompt =
          code_instruction ||
          code_request ||
          goal ||
          message ||
          (payload && payload.code_instruction) ||
          "Write a TypeScript function that returns Hello World.";

        const code = await generateCode(codePrompt, openAIApiKey, supabase);

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
        const inserted = await createGoal({ goal_text: goal || payload?.goal_text, priority: payload?.priority, status: payload?.status }, supabase);
        return new Response(JSON.stringify({ success: true, inserted }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Failed to create AGI goal", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- AGI GOALS LIST ---
    if (path === "get-agi-goals") {
      try {
        const goals = await getGoals(supabase);
        return new Response(JSON.stringify({ success: true, goals }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Failed to fetch AGI goals", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
    }

    // --- DEFAULT: Unknown paths/endpoints ---
    return new Response(
      JSON.stringify({
        status: "ok",
        endpoints: [
          "agi-chat",
          "agent-deploy",
          "agent-start",
          "agent-stop",
          "agents-list",
          "agi-goals",
          "get-agi-goals",
          "code-generation"
        ]
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
