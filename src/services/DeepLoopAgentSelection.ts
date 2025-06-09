
import { EnhancedGoalAgent } from '@/agents/EnhancedGoalAgent';

export class DeepLoopAgentSelection {
  private goalAgent: EnhancedGoalAgent;

  constructor() {
    this.goalAgent = new EnhancedGoalAgent();
  }

  selectAgent(
    agents: any[], 
    agentPriority: Record<string, number>, 
    errorRecoveryMode: boolean
  ): { selectedAgent: any; goalTask: any } {
    let goalTask = null;
    let selectedAgent: any;
    
    if (errorRecoveryMode) {
      // In recovery mode, prioritize stable agents
      const stableAgents = agents.filter(a => (agentPriority[a.name] || 1) >= 3);
      selectedAgent = stableAgents.length > 0 ? 
        stableAgents[Math.floor(Math.random() * stableAgents.length)] : 
        agents[0];
    } else {
      try {
        goalTask = this.goalAgent.getNextSubgoal();
        
        if (goalTask) {
          // Select agent based on goal requirements
          const goalKeywords = goalTask.subgoal.toLowerCase();
          if (goalKeywords.includes('research')) {
            selectedAgent = agents.find(a => a.name.includes('Research')) || agents[0];
          } else if (goalKeywords.includes('learn')) {
            selectedAgent = agents.find(a => a.name.includes('Learning')) || agents[0];
          } else if (goalKeywords.includes('strategic')) {
            selectedAgent = agents.find(a => a.name.includes('Strategic')) || agents[0];
          } else {
            selectedAgent = this.selectByPriority(agents, agentPriority);
          }
        } else {
          selectedAgent = this.selectByPriority(agents, agentPriority);
        }
      } catch (error) {
        console.error('[AGENT SELECTION] Goal agent error:', error);
        selectedAgent = this.selectByPriority(agents, agentPriority);
      }
    }

    return { selectedAgent, goalTask };
  }

  private selectByPriority(agents: any[], agentPriority: Record<string, number>): any {
    // Weighted random selection
    const weightedAgents = agents.flatMap(agent =>
      Array(agentPriority[agent.name] || 1).fill(agent)
    );
    return weightedAgents[Math.floor(Math.random() * weightedAgents.length)];
  }
}
