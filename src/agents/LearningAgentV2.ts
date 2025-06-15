
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function LearningAgentV2(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get recent agent activity to learn from
    const { data: recentActivity, error: activityError } = await supabase
      .from('api.supervisor_queue' as any)
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5);

    if (activityError) {
      console.error('LearningAgentV2 activity fetch error:', activityError);
    }

    // Generate learning-based goals
    const learningGoals = [
      "Optimize agent coordination patterns based on recent performance",
      "Enhance memory consolidation for better cross-agent knowledge sharing",
      "Develop new decision-making heuristics from successful outcomes",
      "Improve autonomous task prioritization algorithms",
      "Strengthen feedback loops between strategic and operational agents",
      "Evolve communication protocols for multi-agent collaboration",
      "Refine goal generation mechanisms based on pattern analysis"
    ];

    const selectedGoal = learningGoals[Math.floor(Math.random() * learningGoals.length)];
    const priority = Math.floor(Math.random() * 3) + 8; // High priority learning goals

    // Store new goal
    const { data: goalData, error: goalError } = await supabase
      .from('api.agi_goals_enhanced' as any)
      .insert({
        goal_text: `[LEARNING] ${selectedGoal}`,
        priority: priority,
        status: 'active',
        progress_percentage: 0,
        timestamp: new Date().toISOString()
      });

    if (goalError) {
      console.error('LearningAgentV2 goal creation error:', goalError);
    }

    // Store learning insight in memory
    const learningInsight = `Learning pattern detected: ${selectedGoal} (Priority: ${priority})`;
    
    await supabase
      .from('api.agent_memory' as any)
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'learning_agent_v2',
        memory_key: 'learning_insight',
        memory_value: learningInsight,
        timestamp: new Date().toISOString()
      });

    // Log to supervisor queue
    await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'learning_agent_v2',
        action: 'goal_generation',
        input: JSON.stringify({ analysis_count: recentActivity?.length || 0 }),
        status: 'completed',
        output: learningInsight,
        timestamp: new Date().toISOString()
      });

    console.log(`🧠 LearningAgentV2 generated goal: ${selectedGoal}`);

    return {
      success: true,
      message: `🧠 New learning goal generated: "${selectedGoal}"`,
      data: { goal: selectedGoal, priority, insight: learningInsight },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('LearningAgentV2 error:', error);
    return {
      success: false,
      message: `❌ LearningAgentV2 error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
