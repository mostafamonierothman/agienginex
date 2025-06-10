
import { TrillionPathPersistence, TrillionPathState } from '@/services/TrillionPathPersistence';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { ReflectionAgentRunner } from '@/agents/ReflectionAgent';
import { AutonomyTriggerAgentRunner } from '@/agents/AutonomyTriggerAgent';
import { CrossAgentFeedbackAgentRunner } from '@/agents/CrossAgentFeedbackAgent';
import { AGOCoreLoopAgentRunner } from '@/agents/AGOCoreLoopAgent';

interface EnhancedAGIStatus {
  isRunning: boolean;
  cycleCount: number;
  agiCycleCount: number;
  autonomyRatio: number;
  runtime: number;
  runtimeFormatted: string;
  lastOperations: {
    totalCycles: number;
    agiDecisions: number;
    autonomyRatio: number;
    lastReflection: string;
    lastFeedback: string;
    lastGoalEvaluation: string;
  };
}

class EnhancedFemtosecondSupervisor {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private cycleCount = 0;
  private agiCycleCount = 0;
  private startTime: Date | null = null;
  private lastReflection = new Date();
  private lastFeedback = new Date();
  private lastGoalEvaluation = new Date();

  async startEnhancedAGISupervision(): Promise<void> {
    if (this.isRunning) {
      console.log('Enhanced AGI supervision already running');
      return;
    }

    try {
      await sendChatUpdate('🧠 Enhanced AGI Supervisor: Starting advanced autonomous system...');
      
      this.isRunning = true;
      this.startTime = new Date();
      this.cycleCount = 0;
      this.agiCycleCount = 0;

      // Start persistence heartbeat
      TrillionPathPersistence.startHeartbeat();
      
      // Save initial state
      await this.saveCurrentState();

      // Start the main supervision loop
      this.intervalId = setInterval(async () => {
        await this.executeEnhancedAGICycle();
      }, 10000); // 10 second cycles for enhanced AGI

      await sendChatUpdate('✅ Enhanced AGI Supervisor: System active with autonomous capabilities');

    } catch (error) {
      console.error('Failed to start Enhanced AGI supervision:', error);
      this.stop();
      throw error;
    }
  }

  private async executeEnhancedAGICycle(): Promise<void> {
    if (!this.isRunning) return;

    try {
      this.cycleCount++;
      const cycleStart = Date.now();

      await sendChatUpdate(`🔄 Enhanced AGI Cycle ${this.cycleCount}: Autonomous decision-making...`);

      // Determine what type of cycle to run based on priorities
      const cycleType = await this.determineCycleType();
      
      let agiDecisionMade = false;

      switch (cycleType) {
        case 'reflection':
          await this.runReflectionCycle();
          agiDecisionMade = true;
          this.lastReflection = new Date();
          break;

        case 'feedback':
          await this.runFeedbackCycle();
          agiDecisionMade = true;
          this.lastFeedback = new Date();
          break;

        case 'autonomy_check':
          await this.runAutonomyCheck();
          agiDecisionMade = true;
          break;

        case 'goal_execution':
          await this.runGoalExecution();
          agiDecisionMade = true;
          this.lastGoalEvaluation = new Date();
          break;

        default:
          // Standard supervision cycle
          await this.runStandardCycle();
          break;
      }

      if (agiDecisionMade) {
        this.agiCycleCount++;
      }

      // Save state every 5 cycles
      if (this.cycleCount % 5 === 0) {
        await this.saveCurrentState();
      }

      const cycleTime = Date.now() - cycleStart;
      console.log(`Enhanced AGI Cycle ${this.cycleCount} completed in ${cycleTime}ms`);

    } catch (error) {
      console.error(`Enhanced AGI Cycle ${this.cycleCount} error:`, error);
      await sendChatUpdate(`⚠️ Enhanced AGI Cycle ${this.cycleCount} encountered error: ${error.message}`);
    }
  }

  private async determineCycleType(): Promise<string> {
    const now = new Date();
    
    // Check if reflection is needed (every 5 minutes)
    if (now.getTime() - this.lastReflection.getTime() > 5 * 60 * 1000) {
      return 'reflection';
    }

    // Check if feedback analysis is needed (every 3 minutes)
    if (now.getTime() - this.lastFeedback.getTime() > 3 * 60 * 1000) {
      return 'feedback';
    }

    // Check if goal evaluation is needed (every 7 minutes)
    if (now.getTime() - this.lastGoalEvaluation.getTime() > 7 * 60 * 1000) {
      return 'goal_execution';
    }

    // Check autonomy triggers every 2 minutes
    if (this.cycleCount % 12 === 0) { // Every 2 minutes at 10s cycles
      return 'autonomy_check';
    }

    return 'standard';
  }

  private async runReflectionCycle(): Promise<void> {
    await sendChatUpdate('🔍 Enhanced AGI: Running system reflection and analysis...');
    
    try {
      const result = await ReflectionAgentRunner({
        input: { 
          triggerReason: 'scheduled_reflection',
          cycleCount: this.cycleCount,
          agiCycleCount: this.agiCycleCount
        },
        user_id: 'enhanced_agi_supervisor'
      });

      if (result.success && result.data?.decisions?.highPriorityAction) {
        await sendChatUpdate(`🚨 Enhanced AGI: High priority action required - ${result.data.decisions.reasoning}`);
      }

    } catch (error) {
      console.error('Reflection cycle error:', error);
    }
  }

  private async runFeedbackCycle(): Promise<void> {
    await sendChatUpdate('🔄 Enhanced AGI: Analyzing cross-agent feedback and optimization...');
    
    try {
      const result = await CrossAgentFeedbackAgentRunner({
        input: { 
          triggerReason: 'scheduled_feedback_analysis',
          cycleCount: this.cycleCount
        },
        user_id: 'enhanced_agi_supervisor'
      });

      if (result.success && result.data?.optimizations?.some(o => o.urgent)) {
        await sendChatUpdate('⚡ Enhanced AGI: Urgent optimizations identified and applied');
      }

    } catch (error) {
      console.error('Feedback cycle error:', error);
    }
  }

  private async runAutonomyCheck(): Promise<void> {
    await sendChatUpdate('🤖 Enhanced AGI: Checking autonomous trigger conditions...');
    
    try {
      const result = await AutonomyTriggerAgentRunner({
        input: { 
          triggerReason: 'scheduled_autonomy_check',
          cycleCount: this.cycleCount
        },
        user_id: 'enhanced_agi_supervisor'
      });

      if (result.success && result.data?.triggeredConditions > 0) {
        await sendChatUpdate(`🚨 Enhanced AGI: ${result.data.triggeredConditions} autonomous triggers activated`);
      }

    } catch (error) {
      console.error('Autonomy check error:', error);
    }
  }

  private async runGoalExecution(): Promise<void> {
    await sendChatUpdate('🎯 Enhanced AGI: Executing goal-driven autonomous operations...');
    
    try {
      const result = await AGOCoreLoopAgentRunner({
        input: { 
          triggerReason: 'scheduled_goal_execution',
          autonomous: true,
          cycleCount: this.cycleCount
        },
        user_id: 'enhanced_agi_supervisor'
      });

      if (result.success && result.data?.overallScore > 80) {
        await sendChatUpdate(`✅ Enhanced AGI: Goal execution completed with ${result.data.overallScore.toFixed(1)}/100 performance`);
      } else if (result.success) {
        await sendChatUpdate(`⚠️ Enhanced AGI: Goal execution completed but performance below optimal (${result.data?.overallScore?.toFixed(1) || 'unknown'}/100)`);
      }

    } catch (error) {
      console.error('Goal execution error:', error);
    }
  }

  private async runStandardCycle(): Promise<void> {
    // Standard monitoring and maintenance
    await sendChatUpdate(`📊 Enhanced AGI: Standard monitoring cycle ${this.cycleCount}`);
  }

  private async saveCurrentState(): Promise<void> {
    try {
      const state: TrillionPathState = {
        isRunning: this.isRunning,
        startTime: this.startTime?.toISOString() || '',
        lastUpdate: new Date().toISOString(),
        totalRuntime: this.getRuntime(),
        autoRestart: true,
        enhancedAGI: true,
        agiCycleCount: this.agiCycleCount,
        autonomyRatio: this.getAutonomyRatio()
      };

      TrillionPathPersistence.saveState(state);
    } catch (error) {
      console.error('Failed to save Enhanced AGI state:', error);
    }
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    TrillionPathPersistence.stopHeartbeat();
    
    console.log('Enhanced AGI Supervisor stopped');
  }

  getStatus(): EnhancedAGIStatus {
    const runtime = this.getRuntime();
    const autonomyRatio = this.getAutonomyRatio();

    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      agiCycleCount: this.agiCycleCount,
      autonomyRatio,
      runtime,
      runtimeFormatted: this.formatRuntime(runtime),
      lastOperations: {
        totalCycles: this.cycleCount,
        agiDecisions: this.agiCycleCount,
        autonomyRatio,
        lastReflection: this.getTimeAgo(this.lastReflection),
        lastFeedback: this.getTimeAgo(this.lastFeedback),
        lastGoalEvaluation: this.getTimeAgo(this.lastGoalEvaluation)
      }
    };
  }

  private getRuntime(): number {
    if (!this.startTime) return 0;
    return Date.now() - this.startTime.getTime();
  }

  private getAutonomyRatio(): number {
    if (this.cycleCount === 0) return 0;
    return this.agiCycleCount / this.cycleCount;
  }

  private formatRuntime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1m ago';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1h ago';
    return `${diffHours}h ago`;
  }
}

export const enhancedFemtosecondSupervisor = new EnhancedFemtosecondSupervisor();
