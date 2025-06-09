
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { trillionPathEngine } from '@/engine/TrillionPathEngine';
import { SupervisorAgentRunner } from '@/agents/SupervisorAgent';
import { ReflectionAgentRunner } from '@/agents/ReflectionAgent';
import { AutonomyTriggerAgentRunner } from '@/agents/AutonomyTriggerAgent';
import { CrossAgentFeedbackAgentRunner } from '@/agents/CrossAgentFeedbackAgent';
import { GoalMemoryAgentRunner } from '@/agents/GoalMemoryAgent';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { TrillionPathPersistence } from '@/services/TrillionPathPersistence';

export class EnhancedFemtosecondSupervisor {
  private isRunning = false;
  private cycleCount = 0;
  private startTime = 0;
  private agiCycleCount = 0;
  private lastReflectionTime = 0;
  private lastFeedbackTime = 0;
  private lastGoalEvaluationTime = 0;

  async startEnhancedAGISupervision(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastReflectionTime = Date.now();
    this.lastFeedbackTime = Date.now();
    this.lastGoalEvaluationTime = Date.now();
    
    console.log('🧠 [ENHANCED AGI] Starting true autonomous AGI supervision...');
    
    await sendChatUpdate('🧠 Enhanced AGI: Initiating autonomous reflection, feedback loops, and goal adaptation');
    
    // Initialize trillion path engine
    await trillionPathEngine.initializeTrillionPath();
    
    // Start enhanced AGI cycles
    this.runEnhancedAGICycle();
    
    // Setup 24/7 persistence
    this.setupAdvancedPersistence();
  }

  private runEnhancedAGICycle(): void {
    if (!this.isRunning) return;
    
    const cycleStart = performance.now();
    this.cycleCount++;
    this.agiCycleCount++;
    
    requestAnimationFrame(async () => {
      try {
        const now = Date.now();
        
        // 1. Autonomy Triggers (every cycle - check for autonomous conditions)
        if (this.cycleCount % 1 === 0) {
          await this.checkAutonomyTriggers();
        }
        
        // 2. Real Business Execution (every 2 cycles)
        if (this.cycleCount % 2 === 0) {
          await this.executeRealBusinessActions();
        }
        
        // 3. Cross-Agent Feedback (every 10 cycles or 5 minutes)
        if (this.cycleCount % 10 === 0 || (now - this.lastFeedbackTime) > 5 * 60 * 1000) {
          await this.executeCrossAgentFeedback();
          this.lastFeedbackTime = now;
        }
        
        // 4. Goal Memory & Adaptation (every 20 cycles or 10 minutes)
        if (this.cycleCount % 20 === 0 || (now - this.lastGoalEvaluationTime) > 10 * 60 * 1000) {
          await this.executeGoalMemoryEvaluation();
          this.lastGoalEvaluationTime = now;
        }
        
        // 5. System Reflection (every 50 cycles or 15 minutes)
        if (this.cycleCount % 50 === 0 || (now - this.lastReflectionTime) > 15 * 60 * 1000) {
          await this.executeSystemReflection();
          this.lastReflectionTime = now;
        }
        
        // 6. Supervisor Oversight (every 30 cycles)
        if (this.cycleCount % 30 === 0) {
          await this.executeSupervisorOversight();
        }
        
        // Progress reporting with AGI insights
        if (this.cycleCount % 1000 === 0) {
          const metrics = trillionPathEngine.getMetrics();
          const runtime = this.formatRuntime(Date.now() - this.startTime);
          await sendChatUpdate(`🧠 ENHANCED AGI: ${this.cycleCount} cycles, ${this.agiCycleCount} AGI decisions, $${(metrics.realRevenue/1000).toFixed(1)}K revenue in ${runtime}`);
        }
        
        // Continue cycle
        this.runEnhancedAGICycle();
        
      } catch (error) {
        console.error('[ENHANCED AGI] Cycle error:', error);
        
        // Self-healing with AGI error analysis
        await this.handleAGIError(error);
        setTimeout(() => this.runEnhancedAGICycle(), 100);
      }
    });
  }

  private async checkAutonomyTriggers(): Promise<void> {
    const context: AgentContext = {
      input: {
        mode: 'continuous_monitoring',
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await AutonomyTriggerAgentRunner(context);
      
      if (result.success && result.data?.triggeredConditions > 0) {
        this.agiCycleCount += result.data.triggeredConditions;
        await sendChatUpdate(`🤖 Autonomous triggers: ${result.data.triggeredConditions} conditions activated`);
      }
    } catch (error) {
      console.error('[AUTONOMY TRIGGERS] Error:', error);
    }
  }

  private async executeRealBusinessActions(): Promise<void> {
    const metrics = trillionPathEngine.getMetrics();
    const context: AgentContext = {
      input: {
        mode: 'enhanced_agi_execution',
        timeline: 'autonomous_acceleration',
        currentRevenue: metrics.realRevenue,
        cycle: this.cycleCount,
        agiDecisionCycle: this.agiCycleCount
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await ExecutionAgentRunner(context);
      
      if (result.success) {
        this.agiCycleCount++;
        await sendChatUpdate(`💰 AGI Execution: Autonomous business action completed`);
      }
    } catch (error) {
      console.error('[AGI EXECUTION] Error:', error);
    }
  }

  private async executeCrossAgentFeedback(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount,
        mode: 'continuous_optimization'
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await CrossAgentFeedbackAgentRunner(context);
      
      if (result.success) {
        this.agiCycleCount++;
        await sendChatUpdate(`🔄 AGI Feedback: Cross-agent optimization completed`);
      }
    } catch (error) {
      console.error('[CROSS-AGENT FEEDBACK] Error:', error);
    }
  }

  private async executeGoalMemoryEvaluation(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount,
        trillionPathMetrics: trillionPathEngine.getMetrics(),
        mode: 'autonomous_goal_adaptation'
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await GoalMemoryAgentRunner(context);
      
      if (result.success) {
        this.agiCycleCount++;
        await sendChatUpdate(`🧠 AGI Goals: Memory evaluation and adaptation completed`);
      }
    } catch (error) {
      console.error('[GOAL MEMORY] Error:', error);
    }
  }

  private async executeSystemReflection(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount,
        systemMetrics: this.getSystemMetrics(),
        mode: 'deep_system_reflection'
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await ReflectionAgentRunner(context);
      
      if (result.success) {
        this.agiCycleCount++;
        await sendChatUpdate(`🔍 AGI Reflection: ${result.message}`);
        
        // If reflection suggests autonomous action, trigger it
        if (result.data?.decisions?.highPriorityAction && result.nextAgent) {
          await this.executeReflectionBasedAction(result.nextAgent, result.data.decisions);
        }
      }
    } catch (error) {
      console.error('[SYSTEM REFLECTION] Error:', error);
    }
  }

  private async executeSupervisorOversight(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount,
        enhancedMode: true,
        autonomousOperations: this.getAutonomousOperationsStatus()
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      const result = await SupervisorAgentRunner(context);
      
      if (result.success) {
        // Log supervisor insights but don't spam with messages
        console.log(`[AGI SUPERVISOR] ${result.message}`);
      }
    } catch (error) {
      console.error('[SUPERVISOR OVERSIGHT] Error:', error);
    }
  }

  private async executeReflectionBasedAction(nextAgent: string, decisions: any): Promise<void> {
    await sendChatUpdate(`🧠 AGI Decision: Reflection triggered autonomous action - ${decisions.reasoning}`);
    
    const context: AgentContext = {
      input: {
        reflectionTriggered: true,
        decisions,
        urgency: 'high',
        agiCycle: this.agiCycleCount
      },
      user_id: 'enhanced_agi_supervisor'
    };

    // Execute the suggested action based on next agent
    try {
      switch (nextAgent) {
        case 'MedicalTourismLeadFactory':
          const { MedicalTourismLeadFactoryRunner } = await import('@/agents/MedicalTourismLeadFactory');
          await MedicalTourismLeadFactoryRunner(context);
          break;
        case 'ExecutionAgent':
          await ExecutionAgentRunner(context);
          break;
        case 'SelfImprovementAgent':
          const { SelfImprovementAgentRunner } = await import('@/agents/SelfImprovementAgent');
          await SelfImprovementAgentRunner(context);
          break;
      }
      
      this.agiCycleCount++;
    } catch (error) {
      console.error('[REFLECTION-BASED ACTION] Error:', error);
    }
  }

  private async handleAGIError(error: any): Promise<void> {
    await sendChatUpdate(`🧠 AGI Self-Healing: Analyzing and recovering from error - ${error.message}`);
    
    // Enhanced error analysis with AGI insights
    const context: AgentContext = {
      input: {
        error: error.message,
        cycle: this.cycleCount,
        agiCycle: this.agiCycleCount,
        mode: 'error_recovery_analysis'
      },
      user_id: 'enhanced_agi_supervisor'
    };

    try {
      await ReflectionAgentRunner(context);
    } catch (recoveryError) {
      console.error('[AGI ERROR RECOVERY] Failed:', recoveryError);
    }
  }

  private getSystemMetrics() {
    return {
      cycleCount: this.cycleCount,
      agiCycleCount: this.agiCycleCount,
      runtime: Date.now() - this.startTime,
      trillionPathMetrics: trillionPathEngine.getMetrics(),
      autonomousDecisionRate: this.agiCycleCount / this.cycleCount
    };
  }

  private getAutonomousOperationsStatus() {
    return {
      totalCycles: this.cycleCount,
      agiDecisions: this.agiCycleCount,
      autonomyRatio: this.agiCycleCount / this.cycleCount,
      lastReflection: this.formatTimeSince(this.lastReflectionTime),
      lastFeedback: this.formatTimeSince(this.lastFeedbackTime),
      lastGoalEvaluation: this.formatTimeSince(this.lastGoalEvaluationTime)
    };
  }

  private formatRuntime(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  private formatTimeSince(timestamp: number): string {
    const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    return `${minutes}m ago`;
  }

  private setupAdvancedPersistence(): void {
    // Enhanced persistence for AGI state
    TrillionPathPersistence.saveState({
      isRunning: this.isRunning,
      startTime: new Date(this.startTime).toISOString(),
      lastUpdate: new Date().toISOString(),
      totalRuntime: Date.now() - this.startTime,
      autoRestart: true,
      enhancedAGI: true,
      agiCycleCount: this.agiCycleCount,
      autonomyRatio: this.agiCycleCount / this.cycleCount
    });
  }

  stop(): void {
    this.isRunning = false;
    console.log('🧠 [ENHANCED AGI] Stopping autonomous AGI supervision');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      agiCycleCount: this.agiCycleCount,
      autonomyRatio: this.cycleCount > 0 ? this.agiCycleCount / this.cycleCount : 0,
      trillionPathMetrics: trillionPathEngine.getMetrics(),
      runtime: this.isRunning ? Date.now() - this.startTime : 0,
      runtimeFormatted: this.formatRuntime(this.isRunning ? Date.now() - this.startTime : 0),
      lastOperations: this.getAutonomousOperationsStatus()
    };
  }
}

export const enhancedFemtosecondSupervisor = new EnhancedFemtosecondSupervisor();
