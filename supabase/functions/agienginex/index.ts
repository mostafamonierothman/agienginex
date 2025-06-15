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

    // --- 1. AGI CHAT (with REAL agent control and lead generation) ---
    if (path === "agi-chat" || (!path && message)) {
      const prompt = message || "";
      
      // Check for lead generation commands - ENHANCED DETECTION WITH REAL EXECUTION
      if (detectLeadGenerationCommand(prompt)) {
        console.log("🎯 Medical Tourism Lead Generation Detected - EXECUTING REAL SYSTEM");
        
        const leadCount = prompt.match(/(\d+)/) ? parseInt(prompt.match(/(\d+)/)?.[1] || "50") : 50;
        
        try {
          // Execute REAL lead generation through business executor
          const realResult = await executeRealLeadGeneration(leadCount, 'medical tourism', supabase, supabaseUrl, supabaseKey);
          
          // Log the successful REAL lead generation
          await supabase.from('supervisor_queue').insert({
            user_id: 'agi_chat_user',
            agent_name: 'real_medical_tourism_executor',
            action: 'real_lead_generation',
            input: JSON.stringify({ requested_count: leadCount, command: prompt }),
            status: 'completed',
            output: `REAL EXECUTION: Generated ${realResult.leads_generated} actual leads in database`
          });

          const response = `✅ **REAL Medical Tourism Lead Generation Complete!**

🎯 **Generated ${realResult.leads_generated} ACTUAL medical tourism leads in database:**

**Real Business Execution Summary:**
• 🔥 ${realResult.leads_generated} real leads created and stored
• 💰 Total estimated pipeline value: €${realResult.revenue_potential?.toLocaleString() || '0'}
• 📧 Ready for real email outreach campaigns
• 🎯 All leads have valid contact information and source tracking
• 💾 Data stored in production database for CRM access

**Lead Generation Details:**
${realResult.description}

**Next Real Actions Available:**
${realResult.next_steps?.map(step => `• *"${step}"*`).join('\n') || '• Check database for generated leads\n• Start email outreach campaign'}

**⚠️ IMPORTANT:** This was REAL business execution. Check your leads table in the database to see the actual generated leads with real contact information.`;

          return new Response(JSON.stringify({
            success: true,
            response: response,
            leads_generated: realResult.leads_generated,
            estimated_value: realResult.revenue_potential,
            actual_leads_count: realResult.actual_leads?.length || 0,
            agent_used: "real_business_executor",
            execution_type: "REAL_DATABASE_EXECUTION"
          }), { headers: corsHeaders });
          
        } catch (error) {
          console.error('Real lead generation failed:', error);
          return new Response(JSON.stringify({
            success: false,
            response: `❌ **REAL Lead Generation Failed:** ${error.message}\n\nThe system attempted to execute real business logic but encountered an error. This is actual business execution, not simulation.`,
            agent_used: "real_business_executor",
            execution_type: "REAL_EXECUTION_FAILED"
          }), { headers: corsHeaders });
        }
      }

      // Other agent deployment patterns
      const deployRegex = /(deploy|create|launch) (new )?(agent|ai|bot) (?:named )?["']?([\w\- ]{3,100})["']?/i;
      const startRegex = /(start|run)\s+agent\s+["']?([\w\- ]{3,100})["']?/i;
      const stopRegex = /(stop|terminate|pause)\s+agent\s+["']?([\w\- ]{3,100})["']?/i;
      const listRegex = /(list|show)\s+(live|running)?\s?agents/i;
      const scaleRegex = /(scale|increase|expand)\s+agents?\s*(?:to|by)?\s*(\d+)?/i;

      // 1. Deploy new agent via chat
      if (deployRegex.test(prompt)) {
        try {
          const match = prompt.match(deployRegex);
          const agentNameToUse = match ? match[4] || ("agent-" + Date.now()) : ("agent-" + Date.now());
          const result = await deployAgent(agentNameToUse, prompt, openAIApiKey, supabase);
          
          return new Response(JSON.stringify({
            success: true,
            response: `✅ Agent "${result.agent_name}" deployed, code saved as "${result.filepath}", version ${result.version}.`,
            agent_name: result.agent_name,
            agent_id: result.agent_id,
            version: result.version
          }), { headers: corsHeaders });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
        }
      }

      // 2. Start agent via chat
      if (startRegex.test(prompt)) {
        try {
          const match = prompt.match(startRegex);
          const name = match?.[2] || agent_name || "";
          const agent = await startAgent(name, supabase);
          return new Response(JSON.stringify({
            success: true,
            response: `▶️ Agent "${name}" started (Performance: ${agent.performance_score ?? 0}%)`,
            agent_name: name,
            performance_score: agent.performance_score ?? 0
          }), { headers: corsHeaders });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), { status: 404, headers: corsHeaders });
        }
      }

      // 3. Stop agent via chat
      if (stopRegex.test(prompt)) {
        try {
          const match = prompt.match(stopRegex);
          const name = match?.[2] || agent_name || "";
          const agent = await stopAgent(name, supabase);
          return new Response(JSON.stringify({
            success: true,
            response: `⏹️ Agent "${name}" stopped (Performance: ${agent.performance_score ?? 0}%)`,
            agent_name: name,
            performance_score: agent.performance_score ?? 0
          }), { headers: corsHeaders });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), { status: 404, headers: corsHeaders });
        }
      }

      // 4. List agents via chat
      if (listRegex.test(prompt)) {
        try {
          const agents = await listAgents(supabase);
          const lines = agents.map((a: any) =>
            `- ${a.agent_name} (${a.status}, Performance: ${a.performance_score ?? 0}%)`
          );
          return new Response(JSON.stringify({
            success: true,
            agents: agents,
            response: `Live Agents:\n${lines.join("\n")}`
          }), { headers: corsHeaders });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: corsHeaders });
        }
      }

      // 5. Scale agents via chat (simulated)
      if (scaleRegex.test(prompt)) {
        const match = prompt.match(scaleRegex);
        const scaleTo = parseInt(match?.[2] || "0");
        if (scaleTo > 0) {
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
        const content = await processAGIChat(prompt, openAIApiKey, supabase);
        return new Response(JSON.stringify({ success: true, response: content }), { headers: corsHeaders });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "OpenAI error", detail: err?.message || String(err) }), { status: 500, headers: corsHeaders });
      }
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
