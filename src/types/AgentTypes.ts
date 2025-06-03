
export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
  currentTask?: string;
  performance: number;
  lastAction?: string;
  autonomyLevel: number;
  useBackend?: boolean;
}

export interface TaskAllocation {
  agentId: string;
  task: string;
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  avgPerformance: number;
  avgAutonomy: number;
}

export interface TaskResult {
  action: string;
  importance: number;
}
