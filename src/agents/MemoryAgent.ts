
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function MemoryAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get memory statistics from existing agent_memory table
    const { data: memoryData, error: memoryError } = await supabase
      .from('agent_memory')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (memoryError) {
      console.error('MemoryAgent fetch error:', memoryError);
    }

    const memoryCount = memoryData?.length || 0;
    
    // Analyze memory patterns
    const memoryTypes = memoryData?.reduce((acc, memory) => {
      const key = memory.memory_key || 'unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const memoryInsight = `Managing ${memoryCount} memories. Top patterns: ${Object.keys(memoryTypes).slice(0, 3).join(', ')}.`;

    // Store memory management insight
    await supabase
      .from('agent_memory')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'memory_agent',
        memory_key: 'memory_management',
        memory_value: memoryInsight,
        timestamp: new Date().toISOString()
      });

    // Log memory activity
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'memory_agent',
        action: 'memory_management',
        input: JSON.stringify({ total_memories: memoryCount }),
        status: 'completed',
        output: memoryInsight,
        timestamp: new Date().toISOString()
      });

    console.log(`🧠 MemoryAgent: ${memoryInsight}`);

    return {
      success: true,
      message: `🧠 ${memoryInsight}`,
      data: { 
        totalMemories: memoryCount,
        memoryTypes
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('MemoryAgent error:', error);
    return {
      success: false,
      message: `❌ MemoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
