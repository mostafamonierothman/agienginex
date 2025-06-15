import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class EnhancedCollaborationAgent {
    private collaborationSessions: Array<{
        id: string;
        participants: string[];
        topic: string;
        status: 'active' | 'completed';
        messages: Array<{
            agent: string;
            message: string;
            timestamp: string;
        }>;
        created: string;
    }> = [];

    async initiateCollaboration(topic: string, participants: string[]): Promise<string> {
        const sessionId = `collab_${Date.now()}`;
        
        const session = {
            id: sessionId,
            participants,
            topic,
            status: 'active' as const,
            messages: [],
            created: new Date().toISOString()
        };

        this.collaborationSessions.push(session);
        
        console.log(`[EnhancedCollaborationAgent] Started collaboration on "${topic}" with ${participants.length} agents`);
        return sessionId;
    }

    async addMessage(sessionId: string, agent: string, message: string): Promise<void> {
        const session = this.collaborationSessions.find(s => s.id === sessionId);
        if (session) {
            session.messages.push({
                agent,
                message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async coordinateAgentHandoff(fromAgent: string, toAgent: string, context: any): Promise<{
        success: boolean;
        handoffData: any;
        recommendations: string[];
    }> {
        try {
            const handoffData = {
                fromAgent,
                toAgent,
                context,
                timestamp: new Date().toISOString(),
                handoffId: `handoff_${Date.now()}`
            };

            const recommendations = this.generateHandoffRecommendations(fromAgent, toAgent, context);

            // Store handoff in memory
            await supabase
                .from('api.agent_memory' as any)
                .insert({
                    user_id: 'enhanced_collaboration_agent',
                    agent_name: 'enhanced_collaboration_agent',
                    memory_key: `handoff_${handoffData.handoffId}`,
                    memory_value: JSON.stringify(handoffData),
                    timestamp: new Date().toISOString()
                });

            console.log(`[EnhancedCollaborationAgent] Coordinated handoff: ${fromAgent} → ${toAgent}`);
            
            return {
                success: true,
                handoffData,
                recommendations
            };
        } catch (error) {
            console.error('[EnhancedCollaborationAgent] Handoff failed:', error);
            return {
                success: false,
                handoffData: null,
                recommendations: ['Retry handoff with error handling']
            };
        }
    }

    private generateHandoffRecommendations(fromAgent: string, toAgent: string, context: any): string[] {
        const recommendations = [];

        // Agent-specific handoff strategies
        if (toAgent.includes('Research')) {
            recommendations.push('Provide detailed research parameters and scope');
            recommendations.push('Include relevant keywords and search criteria');
        }
        
        if (toAgent.includes('Learning')) {
            recommendations.push('Share performance metrics and learning objectives');
            recommendations.push('Include training data and feedback loops');
        }
        
        if (toAgent.includes('Strategic')) {
            recommendations.push('Provide long-term objectives and constraints');
            recommendations.push('Include resource allocation and timeline requirements');
        }

        if (fromAgent.includes('Meta')) {
            recommendations.push('Include system optimization insights');
            recommendations.push('Share performance analytics and bottlenecks');
        }

        recommendations.push('Maintain context continuity across agents');
        recommendations.push('Log all decisions and reasoning for audit trail');

        return recommendations;
    }

    getCollaborationMetrics(): {
        activeSessions: number;
        totalMessages: number;
        averageParticipants: number;
        completedSessions: number;
    } {
        const activeSessions = this.collaborationSessions.filter(s => s.status === 'active').length;
        const completedSessions = this.collaborationSessions.filter(s => s.status === 'completed').length;
        const totalMessages = this.collaborationSessions.reduce((sum, s) => sum + s.messages.length, 0);
        const averageParticipants = this.collaborationSessions.length > 0 
            ? this.collaborationSessions.reduce((sum, s) => sum + s.participants.length, 0) / this.collaborationSessions.length
            : 0;

        return {
            activeSessions,
            totalMessages,
            averageParticipants: Math.round(averageParticipants * 10) / 10,
            completedSessions
        };
    }

    async runner(context: AgentContext): Promise<AgentResponse> {
        try {
            const action = context.input?.action || 'coordinate';
            
            if (action === 'handoff' && context.input?.fromAgent && context.input?.toAgent) {
                const handoff = await this.coordinateAgentHandoff(
                    context.input.fromAgent,
                    context.input.toAgent,
                    context.input.context || {}
                );

                await supabase
                    .from('api.supervisor_queue' as any)
                    .insert({
                        user_id: context.user_id || 'enhanced_collaboration_agent',
                        agent_name: 'enhanced_collaboration_agent',
                        action: 'coordinate_handoff',
                        input: JSON.stringify(context.input),
                        status: handoff.success ? 'completed' : 'error',
                        output: `Handoff ${context.input.fromAgent} → ${context.input.toAgent}: ${handoff.success ? 'Success' : 'Failed'}`
                    });

                return {
                    success: handoff.success,
                    message: `🤝 Enhanced CollaborationAgent: ${handoff.success ? 'Successfully coordinated' : 'Failed to coordinate'} handoff ${context.input.fromAgent} → ${context.input.toAgent}`,
                    data: { handoff, recommendations: handoff.recommendations },
                    timestamp: new Date().toISOString(),
                    nextAgent: context.input.toAgent
                };
            }

            // Default coordination action
            const availableAgents = [
                'ResearchAgent', 'LearningAgentV2', 'StrategicAgent', 
                'CreativityAgent', 'CriticAgent', 'MemoryAgent'
            ];
            
            const selectedAgents = availableAgents
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.floor(Math.random() * 3) + 2);

            const topic = context.input?.topic || 'System optimization and performance enhancement';
            const sessionId = await this.initiateCollaboration(topic, selectedAgents);
            
            const metrics = this.getCollaborationMetrics();

            await supabase
                .from('api.supervisor_queue' as any)
                .insert({
                    user_id: context.user_id || 'enhanced_collaboration_agent',
                    agent_name: 'enhanced_collaboration_agent',
                    action: 'coordinate_collaboration',
                    input: JSON.stringify({ topic, agents: selectedAgents }),
                    status: 'completed',
                    output: `Started collaboration session ${sessionId} with ${selectedAgents.length} agents`
                });

            return {
                success: true,
                message: `🤝 Enhanced CollaborationAgent: Coordinating ${selectedAgents.length} agents on "${topic}" (${metrics.activeSessions} active sessions)`,
                data: { 
                    sessionId, 
                    participants: selectedAgents, 
                    topic,
                    metrics,
                    action: 'collaboration_initiation'
                },
                timestamp: new Date().toISOString(),
                nextAgent: selectedAgents[0]
            };
        } catch (error) {
            return {
                success: false,
                message: `❌ Enhanced CollaborationAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}

export async function EnhancedCollaborationAgentRunner(context: AgentContext): Promise<AgentResponse> {
    const agent = new EnhancedCollaborationAgent();
    return await agent.runner(context);
}
