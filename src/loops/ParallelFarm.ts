
import { FactoryAgent } from '@/agents/FactoryAgent';
import { ResearchAgent } from '@/agents/ResearchAgent';
import { LearningAgentV2 } from '@/agents/LearningAgentV2';
import { CriticAgent } from '@/agents/CriticAgent';
import { SupervisorAgent } from '@/agents/SupervisorAgent';
import { LLMAgent } from '@/agents/LLMAgent';
import { CoordinationAgent } from '@/agents/CoordinationAgent';
import { MemoryAgentRunner } from '@/agents/MemoryAgent';
import { StrategicAgent } from '@/agents/StrategicAgent';
import { OpportunityAgent } from '@/agents/OpportunityAgent';
import { EvolutionAgent } from '@/agents/EvolutionAgent';
import { CollaborationAgent } from '@/agents/CollaborationAgent';
import { AgentContext } from '@/types/AgentTypes';

export class ParallelFarm {
  private isRunning = false;
  private farmInterval: NodeJS.Timeout | null = null;
  private cycleCount = 0;

  async startFarm(userId: string = 'demo_user'): Promise<void> {
    if (this.isRunning) {
      console.log('🚜 Parallel farm is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Parallel Agent Farm with all 12 agents...');

    this.runFarmCycle(userId);
  }

  stopFarm(): void {
    if (this.farmInterval) {
      clearTimeout(this.farmInterval);
      this.farmInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Parallel farm stopped');
  }

  private async runFarmCycle(userId: string): Promise<void> {
    if (!this.isRunning) return;

    this.cycleCount++;
    console.log(`🚜 Parallel Farm Cycle #${this.cycleCount} starting with all 12 agents...`);

    const context: AgentContext = {
      user_id: userId,
      timestamp: new Date().toISOString()
    };

    try {
      // Run all 12 agents in parallel for maximum efficiency
      const agentPromises = [
        this.runAgentSafely('SupervisorAgent', (ctx) => new SupervisorAgent().runner(ctx), context),
        this.runAgentSafely('CoordinationAgent', CoordinationAgent, context),
        this.runAgentSafely('StrategicAgent', StrategicAgent, context),
        this.runAgentSafely('ResearchAgent', ResearchAgent, context),
        this.runAgentSafely('OpportunityAgent', (ctx) => new OpportunityAgent().runner(ctx), context),
        this.runAgentSafely('LearningAgentV2', LearningAgentV2, context),
        this.runAgentSafely('MemoryAgent', MemoryAgentRunner, context),
        this.runAgentSafely('LLMAgent', LLMAgent, { ...context, input: { auto_select: true, complexity: 'medium' } }),
        this.runAgentSafely('EvolutionAgent', EvolutionAgent, context),
        this.runAgentSafely('CollaborationAgent', CollaborationAgent, context),
        this.runAgentSafely('FactoryAgent', FactoryAgent, context),
        this.runAgentSafely('CriticAgent', CriticAgent, context)
      ];

      const results = await Promise.allSettled(agentPromises);
      
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
          console.log(`✅ Agent ${index + 1} completed successfully`);
        } else {
          failureCount++;
          console.log(`❌ Agent ${index + 1} failed:`, result.reason);
        }
      });

      console.log(`✅ Parallel Farm Cycle #${this.cycleCount} completed: ${successCount} success, ${failureCount} failures`);

    } catch (error) {
      console.error('💥 Parallel farm cycle error:', error);
    }

    // Schedule next cycle
    const nextInterval = this.getAdaptiveInterval();
    console.log(`⏰ Next parallel cycle in ${nextInterval}ms`);
    
    this.farmInterval = setTimeout(() => this.runFarmCycle(userId), nextInterval);
  }

  private async runAgentSafely(
    name: string, 
    agent: (context: AgentContext) => Promise<any>, 
    context: AgentContext
  ): Promise<any> {
    try {
      console.log(`🤖 [PARALLEL] Running ${name}...`);
      const result = await agent(context);
      console.log(`✅ [PARALLEL] ${name}: ${result.message}`);
      return result;
    } catch (error) {
      console.error(`💥 [PARALLEL] ${name} failed:`, error);
      throw error;
    }
  }

  private getAdaptiveInterval(): number {
    // Faster intervals for parallel execution
    const baseInterval = 3000; // 3 seconds
    const maxInterval = 8000; // 8 seconds
    const adaptiveInterval = Math.min(
      baseInterval + (this.cycleCount * 100),
      maxInterval
    );
    return adaptiveInterval;
  }

  getStatus(): { isRunning: boolean; cycleCount: number } {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount
    };
  }
}

// Global instance
export const parallelFarm = new ParallelFarm();
