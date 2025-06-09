
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MemoryAgent } from '@/agents/MemoryAgent';
import { SelfImprovementAgent } from '@/agents/SelfImprovementAgent';
import { EnhancedGoalAgent } from '@/agents/EnhancedGoalAgent';
import { EnhancedCollaborationAgent } from '@/agents/EnhancedCollaborationAgent';
import { FactoryAgent } from '@/agents/FactoryAgent';
import { ResearchAgent } from '@/agents/ResearchAgent';

export class OrchestratorAgent {
  private heartbeatInterval?: NodeJS.Timeout;

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      await sendChatUpdate('💓 System active... monitoring progress.');
    }, 15000); // every 15 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }

  private detectMissingSkills(): string[] {
    // Placeholder logic - in production this would analyze failed tasks
    const availableSkills = ['memory', 'research', 'collaboration', 'goal_setting'];
    const requiredSkills = ['data_analysis', 'optimization', 'monitoring'];
    
    return requiredSkills.filter(skill => !availableSkills.includes(skill));
  }

  async runOrchestration(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🛠️ Starting orchestration cycle...');
      this.startHeartbeat();

      // === SEQUENTIAL AGENTS FIRST (State Critical) ===
      await sendChatUpdate('🔄 Running MemoryAgent...');
      await new MemoryAgent().runner(context);
      await sendChatUpdate('✅ MemoryAgent completed.');

      await sendChatUpdate('🔧 Running SelfImprovementAgent...');
      await new SelfImprovementAgent().runner(context);
      await sendChatUpdate('✅ SelfImprovementAgent completed.');

      await sendChatUpdate('🎯 Running EnhancedGoalAgent...');
      const goalResponse = await new EnhancedGoalAgent().runner(context);
      await sendChatUpdate('✅ EnhancedGoalAgent completed.');

      // === PARALLEL EXECUTION (Safe Agents) ===
      await sendChatUpdate('🚀 Running parallel agents: ResearchAgent + DataGathering...');
      
      const parallelResults = await Promise.all([
        new ResearchAgent(context),
        // Add more parallel agents here as needed
        this.runDataGatheringAgent(context),
        this.runAnalysisAgent(context)
      ]);
      
      await sendChatUpdate('✅ Parallel agents completed.');

      // === SEQUENTIAL AGENTS RESUME ===
      await sendChatUpdate('🤝 Running EnhancedCollaborationAgent...');
      await new EnhancedCollaborationAgent().runner(context);
      await sendChatUpdate('✅ EnhancedCollaborationAgent completed.');

      // === DYNAMIC AGENT CREATION ===
      const missingSkills = this.detectMissingSkills();
      
      if (missingSkills.length > 0 || goalResponse?.data?.newAgentsNeeded) {
        await sendChatUpdate(`⚠️ Missing skills detected: ${missingSkills.join(', ')}. Triggering FactoryAgent...`);
        
        await FactoryAgent({
          ...context,
          input: { 
            ...context.input,
            missingSkills,
            goalRequirements: goalResponse?.data
          }
        });
        
        await sendChatUpdate('✅ FactoryAgent completed.');
      }

      // === ORCHESTRATION COMPLETE ===
      this.stopHeartbeat();
      await sendChatUpdate('🏁 Orchestration cycle complete.');

      return {
        success: true,
        message: 'Orchestration complete with parallel agent execution.',
        data: {
          parallelResults,
          missingSkills,
          goalResponse: goalResponse?.data
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.stopHeartbeat();
      await sendChatUpdate(`❌ Orchestration error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        success: false,
        message: `❌ Orchestration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async runDataGatheringAgent(context: AgentContext): Promise<AgentResponse> {
    // Simulated data gathering agent
    await sendChatUpdate('📊 DataGatheringAgent: Collecting system metrics...');
    
    return {
      success: true,
      message: 'Data gathering completed',
      data: {
        systemMetrics: {
          uptime: Date.now(),
          performance: Math.random() * 100,
          efficiency: Math.random() * 100
        }
      },
      timestamp: new Date().toISOString()
    };
  }

  private async runAnalysisAgent(context: AgentContext): Promise<AgentResponse> {
    // Simulated analysis agent
    await sendChatUpdate('🔍 AnalysisAgent: Processing data patterns...');
    
    return {
      success: true,
      message: 'Analysis completed',
      data: {
        patterns: ['optimization_opportunity', 'efficiency_gain', 'scaling_potential'],
        recommendations: ['Increase parallel processing', 'Optimize memory usage', 'Enhance error handling']
      },
      timestamp: new Date().toISOString()
    };
  }
}

export async function OrchestratorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const orchestrator = new OrchestratorAgent();
  return await orchestrator.runOrchestration(context);
}
