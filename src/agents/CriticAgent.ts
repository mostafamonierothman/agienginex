
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

export async function CriticAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get recent system activity for evaluation
    const { data: recentActivity, error } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      console.error('CriticAgent data fetch error:', error);
      return {
        success: false,
        message: `❌ CriticAgent data fetch error: ${error.message}`
      };
    }

    const performanceItems = (recentActivity || []).filter(activity =>
      activity && typeof activity === 'object' && 'status' in (activity || {})
    );
    const activityCount = performanceItems.length;
    const successRate = activityCount === 0
      ? 0
      : performanceItems.filter(item => item && (item as any)?.status === 'completed').length / activityCount;
    const performanceScore = (successRate * 100).toFixed(1);
    
    // Generate performance critique
    let critique = '';
    if (successRate >= 0.9) {
      critique = `Excellent system performance at ${performanceScore}% success rate. Continue current optimization strategies.`;
    } else if (successRate >= 0.7) {
      critique = `Good system performance at ${performanceScore}% success rate. Minor optimizations recommended.`;
    } else if (successRate >= 0.5) {
      critique = `Moderate system performance at ${performanceScore}% success rate. Review agent coordination mechanisms.`;
    } else {
      critique = `Low system performance at ${performanceScore}% success rate. Immediate optimization required.`;
    }

    // Store critique in memory
    const memEntry: TablesInsert<'agent_memory'> = {
      user_id: context.user_id || 'demo_user',
      agent_name: 'critic_agent',
      memory_key: 'performance_critique',
      memory_value: critique,
      // timestamp omitted; auto by db
    };
    await supabase
      .from('agent_memory')
      .insert([memEntry]);

    // Log critique to supervisor queue
    const logEntry: TablesInsert<'supervisor_queue'> = {
      user_id: context.user_id || 'demo_user',
      agent_name: 'critic_agent',
      action: 'performance_evaluation',
      input: JSON.stringify({ activity_count: activityCount }),
      status: 'completed',
      output: critique,
      // don't set timestamp or id; handled by db
    };
    await supabase
      .from('supervisor_queue')
      .insert([logEntry]);

    console.log(`🎭 CriticAgent evaluation: ${critique}`);

    return {
      success: true,
      message: `🎭 System Critique: ${critique}`,
      data: { 
        performanceScore: parseFloat(performanceScore),
        successRate,
        activityCount,
        critique 
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('CriticAgent error:', error);
    return {
      success: false,
      message: `❌ CriticAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function CriticAgentRunner(context: AgentContext): Promise<AgentResponse> {
  return await CriticAgent(context);
}
