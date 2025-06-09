
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

export class GoalMemoryAgent {
  private goalMemories: Map<string, GoalMemory> = new Map();

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🧠 GoalMemoryAgent: Re-evaluating goal progress and adaptation...');

      // Load existing goal memories
      await this.loadGoalMemories();
      
      // Evaluate progress on active goals
      const evaluationResults = await this.evaluateGoalProgress();
      
      // Adapt goals based on performance
      const adaptations = await this.adaptGoalsBasedOnPerformance();
      
      // Generate new sub-goals if needed
      const newSubGoals = await this.generateNewSubGoals();
      
      // Save updated goal memories
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
    const { data: goalData } = await supabase
      .from('agi_goals_enhanced')
      .select('*')
      .eq('status', 'active');

    // Load agent memory for detailed goal tracking
    const { data: memoryData } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('agent_name', 'goal_memory_agent');

    // Combine and structure goal memories
    goalData?.forEach(goal => {
      const memoryEntry = memoryData?.find(m => m.memory_key === `goal_${goal.goal_id}`);
      let goalMemory: GoalMemory;

      if (memoryEntry) {
        goalMemory = JSON.parse(memoryEntry.memory_value);
      } else {
        goalMemory = {
          id: goal.goal_id.toString(),
          goal: goal.goal_text,
          subGoals: this.generateInitialSubGoals(goal.goal_text),
          priority: goal.priority,
          status: goal.status as any,
          progress: goal.progress_percentage,
          lastEvaluated: new Date().toISOString(),
          successMetrics: this.defineSuccessMetrics(goal.goal_text),
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

  private async evaluateGoalProgress() {
    const evaluations = [];
    let goalsEvaluated = 0;

    for (const [goalId, goalMemory] of this.goalMemories) {
      if (goalMemory.status !== 'active') continue;

      const evaluation = await this.evaluateSpecificGoal(goalMemory);
      evaluations.push(evaluation);
      goalsEvaluated++;

      // Update goal memory with new evaluation
      goalMemory.progress = evaluation.newProgress;
      goalMemory.lastEvaluated = new Date().toISOString();
      goalMemory.successMetrics = { ...goalMemory.successMetrics, ...evaluation.updatedMetrics };
    }

    return { goalsEvaluated, evaluations };
  }

  private async evaluateSpecificGoal(goalMemory: GoalMemory) {
    const evaluation = {
      goalId: goalMemory.id,
      previousProgress: goalMemory.progress,
      newProgress: goalMemory.progress,
      updatedMetrics: {},
      needsAdaptation: false,
      adaptationReason: ''
    };

    // Get recent system data for evaluation
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: recentActivity } = await supabase
      .from('supervisor_queue')
      .select('*')
      .eq('status', 'completed')
      .order('timestamp', { ascending: false })
      .limit(50);

    // Evaluate based on goal type
    if (goalMemory.goal.includes('trillion') || goalMemory.goal.includes('revenue')) {
      const leadsCount = recentLeads?.length || 0;
      const estimatedRevenue = leadsCount * 2500; // $2.5K per lead estimate
      
      evaluation.updatedMetrics = {
        leadsGenerated: leadsCount,
        revenue: estimatedRevenue,
        conversionRate: leadsCount > 0 ? 0.1 : 0 // Estimated 10% conversion
      };

      // Calculate progress toward trillion (very rough estimate)
      const trillionProgress = (estimatedRevenue / 1e12) * 100;
      evaluation.newProgress = Math.min(trillionProgress, 100);

      if (evaluation.newProgress < evaluation.previousProgress) {
        evaluation.needsAdaptation = true;
        evaluation.adaptationReason = 'Revenue generation declining - need strategy adjustment';
      }
    } else if (goalMemory.goal.includes('system')) {
      const totalActivities = recentActivity?.length || 0;
      const successfulActivities = recentActivity?.filter(a => a.status === 'completed').length || 0;
      const successRate = totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0;

      evaluation.updatedMetrics = {
        tasksCompleted: totalActivities,
        successRate: successRate,
        efficiency: successRate
      };

      evaluation.newProgress = successRate;

      if (successRate < 80) {
        evaluation.needsAdaptation = true;
        evaluation.adaptationReason = 'System performance below target - optimization needed';
      }
    }

    return evaluation;
  }

  private async adaptGoalsBasedOnPerformance() {
    const adaptations = [];

    for (const [goalId, goalMemory] of this.goalMemories) {
      const timeSinceLastEvaluation = Date.now() - new Date(goalMemory.lastEvaluated).getTime();
      const hoursSinceEvaluation = timeSinceLastEvaluation / (1000 * 60 * 60);

      // Adapt if progress is slow or declining
      if (goalMemory.progress < 50 && hoursSinceEvaluation > 4) {
        const adaptation = await this.createGoalAdaptation(goalMemory, 'slow_progress');
        adaptations.push(adaptation);
        goalMemory.adaptations.push(adaptation.description);
      }

      // Adapt if goal seems impossible with current approach
      if (goalMemory.progress < 10 && hoursSinceEvaluation > 24) {
        const adaptation = await this.createGoalAdaptation(goalMemory, 'strategy_change');
        adaptations.push(adaptation);
        goalMemory.adaptations.push(adaptation.description);
      }
    }

    return adaptations;
  }

  private async createGoalAdaptation(goalMemory: GoalMemory, adaptationType: string) {
    let adaptation = {
      goalId: goalMemory.id,
      type: adaptationType,
      description: '',
      actions: [],
      urgent: false
    };

    switch (adaptationType) {
      case 'slow_progress':
        adaptation.description = `Slow progress on "${goalMemory.goal}" - increasing execution frequency`;
        adaptation.actions = [
          'Increase agent execution frequency',
          'Deploy additional execution agents',
          'Optimize current strategies'
        ];
        adaptation.urgent = goalMemory.priority > 7;
        break;

      case 'strategy_change':
        adaptation.description = `Major strategy change needed for "${goalMemory.goal}"`;
        adaptation.actions = [
          'Completely revise approach',
          'Deploy different agent types',
          'Research alternative strategies'
        ];
        adaptation.urgent = true;
        break;
    }

    return adaptation;
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
        .from('agi_goals_enhanced')
        .update({
          progress_percentage: Math.round(goalMemory.progress),
          status: goalMemory.status
        })
        .eq('goal_id', parseInt(goalId));

      // Save detailed goal memory
      await supabase
        .from('agent_memory')
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
