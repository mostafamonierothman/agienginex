
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedMetaAgent {
    private systemOptimizations: Array<{
        optimization: string;
        impact: number;
        timestamp: string;
    }> = [];

    async analyzeSystemPerformance(): Promise<any> {
        try {
            // Get recent system activity
            const { data: recentActivity } = await supabase
                .from('supervisor_queue')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(100);

            const systemMetrics = this.calculateSystemMetrics(recentActivity || []);
            const optimizations = this.generateOptimizations(systemMetrics);
            
            // Store optimization insights
            await this.storeOptimizations(optimizations);

            return {
                metrics: systemMetrics,
                optimizations,
                recommendations: this.generateRecommendations(systemMetrics),
                nextAgent: this.selectOptimalNextAgent(systemMetrics)
            };
        } catch (error) {
            console.error('[EnhancedMetaAgent] Analysis error:', error);
            return {
                metrics: { health: 'unknown' },
                optimizations: [],
                recommendations: ['System analysis failed - investigate'],
                nextAgent: 'SupervisorAgent'
            };
        }
    }

    private calculateSystemMetrics(activities: any[]): any {
        const agentStats = activities.reduce((acc, activity) => {
            const agent = activity.agent_name || 'unknown';
            if (!acc[agent]) acc[agent] = { total: 0, successful: 0, errors: 0 };
            
            acc[agent].total++;
            if (activity.status === 'completed') acc[agent].successful++;
            if (activity.status === 'error') acc[agent].errors++;
            
            return acc;
        }, {});

        const totalAgents = Object.keys(agentStats).length;
        const avgSuccessRate = totalAgents > 0 
            ? Object.values(agentStats).reduce((sum: number, stats: any) => 
                sum + (stats.successful / Math.max(stats.total, 1)), 0) / totalAgents
            : 0;

        return {
            totalAgents,
            avgSuccessRate: Math.round(avgSuccessRate * 100),
            agentStats,
            systemHealth: avgSuccessRate > 0.8 ? 'excellent' : avgSuccessRate > 0.6 ? 'good' : 'needs_attention',
            timestamp: new Date().toISOString()
        };
    }

    private generateOptimizations(metrics: any): string[] {
        const optimizations = [];

        if (metrics.avgSuccessRate < 70) {
            optimizations.push('Increase agent error handling and retry mechanisms');
        }

        if (metrics.totalAgents < 15) {
            optimizations.push('Consider expanding agent pool for better coverage');
        }

        const lowPerformers = Object.entries(metrics.agentStats)
            .filter(([_, stats]: [string, any]) => stats.successful / Math.max(stats.total, 1) < 0.5)
            .map(([agent, _]) => agent);

        if (lowPerformers.length > 0) {
            optimizations.push(`Optimize performance for: ${lowPerformers.join(', ')}`);
        }

        if (optimizations.length === 0) {
            optimizations.push('System performing optimally - maintain current operations');
        }

        return optimizations;
    }

    private generateRecommendations(metrics: any): string[] {
        const recommendations = [];

        if (metrics.systemHealth === 'needs_attention') {
            recommendations.push('Immediate system review required');
            recommendations.push('Increase monitoring frequency');
        } else if (metrics.systemHealth === 'good') {
            recommendations.push('Continue current optimization strategies');
            recommendations.push('Focus on preventive maintenance');
        } else {
            recommendations.push('Explore advanced capabilities expansion');
            recommendations.push('Consider autonomous goal generation');
        }

        return recommendations;
    }

    private selectOptimalNextAgent(metrics: any): string {
        if (metrics.systemHealth === 'needs_attention') {
            return 'SupervisorAgent';
        }
        
        if (metrics.avgSuccessRate > 85) {
            return 'GoalAgent'; // System is healthy, focus on goals
        }

        return 'CollaborationAgent'; // Medium health, improve collaboration
    }

    private async storeOptimizations(optimizations: string[]): Promise<void> {
        try {
            for (const optimization of optimizations) {
                this.systemOptimizations.push({
                    optimization,
                    impact: Math.random() * 0.3 + 0.7, // 0.7-1.0 impact score
                    timestamp: new Date().toISOString()
                });

                await supabase
                    .from('agent_memory')
                    .insert({
                        user_id: 'meta_agent_enhanced',
                        agent_name: 'enhanced_meta_agent',
                        memory_key: 'system_optimization',
                        memory_value: optimization,
                        timestamp: new Date().toISOString()
                    });
            }
        } catch (error) {
            console.error('[EnhancedMetaAgent] Storage error:', error);
        }
    }

    getOptimizationHistory(): typeof this.systemOptimizations {
        return this.systemOptimizations.slice(-20); // Last 20 optimizations
    }
}

export async function EnhancedMetaAgentRunner(context: AgentContext): Promise<AgentResponse> {
    try {
        const enhancedMeta = new EnhancedMetaAgent();
        const analysis = await enhancedMeta.analyzeSystemPerformance();

        // Log to supervisor queue
        await supabase
            .from('supervisor_queue')
            .insert({
                user_id: context.user_id || 'enhanced_meta_agent',
                agent_name: 'enhanced_meta_agent',
                action: 'deep_system_analysis',
                input: JSON.stringify({ action: 'analyze_and_optimize_system' }),
                status: 'completed',
                output: `System health: ${analysis.metrics.systemHealth}. Generated ${analysis.optimizations.length} optimizations.`
            });

        return {
            success: true,
            message: `🧠 Enhanced MetaAgent: System ${analysis.metrics.systemHealth} (${analysis.metrics.avgSuccessRate}% success rate). Generated ${analysis.optimizations.length} optimizations.`,
            data: analysis,
            timestamp: new Date().toISOString(),
            nextAgent: analysis.nextAgent
        };
    } catch (error) {
        return {
            success: false,
            message: `❌ Enhanced MetaAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}
