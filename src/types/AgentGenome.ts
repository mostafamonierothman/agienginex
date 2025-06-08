
export interface AgentGenome {
  learning_rate: number;
  exploration_bias: number;
  collaboration_tendency: number;
  memory_depth: number;
  creativity_factor: number;
  generation: number;
  parent_agents?: string[];
}

export interface EvolutionMetrics {
  fitness_score: number;
  adaptability: number;
  efficiency: number;
  innovation_rate: number;
}

export interface AgentRelationship {
  agent_a: string;
  agent_b: string;
  relationship_type: 'collaboration' | 'competition' | 'mentor' | 'peer';
  trust_level: number;
  interaction_count: number;
  success_rate: number;
}
