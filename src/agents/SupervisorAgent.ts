
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function SupervisorAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get current system status
    const { data: goals, error: goalsError } = await supabase
      .from('agi_goals_enhanced')
      .select('*')
      .eq('status', 'active')
      .order('priority', { ascending: false });

    const { data: memory, error: memoryError } = await supabase
      .from('agent_memory')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);

    const { data: activity, error: activityError } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (goalsError || memoryError || activityError) {
      console.error('SupervisorAgent data fetch errors:', { goalsError, memoryError, activityError });
    }

    const activeGoals = goals?.length || 0;
    const recentMemories = memory?.length || 0;
    const recentActivity = activity?.length || 0;
    
    // Agent status assessment
    const agentTypes = ['strategic', 'opportunity', 'learning', 'coordination', 'memory', 'critic', 'factory', 'research'];
    const activeAgents = agentTypes.length;

    const systemStatus = {
      active_goals: activeGoals,
      active_agents: activeAgents,
      recent_memories: recentMemories,
      recent_activity: recentActivity,
      system_health: 'operational'
    };

    const statusMessage = `System Status: ${activeAgents} agents active, ${activeGoals} goals tracked, ${recentActivity} recent operations`;

    // Log supervision activity
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'supervisor_agent',
        action: 'system_supervision',
        input: JSON.stringify({ monitoring: 'full_system' }),
        status: 'completed',
        output: statusMessage,
        timestamp: new Date().toISOString()
      });

    console.log(`🕹️ SupervisorAgent status: ${statusMessage}`);

    return {
      success: true,
      message: `🕹️ ${statusMessage}`,
      data: systemStatus,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('SupervisorAgent error:', error);
    return {
      success: false,
      message: `❌ SupervisorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
