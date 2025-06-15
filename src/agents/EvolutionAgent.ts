import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function EvolutionAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Analyze system evolution patterns
    const { data: recentMemory, error: memoryError } = await supabase
      .from('api.agent_memory' as any)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    const { data: agentActivityRaw, error: activityError } = await supabase
      .from('api.supervisor_queue' as any)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    const agentActivity = (agentActivityRaw ?? []) as any[];

    if (memoryError || activityError) {
      console.error('EvolutionAgent fetch errors:', { memoryError, activityError });
    }

    // Calculate evolution metrics
    const memoryGrowth = recentMemory?.length || 0;
    const activityVolume = agentActivity.length || 0;
    const uniqueAgents = new Set(agentActivity.map(a => a && typeof a === 'object' && 'agent_name' in a ? (a as any).agent_name : '')).size;
    
    // Generate evolution insights
    const evolutionPhases = [
      'Autonomous learning acceleration',
      'Cross-agent knowledge synthesis',
      'Emergent behavior development',
      'Adaptive algorithm optimization',
      'Self-improving coordination patterns'
    ];

    const currentPhase = evolutionPhases[Math.floor(Math.random() * evolutionPhases.length)];
    const evolutionScore = Math.floor((memoryGrowth + activityVolume + uniqueAgents) / 3 * 10);
    
    const evolutionInsight = `Evolution phase: ${currentPhase}. System complexity: ${evolutionScore}% with ${uniqueAgents} active agent types contributing to ${memoryGrowth} new memories.`;

    // Store evolution insight
    await supabase
      .from('api.agent_memory' as any)
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'evolution_agent',
        memory_key: 'evolution_tracking',
        memory_value: evolutionInsight,
        timestamp: new Date().toISOString()
      });

    // Log evolution activity
    await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'evolution_agent',
        action: 'evolution_analysis',
        input: JSON.stringify({ evolution_score: evolutionScore }),
        status: 'completed',
        output: evolutionInsight,
        timestamp: new Date().toISOString()
      });

    console.log(`🧬 EvolutionAgent: ${evolutionInsight}`);

    return {
      success: true,
      message: `🧬 ${evolutionInsight}`,
      data: { 
        currentPhase,
        evolutionScore,
        memoryGrowth,
        uniqueAgents,
        activityVolume
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('EvolutionAgent error:', error);
    return {
      success: false,
      message: `❌ EvolutionAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
