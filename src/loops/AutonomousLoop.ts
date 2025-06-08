
import { FactoryAgent } from '@/agents/FactoryAgent';
import { ResearchAgent } from '@/agents/ResearchAgent';
import { LearningAgentV2 } from '@/agents/LearningAgentV2';
import { CriticAgent } from '@/agents/CriticAgent';
import { SupervisorAgent } from '@/agents/SupervisorAgent';
import { AgentContext } from '@/types/AgentTypes';

export class AutonomousLoop {
  private isRunning = false;
  private loopInterval: NodeJS.Timeout | null = null;
  private cycleCount = 0;

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('🔄 Autonomous loop is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Autonomous Loop System...');

    this.runLoop();
  }

  stop(): void {
    if (this.loopInterval) {
      clearTimeout(this.loopInterval);
      this.loopInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Autonomous loop stopped');
  }

  private async runLoop(): Promise<void> {
    if (!this.isRunning) return;

    this.cycleCount++;
    console.log(`🔄 Autonomous Loop Cycle #${this.cycleCount} starting...`);

    const context: AgentContext = {
      user_id: 'autonomous_system',
      timestamp: new Date().toISOString()
    };

    try {
      // Run agents in sequence for coordinated execution
      const agentRunners = [
        { name: 'SupervisorAgent', runner: SupervisorAgent },
        { name: 'ResearchAgent', runner: ResearchAgent },
        { name: 'LearningAgentV2', runner: LearningAgentV2 },
        { name: 'FactoryAgent', runner: FactoryAgent },
        { name: 'CriticAgent', runner: CriticAgent }
      ];

      for (const { name, runner } of agentRunners) {
        try {
          console.log(`🤖 Running ${name}...`);
          const result = await runner(context);
          
          if (result.success) {
            console.log(`✅ ${name}: ${result.message}`);
          } else {
            console.log(`❌ ${name}: ${result.message}`);
          }
        } catch (error) {
          console.error(`💥 ${name} failed:`, error);
        }

        // Small delay between agents to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Autonomous Loop Cycle #${this.cycleCount} completed`);

    } catch (error) {
      console.error('💥 Autonomous loop cycle error:', error);
    }

    // Schedule next cycle - adaptive timing based on cycle count
    const nextInterval = this.getAdaptiveInterval();
    console.log(`⏰ Next cycle in ${nextInterval}ms`);
    
    this.loopInterval = setTimeout(() => this.runLoop(), nextInterval);
  }

  private getAdaptiveInterval(): number {
    // Start with shorter intervals, gradually increase
    const baseInterval = 2000; // 2 seconds
    const maxInterval = 10000; // 10 seconds
    const adaptiveInterval = Math.min(
      baseInterval + (this.cycleCount * 200),
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
export const autonomousLoop = new AutonomousLoop();
