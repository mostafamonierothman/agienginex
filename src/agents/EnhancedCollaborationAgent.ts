
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedCollaborationAgent {
    private collaborationNetwork: Map<string, Set<string>> = new Map();
    private collaborationHistory: Array<{
        from: string;
        to: string;
        task: string;
        success: boolean;
        timestamp: string;
    }> = [];

    async analyzeCollaborationPatterns(): Promise<any> {
        try {
            // Get recent collaboration data
            const { data: recentActivity } = await supabase
                .from('supervisor_queue')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(200);

            const patterns = this.buildCollaborationNetwork(recentActivity || []);
            const recommendations = this.generateCollaborationRecommendations(patterns);
            const nextCollaboration = this.selectOptimalCollaboration(patterns);

            return {
                patterns,
                recommendations,
                nextCollaboration,
                networkHealth: this.calculateNetworkHealth(patterns)
            };
        } catch (error) {
            console.error('[EnhancedCollaborationAgent] Analysis error:', error);
            return {
                patterns: { agents: 0, connections: 0 },
                recommendations: ['Collaboration analysis failed'],
                nextCollaboration: null,
                networkHealth: 'unknown'
            };
        }
    }

    private buildCollaborationNetwork(activities: any[]): any {
        const agentInteractions = new Map<string, Map<string, number>>();
        const agentActivity = new Map<string, number>();

        activities.forEach(activity => {
            const agent = activity.agent_name || 'unknown';
            
            // Track individual agent activity
            agentActivity.set(agent, (agentActivity.get(agent) || 0) + 1);

            // Look for handoff patterns in output
            const output = activity.output || '';
            if (output.includes('Handoff') || output.includes('→')) {
                // Extract potential agent names from handoff messages
                const agentNames = this.extractAgentNames(output);
                agentNames.forEach(targetAgent => {
                    if (targetAgent !== agent) {
                        if (!agentInteractions.has(agent)) {
                            agentInteractions.set(agent, new Map());
                        }
                        const agentMap = agentInteractions.get(agent)!;
                        agentMap.set(targetAgent, (agentMap.get(targetAgent) || 0) + 1);
                    }
                });
            }
        });

        return {
            agents: agentActivity.size,
            connections: Array.from(agentInteractions.values()).reduce(
                (sum, map) => sum + map.size, 0
            ),
            mostActiveAgents: Array.from(agentActivity.entries())
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([agent, activity]) => ({ agent, activity })),
            collaborationPairs: Array.from(agentInteractions.entries())
                .flatMap(([from, targets]) => 
                    Array.from(targets.entries()).map(([to, count]) => ({ from, to, count }))
                )
                .sort((a, b) => b.count - a.count)
                .slice(0, 10),
            networkDensity: this.calculateNetworkDensity(agentInteractions, agentActivity.size)
        };
    }

    private extractAgentNames(text: string): string[] {
        const agentKeywords = [
            'ResearchAgent', 'StrategicAgent', 'SupervisorAgent', 'MemoryAgent',
            'LearningAgent', 'CollaborationAgent', 'GoalAgent', 'MetaAgent',
            'OpportunityAgent', 'CoordinationAgent', 'FactoryAgent', 'CriticAgent'
        ];
        
        return agentKeywords.filter(agent => text.includes(agent));
    }

    private calculateNetworkDensity(interactions: Map<string, Map<string, number>>, totalAgents: number): number {
        const totalPossibleConnections = totalAgents * (totalAgents - 1);
        const actualConnections = Array.from(interactions.values())
            .reduce((sum, map) => sum + map.size, 0);
        
        return totalPossibleConnections > 0 ? actualConnections / totalPossibleConnections : 0;
    }

    private generateCollaborationRecommendations(patterns: any): string[] {
        const recommendations = [];

        if (patterns.networkDensity < 0.3) {
            recommendations.push('Increase inter-agent collaboration frequency');
            recommendations.push('Implement more agent handoff mechanisms');
        }

        if (patterns.mostActiveAgents.length > 0) {
            const topAgent = patterns.mostActiveAgents[0];
            recommendations.push(`Leverage ${topAgent.agent} as collaboration hub`);
        }

        if (patterns.connections < patterns.agents) {
            recommendations.push('Establish collaboration protocols for isolated agents');
        }

        if (patterns.collaborationPairs.length > 0) {
            const topPair = patterns.collaborationPairs[0];
            recommendations.push(`Optimize ${topPair.from} → ${topPair.to} collaboration pipeline`);
        } else {
            recommendations.push('Initiate cross-agent collaboration protocols');
        }

        return recommendations;
    }

    private selectOptimalCollaboration(patterns: any): { initiator: string; target: string; task: string } | null {
        if (patterns.mostActiveAgents.length < 2) {
            return {
                initiator: 'SupervisorAgent',
                target: 'ResearchAgent',
                task: 'Establish baseline collaboration protocol'
            };
        }

        const agents = patterns.mostActiveAgents.slice(0, 3);
        const initiator = agents[Math.floor(Math.random() * agents.length)].agent;
        const target = agents.find(a => a.agent !== initiator)?.agent || 'ResearchAgent';

        const collaborationTasks = [
            'Knowledge sharing and integration',
            'Task coordination and handoff optimization',
            'Cross-domain problem solving',
            'Collaborative learning and adaptation',
            'Resource sharing and optimization'
        ];

        return {
            initiator,
            target,
            task: collaborationTasks[Math.floor(Math.random() * collaborationTasks.length)]
        };
    }

    private calculateNetworkHealth(patterns: any): string {
        const healthScore = (patterns.networkDensity * 0.4) + 
                          (Math.min(patterns.connections / patterns.agents, 1) * 0.3) +
                          (Math.min(patterns.collaborationPairs.length / 10, 1) * 0.3);

        if (healthScore > 0.8) return 'excellent';
        if (healthScore > 0.6) return 'good';
        if (healthScore > 0.4) return 'fair';
        return 'needs_improvement';
    }

    async executeCollaboration(collaboration: any): Promise<string> {
        const collaborationMessage = `Executing collaboration: ${collaboration.initiator} → ${collaboration.target} for "${collaboration.task}"`;
        
        // Store collaboration attempt
        this.collaborationHistory.push({
            from: collaboration.initiator,
            to: collaboration.target,
            task: collaboration.task,
            success: true,
            timestamp: new Date().toISOString()
        });

        return collaborationMessage;
    }
}

export async function EnhancedCollaborationAgentRunner(context: AgentContext): Promise<AgentResponse> {
    try {
        const enhancedCollab = new EnhancedCollaborationAgent();
        const analysis = await enhancedCollab.analyzeCollaborationPatterns();

        let message = `🤝 Enhanced CollaborationAgent: Network health ${analysis.networkHealth} (${analysis.patterns.agents} agents, ${analysis.patterns.connections} connections)`;
        let nextAgent = null;

        if (analysis.nextCollaboration) {
            const collabResult = await enhancedCollab.executeCollaboration(analysis.nextCollaboration);
            message += `. ${collabResult}`;
            nextAgent = analysis.nextCollaboration.target;
        }

        // Store collaboration insights
        await supabase
            .from('agent_memory')
            .insert({
                user_id: context.user_id || 'enhanced_collaboration_agent',
                agent_name: 'enhanced_collaboration_agent',
                memory_key: 'collaboration_analysis',
                memory_value: JSON.stringify(analysis),
                timestamp: new Date().toISOString()
            });

        // Log to supervisor queue
        await supabase
            .from('supervisor_queue')
            .insert({
                user_id: context.user_id || 'enhanced_collaboration_agent',
                agent_name: 'enhanced_collaboration_agent',
                action: 'enhance_collaboration',
                input: JSON.stringify({ action: 'analyze_and_optimize_collaboration' }),
                status: 'completed',
                output: message
            });

        return {
            success: true,
            message,
            data: analysis,
            timestamp: new Date().toISOString(),
            nextAgent,
            shouldContinue: true
        };
    } catch (error) {
        return {
            success: false,
            message: `❌ Enhanced CollaborationAgent error: ${error.message}`
        };
    }
}
