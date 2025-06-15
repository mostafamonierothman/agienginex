import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { PersistentMemory } from '@/core/PersistentMemory';
import { EnhancedGoalAgentRunner } from '@/agents/EnhancedGoalAgent';
import { StrategicAgent } from '@/agents/StrategicAgent';
import { ReflectionAgentRunner } from '@/agents/ReflectionAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';

export class AGOCoreLoopAgent {
  private memory = new PersistentMemory();

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🧠 [AGO] Starting Advanced AGI Core Loop...');

      // Load memory context and current goals
      const systemContext = await this.memory.get('system_context', {});
      const currentGoals = systemContext.goals || ["optimize system performance", "generate qualified leads"];
      const loopResults = [];

      await sendChatUpdate(`🎯 [AGO] Processing ${currentGoals.length} active goals`);

      for (let i = 0; i < currentGoals.length; i++) {
        const goal = currentGoals[i];
        await sendChatUpdate(`🔄 [AGO] Goal ${i + 1}/${currentGoals.length}: "${goal}"`);

        try {
          // Step 1: Enhanced goal planning
          const goalPlan = await EnhancedGoalAgentRunner({ 
            input: { goal, systemContext },
            user_id: context.user_id || 'ago_system'
          });

          // Step 2: Strategic agent selection
          const strategy = await StrategicAgent({ 
            input: { plan: goalPlan.data, memory: systemContext },
            user_id: context.user_id || 'ago_system'
          });

          // Step 3: Execute selected agent
          let executionResult;
          if (goal.includes('lead')) {
            // Use specialized lead generation
            const { LeadGenerationMasterAgentRunner } = await import('@/agents/LeadGenerationMasterAgent');
            executionResult = await LeadGenerationMasterAgentRunner({
              input: { keyword: 'medical tourism leads UK', agentId: 'ago_lead_gen' },
              user_id: context.user_id || 'ago_system'
            });
          } else {
            // Use general strategic execution
            executionResult = strategy;
          }

          // Step 4: Evaluate and score result
          const evaluation = await this.evaluateResult(executionResult, goal);
          
          // Step 5: Store insights and update memory
          await this.updateSystemMemory(goal, executionResult, evaluation);

          loopResults.push({
            goal,
            success: executionResult.success,
            score: evaluation.score,
            insights: evaluation.insights
          });

          await sendChatUpdate(`✅ [AGO] Goal "${goal}" completed with score: ${evaluation.score}/100`);

        } catch (error: any) {
          console.error(`AGO Loop error for goal "${goal}":`, error);
          await sendChatUpdate(`❌ [AGO] Error processing goal "${goal}": ${error.message}`);
          
          loopResults.push({
            goal,
            success: false,
            error: error.message,
            score: 0
          });
        }
      }

      // Step 6: System reflection and improvement
      await this.performSystemReflection(loopResults);

      const overallScore = loopResults.reduce((sum, r) => sum + (r.score || 0), 0) / (loopResults.length || 1);
      
      await sendChatUpdate(`🧠 [AGO] Core loop complete. Overall performance: ${overallScore.toFixed(1)}/100`);

      return {
        success: true,
        message: `AGO Core Loop executed ${loopResults.length} goals with ${overallScore.toFixed(1)}/100 performance`,
        data: {
          goals: currentGoals,
          results: loopResults,
          overallScore,
          nextOptimization: overallScore < 80 ? 'SelfImprovementAgent' : null
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('AGO Core Loop critical error:', error);
      return {
        success: false,
        message: `❌ AGO Core Loop failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async evaluateResult(result: any, goal: string): Promise<{ score: number; insights: string[] }> {
    const insights = [];
    let score = 50; // baseline

    if (result?.success) {
      score += 30;
      insights.push('Agent execution successful');
    }

    if (result?.data?.leadsGenerated > 0) {
      score += 20;
      insights.push(`Generated ${result.data.leadsGenerated} leads`);
    }

    if (result?.message?.includes('completed')) {
      score += 10;
      insights.push('Task completed successfully');
    }

    if (goal.includes('lead') && result?.data?.leads?.length > 0) {
      score += 15;
      insights.push('Real leads added to CRM');
    }

    return { score: Math.min(100, score), insights };
  }

  private async updateSystemMemory(goal: string, result: any, evaluation: any) {
    const timestamp = new Date().toISOString();
    
    const currentContext = await this.memory.get('system_context', {});
    currentContext.lastGoalExecution = {
      goal,
      timestamp,
      score: evaluation.score,
      success: result.success
    };
    
    await this.memory.set('system_context', currentContext);

    // Log to supervisor queue for tracking
    await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: 'ago_core_loop',
        agent_name: 'ago_core_loop_agent',
        action: 'goal_execution',
        input: JSON.stringify({ goal }),
        status: result.success ? 'completed' : 'failed',
        output: JSON.stringify({ evaluation, result: result.message })
      } as any);
  }

  private async performSystemReflection(results: any[]) {
    try {
      const successRate = results.length > 0 ? results.filter(r => r.success).length / results.length : 0;
      
      if (successRate < 0.7) {
        await sendChatUpdate('🔍 [AGO] Low success rate detected - initiating system reflection');
        
        await ReflectionAgentRunner({
          input: { 
            results, 
            successRate, 
            triggerReason: 'ago_performance_review' 
          },
          user_id: 'ago_system'
        });
      }

      // Store reflection data for future optimization
      await this.memory.set('last_reflection', {
        timestamp: new Date().toISOString(),
        successRate,
        totalGoals: results.length,
        recommendations: successRate < 0.7 ? ['Improve agent selection', 'Add error recovery'] : ['Maintain current performance']
      });

    } catch (error) {
      console.error('System reflection error:', error);
    }
  }
}

export async function AGOCoreLoopAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new AGOCoreLoopAgent();
  return await agent.runner(context);
}
