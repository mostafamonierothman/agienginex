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

export interface AgentContext {
  input?: any;
  user_id?: string;
  timestamp?: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

export interface AgentRegistryEntry {
  name: string;
  type: string;
  purpose: string;
  config: object;
  created_at?: string;
}

export interface Goal {
  goal: string;
  status: string;
  source: string;
  created_at?: string;
}
