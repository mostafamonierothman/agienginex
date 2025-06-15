export type AGIState = {
  running: boolean;
  currentGoal: string | null;
  completedGoals: { goal: string; result: string; timestamp: string }[];
  memoryKeys: string[];
  logs: string[];
  generation: number;
  // --- NEW for dynamic knowledge/world state
  lastRecalledWorldState?: any[];
  // --- Phase 2 activation flag
  phase2?: boolean;
};
