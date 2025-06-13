
import { agentRegistry } from '@/config/AgentRegistry';
import { AgentContext, AgentResponse } from '@/types/AgentTypes';

export async function routeChatMessage(message: string): Promise<AgentResponse> {
  console.log('🚀 Routing chat message:', message);

  try {
    // Create context for the agent
    const context: AgentContext = {
      input: { 
        goal: message,
        sessionId: 'chat_' + Date.now()
      },
      user_id: 'chat_user',
      timestamp: new Date().toISOString()
    };

    // Route to enhanced executive agent by default
    const result = await agentRegistry.runAgent('enhanced_executive_agent', context);
    
    return {
      success: result.success,
      message: result.message,
      content: result.message,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Chat routing error:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      role: 'system',
      timestamp: new Date().toISOString()
    };
  }
}
