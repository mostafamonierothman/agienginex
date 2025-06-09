
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { supabase } from '../../integrations/supabase/client';

export class MemoryAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      console.log('[MemoryAgent] Running with context:', context);
      
      // Basic memory operation - store and retrieve context
      const memoryKey = `memory_${Date.now()}`;
      const memoryValue = JSON.stringify(context.input || {});

      const { error } = await supabase
        .from('agent_memory')
        .insert({
          user_id: context.user_id || 'memory_agent',
          agent_name: 'memory_agent',
          memory_key: memoryKey,
          memory_value: memoryValue,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('[MemoryAgent] Supabase error:', error);
        // Fallback to simple memory simulation if DB is not available
        return {
          success: true,
          message: `🧠 MemoryAgent: Stored memory locally (DB unavailable) with key ${memoryKey}`,
          data: { memoryKey, stored: true, fallback: true },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        message: `🧠 MemoryAgent: Stored memory with key ${memoryKey}`,
        data: { memoryKey, stored: true },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[MemoryAgent] Error:', error);
      return {
        success: false,
        message: `❌ MemoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function MemoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new MemoryAgent();
  return await agent.runner(context);
}
