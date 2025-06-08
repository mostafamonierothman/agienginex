
import { AgentGenome, EvolutionMetrics } from '@/types/AgentGenome';
import { agiApiClient } from '@/services/AGIApiClient';

export class EvolutionaryFactory {
  static generateRandomGenome(): AgentGenome {
    return {
      learning_rate: Math.random() * 0.5 + 0.1, // 0.1 to 0.6
      exploration_bias: Math.random(),
      collaboration_tendency: Math.random(),
      memory_depth: Math.floor(Math.random() * 1000) + 100, // 100 to 1100
      creativity_factor: Math.random(),
      generation: 1,
      parent_agents: []
    };
  }

  static crossoverGenomes(parent1: AgentGenome, parent2: AgentGenome): AgentGenome {
    return {
      learning_rate: (parent1.learning_rate + parent2.learning_rate) / 2,
      exploration_bias: Math.random() > 0.5 ? parent1.exploration_bias : parent2.exploration_bias,
      collaboration_tendency: (parent1.collaboration_tendency + parent2.collaboration_tendency) / 2,
      memory_depth: Math.floor((parent1.memory_depth + parent2.memory_depth) / 2),
      creativity_factor: Math.random() > 0.5 ? parent1.creativity_factor : parent2.creativity_factor,
      generation: Math.max(parent1.generation, parent2.generation) + 1,
      parent_agents: [
        ...(parent1.parent_agents || []).slice(-2),
        ...(parent2.parent_agents || []).slice(-2)
      ]
    };
  }

  static mutateGenome(genome: AgentGenome, mutationRate: number = 0.1): AgentGenome {
    const mutated = { ...genome };
    
    if (Math.random() < mutationRate) {
      mutated.learning_rate = Math.max(0.01, Math.min(1.0, mutated.learning_rate + (Math.random() - 0.5) * 0.2));
    }
    if (Math.random() < mutationRate) {
      mutated.exploration_bias = Math.max(0, Math.min(1, mutated.exploration_bias + (Math.random() - 0.5) * 0.3));
    }
    if (Math.random() < mutationRate) {
      mutated.collaboration_tendency = Math.max(0, Math.min(1, mutated.collaboration_tendency + (Math.random() - 0.5) * 0.3));
    }
    if (Math.random() < mutationRate) {
      mutated.creativity_factor = Math.max(0, Math.min(1, mutated.creativity_factor + (Math.random() - 0.5) * 0.3));
    }
    
    return mutated;
  }

  static async spawnEvolvedAgent(genome: AgentGenome, generation: number): Promise<string> {
    const agentName = `EvoAgent_Gen${generation}_${Date.now()}`;
    
    await agiApiClient.installAgent({
      agent_name: agentName,
      agent_type: 'Evolved',
      purpose: `Gen-${generation} evolved agent with enhanced capabilities`,
      config: {
        genome,
        evolved: true,
        generation,
        spawn_time: new Date().toISOString()
      }
    });

    console.log(`🧬 Spawned evolved agent: ${agentName} (Generation ${generation})`);
    return agentName;
  }
}
