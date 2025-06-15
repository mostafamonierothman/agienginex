
export function sanitizeAgentName(name: string): string {
  // Only kebab-case, lowercase, 3-48 chars, no slashes, always .ts at end
  let cleaned = name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  cleaned = cleaned.replace(/--+/g, "-").slice(0, 48).replace(/^-+|-+$/g, "");
  return cleaned.length >= 3 ? cleaned : `agent-${Date.now()}`;
}

export function safeAgentFilePath(agentName: string): string {
  const safeName = sanitizeAgentName(agentName);
  return `agents/${safeName}.ts`; // controlled location, .ts only
}
