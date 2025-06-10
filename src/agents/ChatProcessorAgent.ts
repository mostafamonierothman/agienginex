
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SupabaseMemoryService } from '@/services/SupabaseMemoryService';
import { LLMExecutiveAgent } from './LLMExecutiveAgent';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class ChatProcessorAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    const sessionId = context?.input?.sessionId || 'default';
    const message = context?.input?.message || '';

    try {
      const memory = await SupabaseMemoryService.loadMemory(sessionId);

      const prompt = `User: ${message}\nMemory: ${JSON.stringify(memory)}\nRespond as an assistant.`;
      const executive = new LLMExecutiveAgent();

      const response = await executive.runner({ input: { goal: prompt, sessionId } });

      await SupabaseMemoryService.saveMemory(sessionId, { input: message, response });
      await saveChatMessage(sessionId, 'user', message);
      await saveChatMessage(sessionId, 'assistant', response.content || response.message);

      return {
        success: true,
        message: response.content || response.message || 'No response',
        role: 'assistant',
        content: response.content || response.message || 'No response',
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error('[ChatProcessorAgent] Error:', e);
      return { 
        success: false,
        message: 'Sorry, something went wrong.',
        role: 'assistant', 
        content: 'Sorry, something went wrong.',
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function ChatProcessorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ChatProcessorAgent();
  return await agent.runner(context);
}
