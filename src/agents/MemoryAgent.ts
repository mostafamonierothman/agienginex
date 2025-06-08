
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class MemoryAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      // Basic memory operation - store and retrieve context
      const memoryKey = `memory_${Date.now()}`;
      const memoryValue = JSON.stringify(context.input || {});

      await supabase
        .from('agent_memory')
        .insert({
          user_id: context.user_id || 'memory_agent',
          agent_name: 'memory_agent',
          memory_key: memoryKey,
          memory_value: memoryValue,
          timestamp: new Date().toISOString()
        });

      return {
        success: true,
        message: `🧠 MemoryAgent: Stored memory with key ${memoryKey}`,
        data: { memoryKey, stored: true },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ MemoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function MemoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new MemoryAgent();
  return await agent.runner(context);
}
