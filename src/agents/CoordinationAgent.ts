import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function CoordinationAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get recent agent activities to coordinate
    const { data: recentActivity, error } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) {
      console.error('CoordinationAgent data fetch error:', error);
      return {
        success: false,
        message: `❌ CoordinationAgent data fetch error: ${error.message}`
      };
    }

    // Analyze agent coordination patterns
    const agentActivities = (recentActivity || []).reduce((acc: any, activity: any) => {
      if (activity && typeof activity === 'object' && 'agent_name' in activity) {
        const agentName = (activity.agent_name as string) || 'unknown';
        acc[agentName] = (acc[agentName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const totalActivities = Object.values(agentActivities).reduce((sum: number, count: unknown) => sum + (typeof count === 'number' ? count : 0), 0 as number);
    const activeAgentCount = Object.keys(agentActivities).length;
    
    // Generate coordination strategy
    const coordination = `Coordinating ${activeAgentCount} agents across ${totalActivities} activities. Optimizing workflow distribution and resource allocation.`;

    // Store coordination insights
    await supabase
      .from('agent_memory')
      .insert([{
        user_id: context.user_id || 'demo_user',
        agent_name: 'coordination_agent',
        memory_key: 'coordination_strategy',
        memory_value: coordination,
        timestamp: new Date().toISOString()
      } as any]);

    // Log coordination activity
    await supabase
      .from('supervisor_queue')
      .insert([{
        user_id: context.user_id || 'demo_user',
        agent_name: 'coordination_agent',
        action: 'agent_coordination',
        input: JSON.stringify({ active_agents: activeAgentCount }),
        status: 'completed',
        output: coordination
      } as any]);

    console.log(`🤝 CoordinationAgent: ${coordination}`);

    return {
      success: true,
      message: `🤝 ${coordination}`,
      data: { 
        activeAgents: activeAgentCount,
        totalActivities,
        agentDistribution: agentActivities
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('CoordinationAgent error:', error);
    return {
      success: false,
      message: `❌ CoordinationAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
