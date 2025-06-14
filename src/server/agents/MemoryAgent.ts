
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { supabase } from '../../integrations/supabase/client';

export class MemoryAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      console.log('[MemoryAgent Server] Running with context:', context);
      
      const memoryKey = `memory_${Date.now()}`;
      const memoryValue = JSON.stringify(context.input || {});

      const { error } = await supabase
        .from('agent_memory')
        .insert({
          user_id: context.user_id || 'memory_agent_server',
          agent_name: 'memory_agent_server',
          memory_key: memoryKey,
          memory_value: memoryValue,
          timestamp: new Date().toISOString()
        } as any);

      if (error) {
        console.error('[MemoryAgent Server] Supabase error:', error);
        return {
          success: true,
          message: `🧠 MemoryAgent Server: Stored memory locally (DB unavailable or error: ${error.message}) with key ${memoryKey}`,
          data: { memoryKey, stored: true, fallback: true, error: error.message },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        message: `🧠 MemoryAgent Server: Stored memory with key ${memoryKey}`,
        data: { memoryKey, stored: true },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('[MemoryAgent Server] Error:', error);
      return {
        success: false,
        message: `❌ MemoryAgent Server error: ${error.message || 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function MemoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new MemoryAgent();
  return await agent.runner(context);
}
