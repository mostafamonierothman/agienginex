
import { SupabaseMemoryService } from '@/services/SupabaseMemoryService';
import { agentRegistry } from '@/config/AgentRegistry';

class EnhancedFemtosecondSupervisor {
  private isRunning = false;
  private cycleCount = 0;
  private agiCycleCount = 0;
  private startTime = Date.now();
  private intervalId: NodeJS.Timeout | null = null;

  async startEnhancedAGISupervision() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    console.log('🚀 Starting Enhanced AGI Supervision...');
    
    // Save start state
    await SupabaseMemoryService.saveExecutionLog('EnhancedFemtosecondSupervisor', 'start', {
      success: true,
      message: 'Enhanced AGI Supervision started',
      timestamp: new Date().toISOString()
    });

    // Start the supervision loop
    this.intervalId = setInterval(async () => {
      await this.supervisionCycle();
    }, 5000); // Run every 5 seconds
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('⏹️ Enhanced AGI Supervision stopped');
  }

  private async supervisionCycle() {
    this.cycleCount++;
    
    try {
      // Run AGO Core Loop Agent occasionally
      if (this.cycleCount % 3 === 0) {
        this.agiCycleCount++;
        await this.runAGOCoreLoop();
      }
      
      // Run other agents periodically
      if (this.cycleCount % 5 === 0) {
        await this.runRandomAgent();
      }
      
    } catch (error) {
      console.error('Supervision cycle error:', error);
    }
  }

  private async runAGOCoreLoop() {
    try {
      const result = await agentRegistry.runAgent('ago_core_loop_agent', {
        input: { 
          trigger: 'supervision_cycle',
          cycle: this.agiCycleCount 
        },
        user_id: 'enhanced_supervisor'
      });
      
      await SupabaseMemoryService.saveExecutionLog('AGOCoreLoopAgent', 'supervision_run', result);
    } catch (error) {
      console.error('AGO Core Loop error:', error);
    }
  }

  private async runRandomAgent() {
    try {
      const randomAgent = agentRegistry.getRandomAgent();
      const result = await randomAgent.runner({
        input: { trigger: 'supervision_cycle' },
        user_id: 'enhanced_supervisor'
      });
      
      await SupabaseMemoryService.saveExecutionLog(randomAgent.name, 'random_run', result);
    } catch (error) {
      console.error('Random agent error:', error);
    }
  }

  getStatus() {
    const runtime = Date.now() - this.startTime;
    const runtimeMinutes = Math.floor(runtime / 60000);
    
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      agiCycleCount: this.agiCycleCount,
      autonomyRatio: this.agiCycleCount > 0 ? this.agiCycleCount / this.cycleCount : 0,
      runtime,
      runtimeFormatted: `${runtimeMinutes}m`,
      lastOperations: {
        totalCycles: this.cycleCount,
        agiDecisions: this.agiCycleCount,
        autonomyRatio: this.agiCycleCount > 0 ? this.agiCycleCount / this.cycleCount : 0,
        lastReflection: `Cycle ${this.cycleCount} completed`,
        lastFeedback: `AGI cycles: ${this.agiCycleCount}`,
        lastGoalEvaluation: `Runtime: ${runtimeMinutes}m`
      }
    };
  }
}

export const enhancedFemtosecondSupervisor = new EnhancedFemtosecondSupervisor();
