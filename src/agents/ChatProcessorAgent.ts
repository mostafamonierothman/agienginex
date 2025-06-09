
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { agentRegistry } from '@/config/AgentRegistry';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class ChatProcessorAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const userMessage = context.input?.message || '';
      
      console.log('[ChatProcessorAgent] Processing user message:', userMessage);
      console.log('[ChatProcessorAgent] Routing message to LLMExecutiveAgent...');

      // Save user message to chat history
      await saveChatMessage('User', userMessage);

      // Forward the message to LLMExecutiveAgent for GPT-4o processing
      const llmResponse = await agentRegistry.llm_executive_agent.runner({
        user_id: context.user_id || 'chat_user',
        input: {
          goal: 'Respond to user chat message',
          context: `User said: "${userMessage}"`,
          message: userMessage
        },
        timestamp: new Date().toISOString()
      });

      // The LLMExecutiveAgent already saves its response, so we just return it
      return llmResponse;

    } catch (error) {
      console.error('[ChatProcessorAgent] Error:', error);
      return {
        success: false,
        message: `❌ ChatProcessorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function ChatProcessorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ChatProcessorAgent();
  return await agent.runner(context);
}
