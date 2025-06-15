
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

export async function CollaborationAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Analyze inter-agent collaboration patterns
    const { data: recentActivity, error } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('CollaborationAgent fetch error:', error);
      return {
        success: false,
        message: `❌ CollaborationAgent fetch error: ${error.message}`
      };
    }

    // Analyze collaboration patterns
    const agentInteractions = (recentActivity || []).reduce((acc, activity) => {
      const agentName = activity && (activity as any).agent_name || 'unknown';
      const action = activity && (activity as any).action || 'unknown';
      const key = `${agentName}-${action}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalInteractions = Object.values(agentInteractions).reduce((sum, count) => sum + count, 0);
    const uniqueAgents = new Set((recentActivity || []).map(a => a && (a as any).agent_name)).size;
    const collaborationScore = Math.min(100, (uniqueAgents * totalInteractions) / 10);

    // Generate collaboration insights
    const collaborationStrategies = [
      'Enhanced cross-agent information sharing',
      'Synchronized task execution protocols',
      'Distributed problem-solving networks',
      'Collaborative learning reinforcement',
      'Multi-agent consensus mechanisms'
    ];

    const selectedStrategy = collaborationStrategies[Math.floor(Math.random() * collaborationStrategies.length)];
    const collaborationInsight = `Collaboration strategy: ${selectedStrategy}. Network efficiency: ${collaborationScore.toFixed(1)}% across ${uniqueAgents} agents with ${totalInteractions} interactions.`;

    // Store collaboration insight
    const collabMem: TablesInsert<'agent_memory'> = {
      user_id: context.user_id || 'demo_user',
      agent_name: 'collaboration_agent',
      memory_key: 'collaboration_analysis',
      memory_value: collaborationInsight,
      // timestamp omitted; DB handles default
    };
    await supabase
      .from('agent_memory')
      .insert([collabMem]);

    // Log collaboration activity
    const collabLog: TablesInsert<'supervisor_queue'> = {
      user_id: context.user_id || 'demo_user',
      agent_name: 'collaboration_agent',
      action: 'collaboration_optimization',
      input: JSON.stringify({ collaboration_score: collaborationScore }),
      status: 'completed',
      output: collaborationInsight,
    };
    await supabase
      .from('supervisor_queue')
      .insert([collabLog]);

    console.log(`🤝 CollaborationAgent: ${collaborationInsight}`);

    return {
      success: true,
      message: `🤝 ${collaborationInsight}`,
      data: { 
        selectedStrategy,
        collaborationScore: parseFloat(collaborationScore.toFixed(1)),
        uniqueAgents,
        totalInteractions,
        topInteractions: Object.entries(agentInteractions).slice(0, 5)
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('CollaborationAgent error:', error);
    return {
      success: false,
      message: `❌ CollaborationAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

