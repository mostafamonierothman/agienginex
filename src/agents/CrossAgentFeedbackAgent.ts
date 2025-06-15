
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

interface AgentFeedback {
  sourceAgent: string;
  targetAgent: string;
  feedback: string;
  recommendation: string;
  performanceScore: number;
  actionRequired: boolean;
}

export class CrossAgentFeedbackAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🔄 CrossAgentFeedbackAgent: Analyzing inter-agent performance...');

      // Get recent agent interactions
      const agentInteractions = await this.getAgentInteractions();
      
      // Generate feedback between agents
      const feedbackResults = await this.generateCrossAgentFeedback(agentInteractions);
      
      // Apply feedback and optimize
      const optimizations = await this.applyFeedbackOptimizations(feedbackResults);
      
      // Log feedback for future reference
      await this.logCrossAgentFeedback(feedbackResults, optimizations);

      return {
        success: true,
        message: `🔄 Cross-agent feedback complete: ${feedbackResults.length} agent pairs analyzed`,
        data: { 
          feedbackResults,
          optimizations,
          nextAgent: optimizations.some(o => o.urgent) ? 'SelfImprovementAgent' : null
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ CrossAgentFeedbackAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getAgentInteractions() {
    // Get recent agent activity from supervisor queue
    const { data: recentActivityRaw } = await supabase
      .from('api.supervisor_queue' as any)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    const recentActivity = recentActivityRaw as any[] | null;

    // Group by agent and analyze patterns
    const agentPerformance = {} as Record<string, any>;
    const agentSequences = [];

    (recentActivity || []).forEach((activity, index) => {
      if (!activity || typeof activity !== 'object' || !('agent_name' in activity)) return;

      const agentName = activity.agent_name;
      if (!agentPerformance[agentName]) {
        agentPerformance[agentName] = {
          total: 0,
          successful: 0,
          failed: 0,
          averageExecutionTime: 0,
          recentActions: []
        };
      }

      agentPerformance[agentName].total++;
      agentPerformance[agentName].recentActions.push(activity);

      if ('status' in activity && activity.status === 'completed') {
        agentPerformance[agentName].successful++;
      } else if ('status' in activity && activity.status === 'failed') {
        agentPerformance[agentName].failed++;
      }

      // Track agent sequences (handoffs)
      if (index > 0) {
        const previousActivity = (recentActivity && recentActivity[index - 1]) ? recentActivity[index - 1] : null;
        if (
          previousActivity &&
          typeof previousActivity === 'object' &&
          'agent_name' in previousActivity &&
          previousActivity.agent_name !== agentName
        ) {
          agentSequences.push({
            from: previousActivity.agent_name,
            to: agentName,
            context:
              activity &&
              typeof activity === 'object' &&
              'action' in activity
                ? activity.action
                : "",
            success:
              activity &&
              typeof activity === 'object' &&
              'status' in activity &&
              activity.status === 'completed'
          });
        }
      }
    });

    return { agentPerformance, agentSequences };
  }

  private async generateCrossAgentFeedback(interactions: any): Promise<AgentFeedback[]> {
    const { agentPerformance, agentSequences } = interactions;
    const feedbackResults: AgentFeedback[] = [];

    // Analyze each agent's performance
    const agentNames = Object.keys(agentPerformance);
    
    for (let i = 0; i < agentNames.length; i++) {
      for (let j = i + 1; j < agentNames.length; j++) {
        const sourceAgent = agentNames[i];
        const targetAgent = agentNames[j];
        
        const feedback = await this.analyzePairPerformance(
          sourceAgent, 
          targetAgent, 
          agentPerformance, 
          agentSequences
        );
        
        if (feedback) {
          feedbackResults.push(feedback);
        }
      }
    }

    return feedbackResults;
  }

  private async analyzePairPerformance(
    sourceAgent: string, 
    targetAgent: string, 
    performance: any, 
    sequences: any[]
  ): Promise<AgentFeedback | null> {
    const sourcePerf = performance[sourceAgent];
    const targetPerf = performance[targetAgent];
    
    if (!sourcePerf || !targetPerf) return null;

    // Find handoffs between these agents
    const handoffs = sequences.filter(s => 
      (s.from === sourceAgent && s.to === targetAgent) ||
      (s.from === targetAgent && s.to === sourceAgent)
    );

    if (handoffs.length === 0) return null;

    const handoffSuccessRate = handoffs.filter(h => h.success).length / handoffs.length;
    const sourceSuccessRate = sourcePerf.successful / sourcePerf.total;
    const targetSuccessRate = targetPerf.successful / targetPerf.total;

    let feedback = '';
    let recommendation = '';
    let performanceScore = 0;
    let actionRequired = false;

    // Generate specific feedback based on performance patterns
    if (handoffSuccessRate < 0.7) {
      feedback = `Poor handoff success rate (${(handoffSuccessRate * 100).toFixed(1)}%) between ${sourceAgent} and ${targetAgent}`;
      recommendation = 'Improve inter-agent communication protocol and error handling';
      actionRequired = true;
      performanceScore = handoffSuccessRate * 100;
    } else if (sourceSuccessRate > 0.9 && targetSuccessRate < 0.6) {
      feedback = `${sourceAgent} (${(sourceSuccessRate * 100).toFixed(1)}%) outperforming ${targetAgent} (${(targetSuccessRate * 100).toFixed(1)}%)`;
      recommendation = `${targetAgent} should adopt optimization strategies from ${sourceAgent}`;
      actionRequired = true;
      performanceScore = (sourceSuccessRate + targetSuccessRate) / 2 * 100;
    } else if (handoffSuccessRate > 0.9) {
      feedback = `Excellent collaboration between ${sourceAgent} and ${targetAgent}`;
      recommendation = 'Maintain current collaboration patterns';
      actionRequired = false;
      performanceScore = handoffSuccessRate * 100;
    } else {
      feedback = `Standard collaboration between ${sourceAgent} and ${targetAgent}`;
      recommendation = 'Monitor for improvement opportunities';
      actionRequired = false;
      performanceScore = handoffSuccessRate * 100;
    }

    return {
      sourceAgent,
      targetAgent,
      feedback,
      recommendation,
      performanceScore,
      actionRequired
    };
  }

  private async applyFeedbackOptimizations(feedbackResults: AgentFeedback[]) {
    const optimizations = [];

    for (const feedback of feedbackResults) {
      if (feedback.actionRequired) {
        const optimization = await this.createOptimization(feedback);
        optimizations.push(optimization);
      }
    }

    return optimizations;
  }

  private async createOptimization(feedback: AgentFeedback) {
    const optimization = {
      targetAgent: feedback.targetAgent,
      sourceAgent: feedback.sourceAgent,
      issue: feedback.feedback,
      solution: feedback.recommendation,
      urgent: feedback.performanceScore < 50,
      implementationPlan: this.generateImplementationPlan(feedback)
    };

    // Store optimization in agent memory for future reference
    await supabase
      .from('api.agent_memory' as any)
      .insert({
        user_id: 'cross_agent_feedback',
        agent_name: feedback.targetAgent,
        memory_key: 'optimization_feedback',
        memory_value: JSON.stringify(optimization)
      });

    return optimization;
  }

  private generateImplementationPlan(feedback: AgentFeedback): string[] {
    const plans = [];

    if (feedback.performanceScore < 50) {
      plans.push('Immediate performance review required');
      plans.push('Implement error recovery mechanisms');
      plans.push('Add additional validation steps');
    }

    if (feedback.feedback.includes('handoff')) {
      plans.push('Improve inter-agent communication protocol');
      plans.push('Add handoff validation checks');
      plans.push('Implement retry mechanisms for failed handoffs');
    }

    if (feedback.feedback.includes('outperforming')) {
      plans.push('Analyze high-performing agent strategies');
      plans.push('Implement knowledge transfer mechanisms');
      plans.push('Apply successful patterns to underperforming agent');
    }

    return plans;
  }

  private async logCrossAgentFeedback(feedbackResults: AgentFeedback[], optimizations: any[]) {
    await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: 'cross_agent_feedback',
        agent_name: 'cross_agent_feedback_agent',
        action: 'inter_agent_analysis',
        input: JSON.stringify({ analyzedPairs: feedbackResults.length }),
        status: 'completed',
        output: JSON.stringify({ 
          feedbackSummary: feedbackResults.map(f => ({
            agents: `${f.sourceAgent} ↔ ${f.targetAgent}`,
            score: f.performanceScore,
            actionRequired: f.actionRequired
          })),
          optimizationsCreated: optimizations.length
        })
      });
  }
}

export async function CrossAgentFeedbackAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new CrossAgentFeedbackAgent();
  return await agent.runner(context);
}
