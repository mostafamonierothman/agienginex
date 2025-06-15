
// Utility for AGI cross-instance memory/goal coordination

export function mergeAGIMemories(existing: any[], incoming: any[]) {
  // Merge unique memory entries
  if (!existing) existing = [];
  if (!incoming) incoming = [];
  return [
    ...existing,
    ...incoming.filter(
      (im) => !existing.some((em) => em.memory_key === im.memory_key)
    ),
  ];
}

export function mergeAGIGoals(existing: any[], incoming: any[]) {
  // Merge unique goals from incoming queue
  if (!existing) existing = [];
  if (!incoming) incoming = [];
  return [
    ...existing,
    ...incoming.filter(
      (ig) => !existing.some((eg) => eg.goal === ig.goal)
    ),
  ];
}
