
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Invalid method" }), { status: 405, headers: corsHeaders });
    }
    const { path, payload, command, goal, message } = await req.json();

    // --- AGI CHAT ENDPOINT ---
    if (path === "agi-chat" || (!path && message)) {
      // Run OpenAI chat and log in agent_memory
      try {
        const prompt = message || "";
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

    // --- AGI GOALS CRUD ---
    if (path === "agi-goals" || (goal && typeof goal === "string")) {
      // Add a new goal (basic create example)
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
      JSON.stringify({ status: "ok", endpoints: ["agi-chat", "agi-goals", "get-agi-goals"] }),
      { headers: corsHeaders }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error?.message || String(error) }), { status: 500, headers: corsHeaders });
  }
});
