import { supabase } from '@/integrations/supabase/client';

export class GoalEvaluator {
  async evaluate(goalMemory: any) {
    // Get data to simulate evaluation
    const { data: leads } = await supabase
      .from('api.leads' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: activityRaw } = await supabase
      .from('api.supervisor_queue' as any)
      .select('*')
      .eq('status', 'completed')
      .order('timestamp', { ascending: false })
      .limit(50);

    // Only keep rows with a status property (skip nulls/errors)
    const activity = Array.isArray(activityRaw)
      ? activityRaw.filter(a => !!a && typeof a === 'object' && 'status' in a)
      : [];

    const evaluation = {
      goalId: goalMemory.id,
      previousProgress: goalMemory.progress,
      newProgress: goalMemory.progress,
      updatedMetrics: {},
      needsAdaptation: false,
      adaptationReason: ''
    };

    // Simulate goal evaluation
    if (goalMemory.goal.includes('trillion') || goalMemory.goal.includes('revenue')) {
      const leadsCount = Array.isArray(leads)
        ? leads.filter(l => !!l).length
        : 0;
      const estimatedRevenue = leadsCount * 2500;
      evaluation.updatedMetrics = {
        leadsGenerated: leadsCount,
        revenue: estimatedRevenue,
        conversionRate: leadsCount > 0 ? 0.1 : 0
      };
      const trillionProgress = (estimatedRevenue / 1e12) * 100;
      evaluation.newProgress = Math.min(trillionProgress, 100);

      if (evaluation.newProgress < evaluation.previousProgress) {
        evaluation.needsAdaptation = true;
        evaluation.adaptationReason = 'Revenue generation declining - need strategy adjustment';
      }
    } else if (goalMemory.goal.includes('system')) {
      const totalActivities = Array.isArray(activity)
        ? activity.filter(a => !!a && typeof a === 'object' && 'status' in a).length
        : 0;
      const successfulActivities = Array.isArray(activity)
        ? activity.filter(a => !!a && typeof a === 'object' && 'status' in a && (a as any)?.status === 'completed').length
        : 0;
      const successRate = totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0;
      evaluation.updatedMetrics = {
        tasksCompleted: totalActivities,
        successRate,
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
}
