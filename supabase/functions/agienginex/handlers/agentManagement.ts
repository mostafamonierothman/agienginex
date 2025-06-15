
export async function deployAgent(agentName: string, agent_goal: string) {
  const agentNameToUse = agentName || ("agent-" + Date.now());
  return {
    success: true,
    response: `Agent "${agentNameToUse}" deployed and registered.`,
    agent_name: agentNameToUse,
    agent_id: Date.now().toString()
  };
}

export async function startOrStopAgent(name: string, action: "start" | "stop") {
  if (!name) return { success: false, error: "agent_name required" };
  return {
    success: true,
    response: `Agent "${name}" ${action}ed.`,
    agent_id: Date.now().toString(),
    performance_score: 0
  };
}

export async function listAgents() {
  const agents = [
    { agent_name: "lead-gen-agent", status: "active", performance_score: 85 },
    { agent_name: "market-research-agent", status: "idle", performance_score: 70 }
  ];
  const lines = agents.map((a: any) =>
    `- ${a.agent_name} (${a.status}, Performance: ${a.performance_score ?? 0}%)`
  );
  return {
    success: true,
    agents: agents,
    response: `Agents:\n${lines.join("\n")}`,
  };
}
