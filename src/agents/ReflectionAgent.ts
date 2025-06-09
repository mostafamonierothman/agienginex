
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

export class ReflectionAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🔍 ReflectionAgent: Analyzing system progress toward trillion-dollar goal...');

      // Get recent system activity and performance
      const systemAnalysis = await this.analyzeSystemPerformance();
      const goalProgress = await this.evaluateGoalProgress();
      const agentEffectiveness = await this.assessAgentEffectiveness();
      
      // Generate reflection insights
      const reflection = await this.generateReflection(systemAnalysis, goalProgress, agentEffectiveness);
      
      // Make autonomous decisions based on reflection
      const decisions = await this.makeAutonomousDecisions(reflection);
      
      // Log reflection and decisions
      await this.logReflection(reflection, decisions);

      return {
        success: true,
        message: `🧠 Reflection Complete: ${reflection.summary}`,
        data: { 
          reflection, 
          decisions,
          nextAgent: decisions.highPriorityAction ? decisions.nextAgent : null
        },
        timestamp: new Date().toISOString(),
        nextAgent: decisions.nextAgent
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ ReflectionAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async analyzeSystemPerformance() {
    // Get recent activity from supervisor queue
    const { data: recentActivity } = await supabase
      .from('supervisor_queue')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    // Get leads data
    const { data: leads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const successRate = recentActivity?.filter(a => a.status === 'completed').length / (recentActivity?.length || 1);
    const leadsGenerated = leads?.length || 0;
    const recentLeads = leads?.filter(l => 
      new Date(l.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length || 0;

    return {
      totalActivities: recentActivity?.length || 0,
      successRate,
      leadsGenerated,
      recentLeads,
      performance: successRate * 100
    };
  }

  private async evaluateGoalProgress() {
    // Check progress toward trillion-dollar goal
    const { data: leads } = await supabase
      .from('leads')
      .select('*');

    // Estimate revenue potential (rough calculation)
    const estimatedRevenue = (leads?.length || 0) * 2500; // $2.5K average per lead
    const trillionProgress = (estimatedRevenue / 1e12) * 100;

    return {
      currentLeads: leads?.length || 0,
      estimatedRevenue,
      trillionProgress,
      dailyGrowthRate: this.calculateGrowthRate(leads || [])
    };
  }

  private calculateGrowthRate(leads: any[]) {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const todayLeads = leads.filter(l => new Date(l.created_at) >= yesterday).length;
    const previousLeads = leads.length - todayLeads;
    
    return previousLeads > 0 ? ((todayLeads / previousLeads) - 1) * 100 : 0;
  }

  private async assessAgentEffectiveness() {
    const { data: agentActivity } = await supabase
      .from('supervisor_queue')
      .select('agent_name, status, timestamp')
      .order('timestamp', { ascending: false })
      .limit(100);

    const agentStats = {};
    agentActivity?.forEach(activity => {
      if (!agentStats[activity.agent_name]) {
        agentStats[activity.agent_name] = { total: 0, successful: 0 };
      }
      agentStats[activity.agent_name].total++;
      if (activity.status === 'completed') {
        agentStats[activity.agent_name].successful++;
      }
    });

    return Object.entries(agentStats).map(([name, stats]: [string, any]) => ({
      agentName: name,
      successRate: stats.successful / stats.total,
      totalActions: stats.total,
      effectiveness: (stats.successful / stats.total) * 100
    }));
  }

  private async generateReflection(systemAnalysis: any, goalProgress: any, agentEffectiveness: any[]) {
    const lowPerformingAgents = agentEffectiveness.filter(a => a.effectiveness < 60);
    const highPerformingAgents = agentEffectiveness.filter(a => a.effectiveness > 90);
    
    let summary = '';
    let insights = [];
    let recommendations = [];

    // Generate insights based on data
    if (goalProgress.trillionProgress < 0.0001) {
      insights.push('Revenue generation is below threshold - need aggressive lead generation');
      recommendations.push('Deploy more LeadGenerationMasterAgents');
    }

    if (systemAnalysis.successRate < 0.7) {
      insights.push('System success rate is suboptimal - error patterns detected');
      recommendations.push('Activate error analysis and system optimization');
    }

    if (lowPerformingAgents.length > 0) {
      insights.push(`${lowPerformingAgents.length} agents underperforming`);
      recommendations.push('Require agent retraining or replacement');
    }

    if (goalProgress.dailyGrowthRate < 10) {
      insights.push('Growth rate insufficient for trillion-dollar timeline');
      recommendations.push('Increase lead generation frequency and conversion optimization');
    }

    summary = insights.length > 0 
      ? `${insights.length} critical insights identified - autonomous optimization required`
      : 'System performing optimally - maintaining current trajectory';

    return {
      summary,
      insights,
      recommendations,
      systemHealth: systemAnalysis.successRate * 100,
      goalProgress: goalProgress.trillionProgress,
      urgencyLevel: insights.length > 2 ? 'HIGH' : insights.length > 0 ? 'MEDIUM' : 'LOW'
    };
  }

  private async makeAutonomousDecisions(reflection: any) {
    const decisions = {
      highPriorityAction: false,
      nextAgent: null,
      actions: [],
      reasoning: ''
    };

    // Autonomous decision logic
    if (reflection.urgencyLevel === 'HIGH') {
      decisions.highPriorityAction = true;
      decisions.nextAgent = 'MedicalTourismLeadFactory';
      decisions.actions.push('Deploy emergency lead generation squad');
      decisions.reasoning = 'Critical performance gap detected - immediate action required';
    } else if (reflection.goalProgress < 0.001 && reflection.systemHealth > 70) {
      decisions.highPriorityAction = true;
      decisions.nextAgent = 'ExecutionAgent';
      decisions.actions.push('Increase execution velocity');
      decisions.reasoning = 'System healthy but revenue generation insufficient';
    } else if (reflection.systemHealth < 60) {
      decisions.nextAgent = 'SelfImprovementAgent';
      decisions.actions.push('Optimize underperforming agents');
      decisions.reasoning = 'System optimization required';
    }

    return decisions;
  }

  private async logReflection(reflection: any, decisions: any) {
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: 'reflection_agent',
        agent_name: 'reflection_agent',
        action: 'system_reflection',
        input: JSON.stringify({ reflection }),
        status: 'completed',
        output: JSON.stringify({ decisions, summary: reflection.summary })
      });
  }
}

export async function ReflectionAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ReflectionAgent();
  return await agent.runner(context);
}
