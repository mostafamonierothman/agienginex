
import { EnhancedCollaborationAgent } from '@/agents/EnhancedCollaborationAgent';

export class DeepLoopCollaboration {
  private collaborationAgent: EnhancedCollaborationAgent;
  private lastHandoffTime: number = 0;

  constructor() {
    this.collaborationAgent = new EnhancedCollaborationAgent();
  }

  async handleHandoff(
    selectedAgent: any,
    response: any,
    agents: any[],
    goalTask: any,
    setLogs: Function
  ): Promise<boolean> {
    if (!response.nextAgent || Date.now() - this.lastHandoffTime <= 5000) {
      return false;
    }

    const nextAgent = agents.find(a => a.name === response.nextAgent);
    if (!nextAgent) {
      return false;
    }

    try {
      console.log(`[COLLABORATION] ${selectedAgent.name} → Handoff to ${response.nextAgent}`);
      
      const handoff = await this.collaborationAgent.coordinateAgentHandoff(
        selectedAgent.name,
        response.nextAgent,
        { 
          previousOutput: response.message, 
          goalContext: goalTask || { goal: 'default', subgoal: 'none' } 
        }
      );

      if (handoff.success) {
        this.lastHandoffTime = Date.now();

        const nextResponse = await nextAgent.runner({
          input: { 
            handoffData: handoff.handoffData,
            previousAgent: selectedAgent.name,
            cycle: Date.now()
          },
          user_id: 'deep_loop_system'
        });

        setLogs(prev => [...prev, {
          agent: nextAgent.name,
          action: `Handoff from ${selectedAgent.name}`,
          result: nextResponse.message || nextResponse.output || 'No response'
        }]);

        return true;
      }
    } catch (error) {
      console.error('[COLLABORATION] Handoff error:', error);
    }

    return false;
  }

  async initiateCollaboration(cycle: number, goalTask: any, setLogs: Function): Promise<boolean> {
    try {
      const collaborationResponse = await this.collaborationAgent.runner({
        input: { 
          action: 'coordinate',
          topic: goalTask ? goalTask.goal : 'System optimization',
          cycle
        },
        user_id: 'deep_loop_system'
      });

      if (collaborationResponse.success) {
        setLogs(prev => [...prev, {
          agent: 'EnhancedCollaborationAgent',
          action: 'Multi-agent collaboration',
          result: collaborationResponse.message || 'Collaboration initiated'
        }]);
        return true;
      }
    } catch (error) {
      console.error('[COLLABORATION] Collaboration error:', error);
    }

    return false;
  }
}
