import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { UpgradedSupervisor } from '@/core/UpgradedSupervisor';

export class MetaAgent {
  private supervisor: UpgradedSupervisor;

  constructor(supervisor: UpgradedSupervisor) {
    this.supervisor = supervisor;
  }

  async analyzeSystem(): Promise<any> {
    const systemStatus = this.supervisor.getSystemStatus();
    
    // Get recent activity data
    const { data: recentActivity } = await supabase
      .from('api.supervisor_queue' as any)
      .select('agent_name, status')
      .gte('timestamp', new Date(Date.now() - 3600000).toISOString()) // Last hour
      .order('timestamp', { ascending: false });

    // Analyze agent performance
    const agentStats: Record<string, { total: number; successful: number }> = {};
    (Array.isArray(recentActivity) ? recentActivity : []).forEach(activity => {
      if (!activity || typeof activity !== "object" || !('agent_name' in activity)) return;
      const agentName = (activity as any)?.agent_name;
      if (!agentStats[agentName]) {
        agentStats[agentName] = { total: 0, successful: 0 };
      }
      agentStats[agentName].total++;
      if ((activity as any)?.status === 'completed') {
        agentStats[agentName].successful++;
      }
    });

    // Calculate success rates
    const agentPerformance = Object.entries(agentStats).map(([name, stats]: [string, any]) => ({
      name,
      successRate: (stats.successful / stats.total) * 100,
      totalActions: stats.total
    }));

    return {
      systemStatus,
      agentPerformance,
      recommendations: this.generateRecommendations(systemStatus, agentPerformance),
      timestamp: new Date().toISOString()
    };
  }

  private generateRecommendations(systemStatus: any, agentPerformance: any[]): string[] {
    const recommendations = [];

    if (systemStatus.avgPerformance < 80) {
      recommendations.push('System performance below optimal - consider agent optimization');
    }

    if (systemStatus.healthyAgents < systemStatus.totalAgents) {
      recommendations.push('Some agents showing degraded health - investigate and restart if needed');
    }

    const lowPerformers = agentPerformance.filter(agent => agent.successRate < 70);
    if (lowPerformers.length > 0) {
      recommendations.push(`Low-performing agents detected: ${lowPerformers.map(a => a.name).join(', ')}`);
    }

    if (recommendations.length === 0) {
      recommendations.push('System operating at optimal levels - continue current operations');
    }

    return recommendations;
  }
}

export async function MetaAgentRunner(context: AgentContext): Promise<AgentResponse> {
  try {
    const supervisor = new UpgradedSupervisor();
    const metaAgent = new MetaAgent(supervisor);
    const analysis = await metaAgent.analyzeSystem();

    // Log to supervisor queue
    await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: context.user_id || 'meta_agent',
        agent_name: 'meta_agent',
        action: 'system_analysis',
        input: JSON.stringify({ action: 'analyze_system_performance' }),
        status: 'completed',
        output: `Analysis complete. ${analysis.recommendations.length} recommendations generated.`
      });

    return {
      success: true,
      message: `🔍 MetaAgent analyzed system → ${analysis.recommendations[0]}`,
      data: analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ MetaAgent error: ${error.message}`
    };
  }
}
