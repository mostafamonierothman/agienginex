
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { agentChatBus } from '@/engine/AgentChatBus';

export class SystemContextAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      console.log('[SystemContextAgent] Loading system context...');

      // Get recent chat history
      const { data: chatHistory } = await supabase
        .from('agent_memory')
        .select('agent_name, memory_value, timestamp')
        .eq('memory_key', 'chat_message')
        .order('timestamp', { ascending: false })
        .limit(50);

      // Get system metrics
      const { data: systemActivity } = await supabase
        .from('supervisor_queue')
        .select('agent_name, action, status, timestamp')
        .order('timestamp', { ascending: false })
        .limit(20);

      // Get current chat bus messages
      const liveChatMessages = agentChatBus.getMessages();

      const contextSummary = `
# System Context Summary
## Recent Chat History (${chatHistory?.length || 0} messages):
${chatHistory?.map(h => `${h.timestamp}: ${h.agent_name} - ${h.memory_value.substring(0, 100)}...`).join('\n') || 'No chat history'}

## System Activity (${systemActivity?.length || 0} actions):
${systemActivity?.map(a => `${a.timestamp}: ${a.agent_name} ${a.action} (${a.status})`).join('\n') || 'No system activity'}

## Live Chat Bus (${liveChatMessages.length} messages):
${liveChatMessages.map(m => `${m.timestamp}: ${m.agent} - ${m.message.substring(0, 100)}...`).join('\n') || 'No live messages'}
`;

      return {
        success: true,
        message: `🧠 SystemContextAgent: Loaded context with ${chatHistory?.length || 0} chat messages and ${systemActivity?.length || 0} system activities`,
        data: { contextSummary },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ SystemContextAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function SystemContextAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new SystemContextAgent();
  return await agent.runner(context);
}
