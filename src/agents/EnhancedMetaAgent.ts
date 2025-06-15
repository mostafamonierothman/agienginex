
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedMetaAgent {
    private systemOptimizations: Array<{
        optimization: string;
        impact: number;
        timestamp: string;
    }> = [];

    async analyzeSystemPerformance(): Promise<{
        metrics: any;
        optimizations: any[];
        recommendations: string[];
        nextAgent: string | null;
    }> {
        try {
            // Get recent system activity
            const { data: recentActivity } = await supabase
                .from('api.supervisor_queue' as any)
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
                metrics: { health: 'unknown', avgSuccessRate: 0, totalActions: 0, errorRate: 0 },
                optimizations: [],
                recommendations: [],
                nextAgent: null
            };
        }
    }

    private calculateSystemMetrics(recentActivity: any[]): any {
        const totalActions = recentActivity.length;
        const completedActions = recentActivity.filter(a => a.status === 'completed').length;
        const errors = recentActivity.filter(a => a.status === 'error').length;
        const avgSuccessRate = totalActions > 0 ? (completedActions / totalActions) * 100 : 0;
        
        return {
            totalActions,
            completedActions,
            errorRate: totalActions > 0 ? (errors / totalActions) * 100 : 0,
            avgSuccessRate
        };
    }

    private generateOptimizations(metrics: any): any[] {
        const optimizations = [];

        if (metrics.errorRate > 10) {
            optimizations.push({
                optimization: 'Reduce agent concurrency to improve stability',
                impact: 5,
                timestamp: new Date().toISOString()
            });
        } else if (metrics.avgSuccessRate > 85) {
            optimizations.push({
                optimization: 'Increase loop speed for better efficiency',
                impact: 3,
                timestamp: new Date().toISOString()
            });
        } else {
            optimizations.push({
                optimization: 'Maintain current configuration',
                impact: 1,
                timestamp: new Date().toISOString()
            });
        }

        return optimizations;
    }

    private async storeOptimizations(optimizations: any[]) {
        for (const opt of optimizations) {
            this.systemOptimizations.push(opt);
        }
    }

    private generateRecommendations(metrics: any): string[] {
        const recs = [];
        if (metrics.errorRate > 10) {
            recs.push('Investigate high error rate and reduce concurrency');
        } else if (metrics.avgSuccessRate > 90) {
            recs.push('System performing excellently - consider increasing workload');
        } else {
            recs.push('System healthy - continue current operations');
        }
        return recs;
    }

    private selectOptimalNextAgent(metrics: any): string {
        if (metrics.errorRate > 10) {
            return 'SupervisorAgent';
        } else if (metrics.avgSuccessRate < 50) {
            return 'CriticAgent';
        }
        return 'GoalAgent';
    }

    async runner(context: AgentContext): Promise<AgentResponse> {
        try {
            const analysis = await this.analyzeSystemPerformance();
            
            await supabase
                .from('api.supervisor_queue' as any)
                .insert({
                    user_id: context.user_id || 'enhanced_meta_agent',
                    agent_name: 'enhanced_meta_agent',
                    action: 'system_analysis',
                    input: JSON.stringify({ cycle: context.input?.cycle || 0 }),
                    status: 'completed',
                    output: `System analysis complete. Success rate: ${analysis.metrics.avgSuccessRate?.toFixed(1)}%`
                });

            return {
                success: true,
                message: `🧠 Enhanced MetaAgent: System analysis complete - ${analysis.metrics.avgSuccessRate?.toFixed(1)}% success rate, ${analysis.optimizations.length} optimizations identified`,
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
}

export async function EnhancedMetaAgentRunner(context: AgentContext): Promise<AgentResponse> {
    const agent = new EnhancedMetaAgent();
    return await agent.runner(context);
}
