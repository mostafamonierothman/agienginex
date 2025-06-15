import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

interface GoalMemory {
  id: string;
  goal: string;
  subGoals: string[];
  priority: number;
  status: 'active' | 'completed' | 'paused' | 'failed';
  progress: number;
  lastEvaluated: string;
  successMetrics: any;
  adaptations: string[];
}

import { GoalEvaluator } from './GoalEvaluator';
import { GoalAdaptationEngine } from './GoalAdaptationEngine';

const VALID_GOAL_STATUSES = ['active', 'completed'] as const;
type ValidGoalStatus = typeof VALID_GOAL_STATUSES[number];

export class GoalMemoryAgent {
  private goalMemories: Map<string, any> = new Map();

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🧠 GoalMemoryAgent: Re-evaluating goal progress and adaptation...');
      await this.loadGoalMemories();
      const goalEvaluator = new GoalEvaluator();
      const evaluationResults = await this.evaluateGoalProgress(goalEvaluator);
      const adaptationEngine = new GoalAdaptationEngine();
      const adaptations = await this.adaptGoalsBasedOnPerformance(adaptationEngine);
      const newSubGoals = await this.generateNewSubGoals();
      await this.saveGoalMemories();
      return {
        success: true,
        message: `🧠 Goal memory updated: ${evaluationResults.goalsEvaluated} goals processed, ${adaptations.length} adaptations made`,
        data: { 
          evaluationResults,
          adaptations,
          newSubGoals,
          nextAgent: adaptations.some(a => a.urgent) ? 'ExecutionAgent' : null
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ GoalMemoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async loadGoalMemories() {
    // Load goal memories from database
    const { data: goalDataRaw } = await supabase
      .from('api.agi_goals_enhanced' as any)
      .select('*');

    // Only keep properly shaped goal rows
    const goalData = Array.isArray(goalDataRaw)
      ? goalDataRaw.filter(
          (g): g is any =>
            !!g &&
            typeof g === 'object' &&
            'status' in g &&
            'goal_id' in g &&
            'goal_text' in g &&
            'priority' in g &&
            'progress_percentage' in g &&
            (g as any).status &&
            ((g as any).status === 'active' || (g as any).status === 'completed')
        )
      : [];

    // Load agent memory for detailed goal tracking
    const { data: memoryDataRaw } = await supabase
      .from('api.agent_memory' as any)
      .select('*')
      .eq('agent_name', 'goal_memory_agent');
    const memoryData = Array.isArray(memoryDataRaw)
      ? memoryDataRaw.filter(
          (m): m is any =>
            !!m && typeof m === 'object' && 'memory_key' in m && 'memory_value' in m
        )
      : [];

    // Combine and structure goal memories
    goalData?.forEach(g => {
      if (!g || typeof g !== 'object') return;
      const status: any = (g as any)?.status;
      if (!status || (status !== 'active' && status !== 'completed')) return;
      const memoryEntry = memoryData?.find(
        m => !!m && typeof m === 'object' && (m as any)?.memory_key === `goal_${(g as any)?.goal_id}`
      );
      let goalMemory: GoalMemory;
      if (
        memoryEntry &&
        typeof (memoryEntry as any)?.memory_value === "string"
      ) {
        goalMemory = JSON.parse((memoryEntry as any)?.memory_value);
      } else {
        // Ensure all properties accessed on g are guarded
        goalMemory = {
          id: String((g as any)?.goal_id ?? ''),
          goal: (g as any)?.goal_text ?? '',
          subGoals: this.generateInitialSubGoals((g as any)?.goal_text ?? ''),
          priority: (g as any)?.priority ?? 0,
          status: (g as any)?.status as 'active' | 'completed' ?? 'active',
          progress: (g as any)?.progress_percentage ?? 0,
          lastEvaluated: new Date().toISOString(),
          successMetrics: this.defineSuccessMetrics((g as any)?.goal_text ?? ''),
          adaptations: []
        };
      }
      this.goalMemories.set(goalMemory.id, goalMemory);
    });
  }

  private generateInitialSubGoals(mainGoal: string): string[] {
    const subGoals = [];
    
    if (mainGoal.includes('trillion') || mainGoal.includes('revenue')) {
      subGoals.push('Generate 1000+ qualified leads');
      subGoals.push('Achieve 10% conversion rate');
      subGoals.push('Establish automated sales funnel');
      subGoals.push('Scale to $100K monthly recurring revenue');
    } else if (mainGoal.includes('system') || mainGoal.includes('optimization')) {
      subGoals.push('Achieve 95% system uptime');
      subGoals.push('Reduce average response time to <500ms');
      subGoals.push('Implement automated error recovery');
      subGoals.push('Optimize resource utilization by 30%');
    } else {
      subGoals.push(`Research and analyze: ${mainGoal}`);
      subGoals.push(`Develop strategy for: ${mainGoal}`);
      subGoals.push(`Execute initial phase: ${mainGoal}`);
      subGoals.push(`Monitor and optimize: ${mainGoal}`);
    }

    return subGoals;
  }

  private defineSuccessMetrics(goal: string) {
    if (goal.includes('trillion') || goal.includes('revenue')) {
      return {
        leadsGenerated: 0,
        conversionRate: 0,
        revenue: 0,
        timeToGoal: '365 days'
      };
    } else if (goal.includes('system')) {
      return {
        uptime: 0,
        responseTime: 0,
        errorRate: 0,
        efficiency: 0
      };
    } else {
      return {
        tasksCompleted: 0,
        successRate: 0,
        timeToCompletion: null
      };
    }
  }

  private async evaluateGoalProgress(goalEvaluator: GoalEvaluator) {
    const evaluations = [];
    let goalsEvaluated = 0;
    for (const [goalId, goalMemory] of this.goalMemories) {
      if (goalMemory.status !== 'active') continue;
      const evaluation = await goalEvaluator.evaluate(goalMemory);
      evaluations.push(evaluation);
      goalsEvaluated++;
      goalMemory.progress = evaluation.newProgress;
      goalMemory.lastEvaluated = new Date().toISOString();
      goalMemory.successMetrics = { ...goalMemory.successMetrics, ...evaluation.updatedMetrics };
    }
    return { goalsEvaluated, evaluations };
  }

  private async adaptGoalsBasedOnPerformance(adaptationEngine: GoalAdaptationEngine) {
    const adaptations = [];
    for (const [goalId, goalMemory] of this.goalMemories) {
      const timeSinceLastEvaluation = Date.now() - new Date(goalMemory.lastEvaluated).getTime();
      const hoursSinceEvaluation = timeSinceLastEvaluation / (1000 * 60 * 60);
      const these = await adaptationEngine.adapt(goalMemory, hoursSinceEvaluation);
      for (const adaptation of these) {
        adaptations.push(adaptation);
        goalMemory.adaptations.push(adaptation.description);
      }
    }
    return adaptations;
  }

  private async generateNewSubGoals() {
    const newSubGoals = [];

    for (const [goalId, goalMemory] of this.goalMemories) {
      // If we've completed most sub-goals, generate new ones
      const completedSubGoals = goalMemory.subGoals.filter(sg => sg.includes('✓')).length;
      const remainingSubGoals = goalMemory.subGoals.length - completedSubGoals;

      if (remainingSubGoals < 2 && goalMemory.progress < 90) {
        const newSubs = this.generateAdditionalSubGoals(goalMemory);
        goalMemory.subGoals.push(...newSubs);
        newSubGoals.push({ goalId, newSubGoals: newSubs });
      }
    }

    return newSubGoals;
  }

  private generateAdditionalSubGoals(goalMemory: GoalMemory): string[] {
    const baseGoal = goalMemory.goal;
    const currentProgress = goalMemory.progress;

    if (currentProgress < 25) {
      return [
        `Accelerate initial execution for: ${baseGoal}`,
        `Remove blockers preventing progress on: ${baseGoal}`
      ];
    } else if (currentProgress < 50) {
      return [
        `Optimize mid-stage execution for: ${baseGoal}`,
        `Scale successful strategies for: ${baseGoal}`
      ];
    } else if (currentProgress < 75) {
      return [
        `Prepare final optimization phase for: ${baseGoal}`,
        `Ensure sustainability of progress on: ${baseGoal}`
      ];
    } else {
      return [
        `Complete final phase of: ${baseGoal}`,
        `Document lessons learned from: ${baseGoal}`
      ];
    }
  }

  private async saveGoalMemories() {
    for (const [goalId, goalMemory] of this.goalMemories) {
      // Update the main goals table
      await supabase
        .from('api.agi_goals_enhanced' as any)
        .update({
          progress_percentage: Math.round(goalMemory.progress),
          status: goalMemory.status
        })
        .eq('goal_id', parseInt(goalId));

      // Save detailed goal memory
      await supabase
        .from('api.agent_memory' as any)
        .upsert({
          user_id: 'goal_memory_agent',
          agent_name: 'goal_memory_agent',
          memory_key: `goal_${goalId}`,
          memory_value: JSON.stringify(goalMemory)
        });
    }
  }
}
  
export async function GoalMemoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new GoalMemoryAgent();
  return await agent.runner(context);
}
