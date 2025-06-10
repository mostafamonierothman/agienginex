import { ChatProcessorAgent } from '@/server/agents/ChatProcessorAgent';

export async function routeChatMessage(context: any) {
  try {
    const agent = new ChatProcessorAgent();
    return await agent.runner(context);
  } catch (err) {
    console.error('[AgentChatBus] Routing error:', err);
    return { role: 'assistant', content: 'Sorry, something went wrong.' };
  }
}
