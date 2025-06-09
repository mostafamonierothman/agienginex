import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { saveChatMessage } from '@/utils/saveChatMessage';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

// In-memory storage (replace later with DB if needed)
let memoryStore = {
  lastActionResult: '',
  userPreferences: {},
  chatSummary: '',
  orchestrationHistory: [] as any[],
  agentPerformance: {} as Record<string, number>
};

export class EnhancedMemoryAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const input = context.input || {};

      // Detect user preferences
      if (input.userMessage?.includes('fast')) {
        memoryStore.userPreferences['responseStyle'] = 'fast';
        await sendChatUpdate('🧠 Memory: Detected preference for fast responses');
      }

      if (input.userMessage?.includes('detailed')) {
        memoryStore.userPreferences['responseStyle'] = 'detailed';
        await sendChatUpdate('🧠 Memory: Detected preference for detailed responses');
      }

      // Store last action result
      if (input.lastAgentResult) {
        memoryStore.lastActionResult = input.lastAgentResult;
        await sendChatUpdate('🧠 Memory: Stored last agent result');
      }

      // Track orchestration cycles
      if (input.orchestrationData) {
        memoryStore.orchestrationHistory.push({
          timestamp: new Date().toISOString(),
          data: input.orchestrationData
        });
        
        // Keep only last 10 orchestration cycles
        if (memoryStore.orchestrationHistory.length > 10) {
          memoryStore.orchestrationHistory = memoryStore.orchestrationHistory.slice(-10);
        }
      }

      // Track agent performance
      if (input.agentName && input.performance) {
        memoryStore.agentPerformance[input.agentName] = input.performance;
      }

      await saveChatMessage('EnhancedMemoryAgent', 
        `Memory updated. LastActionResult: ${memoryStore.lastActionResult}, UserPrefs: ${JSON.stringify(memoryStore.userPreferences)}`
      );

      return {
        success: true,
        message: '🧠 Enhanced memory updated successfully',
        data: {
          memoryStats: {
            preferencesCount: Object.keys(memoryStore.userPreferences).length,
            orchestrationHistoryCount: memoryStore.orchestrationHistory.length,
            trackedAgentsCount: Object.keys(memoryStore.agentPerformance).length
          }
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        message: `❌ EnhancedMemoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Static getter for other agents
  static getMemory() {
    return { ...memoryStore };
  }

  static getUserPreferences() {
    return { ...memoryStore.userPreferences };
  }

  static getOrchestrationHistory() {
    return [...memoryStore.orchestrationHistory];
  }

  static getAgentPerformance() {
    return { ...memoryStore.agentPerformance };
  }
}

export async function EnhancedMemoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new EnhancedMemoryAgent();
  return await agent.runner(context);
}
