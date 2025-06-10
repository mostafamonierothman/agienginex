import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SupabaseMemoryService } from '@/services/SupabaseMemoryService';
import { LLMExecutiveAgent } from './LLMExecutiveAgent';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class ChatProcessorAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    const sessionId = context?.input?.sessionId || 'default';
    const message = context?.input?.message || '';

    try {
      // 1. Load memory
      const memory = await SupabaseMemoryService.loadMemory(sessionId);

      // 2. Build context-aware prompt
      const prompt = `User: ${message}\nMemory: ${JSON.stringify(memory)}\nRespond as a helpful assistant.`;

      // 3. Run decision through executive agent
      const executive = new LLMExecutiveAgent();
      const response = await executive.runner({
        input: { goal: prompt, sessionId }
      });

      // 4. Save memory and chat logs
      await SupabaseMemoryService.saveMemory(sessionId, { input: message, response });
      await saveChatMessage({ sessionId, role: 'user', message });
      await saveChatMessage({ sessionId, role: 'assistant', message: response.content });

      return response;
    } catch (e) {
      console.error('[ChatProcessorAgent] Error:', e);
      return { role: 'assistant', content: 'Sorry, something went wrong.' };
    }
  }
}
