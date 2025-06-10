import { ChatProcessorAgent } from '@/server/agents/ChatProcessorAgent';

export async function routeChatMessage(context: any) {
  const agent = new ChatProcessorAgent();
  return await agent.runner(context);
}
