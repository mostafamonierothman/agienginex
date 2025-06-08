
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function StrategicAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get system goals and performance data
    const { data: goals, error: goalsError } = await supabase
      .from('agi_goals_enhanced')
      .select('*')
      .eq('status', 'active')
      .order('priority', { ascending: false });

    const { data: recentActivity, error: activityError } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (goalsError || activityError) {
      console.error('StrategicAgent fetch errors:', { goalsError, activityError });
    }

    const activeGoals = goals?.length || 0;
    const completedActivities = recentActivity?.filter(a => a.status === 'completed').length || 0;
    const totalActivities = recentActivity?.length || 0;
    const successRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    // Generate strategic insights
    const strategies = [
      'Optimize agent workflow efficiency',
      'Enhance cross-agent communication',
      'Implement adaptive learning protocols',
      'Strengthen goal achievement metrics',
      'Develop autonomous decision frameworks'
    ];

    const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    const strategicPlan = `Strategic focus: ${selectedStrategy}. Current system efficiency: ${successRate.toFixed(1)}% with ${activeGoals} active goals.`;

    // Store strategic insight
    await supabase
      .from('agent_memory')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'strategic_agent',
        memory_key: 'strategic_plan',
        memory_value: strategicPlan,
        timestamp: new Date().toISOString()
      });

    // Log strategic activity
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'strategic_agent',
        action: 'strategic_planning',
        input: JSON.stringify({ success_rate: successRate }),
        status: 'completed',
        output: strategicPlan,
        timestamp: new Date().toISOString()
      });

    console.log(`🎯 StrategicAgent: ${strategicPlan}`);

    return {
      success: true,
      message: `🎯 ${strategicPlan}`,
      data: { 
        activeGoals,
        successRate: parseFloat(successRate.toFixed(1)),
        selectedStrategy,
        totalActivities
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('StrategicAgent error:', error);
    return {
      success: false,
      message: `❌ StrategicAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
