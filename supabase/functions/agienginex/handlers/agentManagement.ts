
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { sanitizeAgentName, safeAgentFilePath } from "../utils/sanitization.ts";

export async function deployAgent(
  agentName: string,
  prompt: string,
  openAIApiKey: string,
  supabase: any
) {
  const deployName = sanitizeAgentName(agentName);
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

  // Sanity check: ensure only code, and doesn't try to do fs writes, imports etc
  if (agentCode.toLowerCase().includes("require(") || agentCode.toLowerCase().includes("fs.")) {
    throw new Error("Unsafe code detected!");
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
  if (regErr) throw regErr;
  const agentId = regData?.id;

  // Save code to versioned file + version table
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
  if (vErr) throw vErr;

  // Log in agent_memory
  await supabase.from("agent_memory").insert({
    user_id: "chat_user",
    agent_name: deployName,
    memory_key: "deployment",
    memory_value: "deployed via chat",
    timestamp: new Date().toISOString(),
  });

  return {
    agent_name: deployName,
    agent_id: agentId,
    version: latestVersion,
    filepath
  };
}

export async function startAgent(agentName: string, supabase: any) {
  const name = sanitizeAgentName(agentName);
  const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", name).maybeSingle();
  if (!agent || error) throw new Error("Agent not found");
  
  await supabase.from("agent_registry").update({
    status: "running",
    last_started_at: new Date().toISOString()
  }).eq("id", agent.id);
  
  return agent;
}

export async function stopAgent(agentName: string, supabase: any) {
  const name = sanitizeAgentName(agentName);
  const { data: agent, error } = await supabase.from("agent_registry").select("*").ilike("agent_name", name).maybeSingle();
  if (!agent || error) throw new Error("Agent not found");
  
  await supabase.from("agent_registry").update({
    status: "stopped",
    last_stopped_at: new Date().toISOString()
  }).eq("id", agent.id);
  
  return agent;
}

export async function listAgents(supabase: any) {
  const { data: agents, error } = await supabase.from("agent_registry").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return agents || [];
}
