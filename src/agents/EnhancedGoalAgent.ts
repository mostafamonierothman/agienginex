
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedGoalAgent {
    private goals: Array<{
        id: string;
        goal: string;
        subgoals: string[];
        priority: number;
        status: 'active' | 'completed' | 'paused';
        created: string;
    }> = [];

    async setLongTermGoal(goal: string, priority: number = 5): Promise<void> {
        const goalId = `goal_${Date.now()}`;
        const subgoals = [
            `Research and analyze ${goal}`,
            `Develop strategy for ${goal}`,
            `Execute initial phase of ${goal}`,
            `Monitor progress on ${goal}`,
            `Optimize and refine ${goal}`
        ];

        const newGoal = {
            id: goalId,
            goal,
            subgoals: [...subgoals],
            priority,
            status: 'active' as const,
            created: new Date().toISOString()
        };

        this.goals.push(newGoal);
        
        // Store in Supabase
        try {
            await supabase
                .from('agent_memory')
                .insert({
                    user_id: 'enhanced_goal_agent',
                    agent_name: 'enhanced_goal_agent',
                    memory_key: `goal_${goalId}`,
                    memory_value: JSON.stringify(newGoal),
                    timestamp: new Date().toISOString()
                });
        } catch (error) {
            console.error('[EnhancedGoalAgent] Failed to store goal:', error);
        }

        console.log(`[EnhancedGoalAgent] Set long-term goal: ${goal} with ${subgoals.length} subgoals`);
    }

    getNextSubgoal(): { goal: string; subgoal: string; priority: number } | null {
        // Sort goals by priority (higher number = higher priority)
        const activeGoals = this.goals
            .filter(g => g.status === 'active' && g.subgoals.length > 0)
            .sort((a, b) => b.priority - a.priority);

        if (activeGoals.length === 0) {
            return null;
        }

        const selectedGoal = activeGoals[0];
        const subgoal = selectedGoal.subgoals.shift();
        
        if (selectedGoal.subgoals.length === 0) {
            selectedGoal.status = 'completed';
        }

        return subgoal ? {
            goal: selectedGoal.goal,
            subgoal,
            priority: selectedGoal.priority
        } : null;
    }

    getGoalStatus(): { 
        totalGoals: number; 
        activeGoals: number; 
        completedGoals: number; 
        totalSubgoals: number;
    } {
        const totalGoals = this.goals.length;
        const activeGoals = this.goals.filter(g => g.status === 'active').length;
        const completedGoals = this.goals.filter(g => g.status === 'completed').length;
        const totalSubgoals = this.goals.reduce((sum, g) => sum + g.subgoals.length, 0);

        return { totalGoals, activeGoals, completedGoals, totalSubgoals };
    }

    async runner(context: AgentContext): Promise<AgentResponse> {
        try {
            const nextTask = this.getNextSubgoal();
            
            if (!nextTask) {
                // Generate new goals autonomously
                const newGoals = [
                    'Optimize system performance and efficiency',
                    'Enhance inter-agent collaboration protocols',
                    'Develop advanced learning capabilities',
                    'Improve error detection and recovery',
                    'Expand knowledge base and expertise'
                ];
                
                const randomGoal = newGoals[Math.floor(Math.random() * newGoals.length)];
                await this.setLongTermGoal(randomGoal, Math.floor(Math.random() * 5) + 1);
                
                return {
                    success: true,
                    message: `🎯 Enhanced GoalAgent: Generated new goal "${randomGoal}" and planning execution strategy`,
                    data: { newGoal: randomGoal, action: 'goal_generation' },
                    timestamp: new Date().toISOString(),
                    nextAgent: 'EnhancedCollaborationAgent'
                };
            }

            const status = this.getGoalStatus();
            
            // Log to supervisor queue
            await supabase
                .from('supervisor_queue')
                .insert({
                    user_id: context.user_id || 'enhanced_goal_agent',
                    agent_name: 'enhanced_goal_agent',
                    action: 'execute_subgoal',
                    input: JSON.stringify({ goal: nextTask.goal, subgoal: nextTask.subgoal }),
                    status: 'completed',
                    output: `Executing: ${nextTask.subgoal} (Priority: ${nextTask.priority})`
                });

            return {
                success: true,
                message: `🎯 Enhanced GoalAgent: Executing "${nextTask.subgoal}" for goal "${nextTask.goal}" (${status.activeGoals} active goals)`,
                data: { 
                    currentTask: nextTask, 
                    goalStatus: status,
                    action: 'subgoal_execution'
                },
                timestamp: new Date().toISOString(),
                nextAgent: 'StrategicAgent'
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Enhanced GoalAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}

export async function EnhancedGoalAgentRunner(context: AgentContext): Promise<AgentResponse> {
    const agent = new EnhancedGoalAgent();
    return await agent.runner(context);
}
