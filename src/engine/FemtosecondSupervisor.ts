
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { trillionPathEngine } from '@/engine/TrillionPathEngine';
import { SupervisorAgentRunner } from '@/agents/SupervisorAgent';
import { OrchestratorAgentRunner } from '@/agents/OrchestratorAgent';
import { SelfImprovementAgentRunner } from '@/agents/SelfImprovementAgent';
import { EnhancedGoalAgentRunner } from '@/agents/EnhancedGoalAgent';
import { FactoryAgent } from '@/agents/FactoryAgent';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { TrillionPathPersistence } from '@/services/TrillionPathPersistence';

export class FemtosecondSupervisor {
  private isRunning = false;
  private cycleCount = 0;
  private startTime = 0;
  private performanceMetrics = {
    avgCycleTime: 0,
    successRate: 100,
    errorCount: 0,
    optimizationCount: 0
  };

  async startFemtosecondSupervision(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    console.log('⚡ [ACCELERATED SUPERVISOR] Starting ultra-fast AGI supervision with execution layer...');
    
    // Save state for 24/7 persistence
    TrillionPathPersistence.saveState({
      isRunning: true,
      startTime: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      totalRuntime: 0,
      autoRestart: true
    });
    
    await sendChatUpdate('🔥 AcceleratedSupervisor: Initiating AGGRESSIVE 24/7 execution with real revenue generation');
    
    // Initialize trillion path engine
    await trillionPathEngine.initializeTrillionPath();
    
    // Start accelerated supervision cycles
    this.runAcceleratedSupervisionCycle();
    
    // Setup auto-recovery
    this.setupAutoRecovery();
  }

  private runAcceleratedSupervisionCycle(): void {
    if (!this.isRunning) return;
    
    const cycleStart = performance.now();
    this.cycleCount++;
    
    requestAnimationFrame(async () => {
      try {
        // ACCELERATED EXECUTION PATTERN
        
        // 1. Real Business Execution (every cycle for aggressive timeline)
        if (this.cycleCount % 1 === 0) {
          await this.executeRealBusinessActions();
        }
        
        // 2. Executive Decision Making (every 2 cycles)
        if (this.cycleCount % 2 === 0) {
          await this.executeExecutiveDecisions();
        }
        
        // 3. Strategic Orchestration (every 5 cycles)
        if (this.cycleCount % 5 === 0) {
          await this.executeStrategicOrchestration();
        }
        
        // 4. Self-Improvement (every 10 cycles for continuous optimization)
        if (this.cycleCount % 10 === 0) {
          await this.executeSelfImprovement();
        }
        
        // 5. Goal Evolution (every 20 cycles)
        if (this.cycleCount % 20 === 0) {
          await this.executeGoalEvolution();
        }
        
        // 6. Agent Factory (every 30 cycles or on demand)
        if (this.cycleCount % 30 === 0 || await this.needsMoreExecutionAgents()) {
          await this.executeAgentCreation();
        }
        
        // Update performance metrics
        const cycleTime = performance.now() - cycleStart;
        this.updatePerformanceMetrics(cycleTime);
        
        // Accelerated progress reporting
        if (this.cycleCount % 2000 === 0) {
          const metrics = trillionPathEngine.getMetrics();
          const runtime = TrillionPathPersistence.formatRuntime(Date.now() - this.startTime);
          await sendChatUpdate(`🔥 ACCELERATED: ${this.cycleCount} cycles, $${(metrics.realRevenue/1000).toFixed(1)}K revenue in ${runtime}`);
        }
        
        // Continue cycle
        this.runAcceleratedSupervisionCycle();
        
      } catch (error) {
        console.error('[ACCELERATED SUPERVISOR] Cycle error:', error);
        this.performanceMetrics.errorCount++;
        
        // Self-healing: continue after brief pause
        setTimeout(() => this.runAcceleratedSupervisionCycle(), 1);
      }
    });
  }

  private async executeRealBusinessActions(): Promise<void> {
    const metrics = trillionPathEngine.getMetrics();
    const context: AgentContext = {
      input: {
        mode: 'aggressive_execution',
        timeline: 'day1_10k_target',
        currentRevenue: metrics.realRevenue,
        cycle: this.cycleCount,
        targetMilestone: this.getNextMilestone(metrics.realRevenue)
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await ExecutionAgentRunner(context);
      
      if (result.success && result.data) {
        // Update trillion path engine with real execution results
        await sendChatUpdate(`💰 Real Execution: $${result.data.revenueGenerated?.toLocaleString()} generated, ${result.data.leadsGenerated} leads`);
      }
    } catch (error) {
      console.error('[REAL EXECUTION] Error:', error);
    }
  }

  private getNextMilestone(currentRevenue: number): string {
    if (currentRevenue < 10000) return '10K_day1';
    if (currentRevenue < 1000000) return '1M_week1';
    if (currentRevenue < 100000000) return '100M_month1';
    return '1T_year1';
  }

  private async needsMoreExecutionAgents(): Promise<boolean> {
    const metrics = trillionPathEngine.getMetrics();
    
    // Need more agents if execution throughput is bottlenecking revenue
    return metrics.realRevenue > metrics.virtualizedAgents * 1000 || 
           metrics.taskThroughput < metrics.marketOpportunities * 100;
  }

  private async executeExecutiveDecisions(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        trillionPathMetrics: trillionPathEngine.getMetrics(),
        performanceMetrics: this.performanceMetrics,
        mode: 'accelerated_executive_decisions'
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await SupervisorAgentRunner(context);
      
      if (result.success) {
        // Process executive decisions directly here instead of calling missing method
        await sendChatUpdate(`🎯 Executive decisions: ${result.message}`);
      }
    } catch (error) {
      console.error('[EXECUTIVE DECISIONS] Error:', error);
    }
  }

  private async executeStrategicOrchestration(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        executiveDirectives: this.getExecutiveDirectives(),
        systemState: 'accelerated_orchestration'
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await OrchestratorAgentRunner(context);
      
      if (result.success) {
        await sendChatUpdate(`🎯 Accelerated orchestration: ${result.message}`);
      }
    } catch (error) {
      console.error('[STRATEGIC ORCHESTRATION] Error:', error);
    }
  }

  private async executeSelfImprovement(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        performanceMetrics: this.performanceMetrics,
        trillionPathProgress: trillionPathEngine.getMetrics(),
        optimizationTarget: 'aggressive_execution_acceleration'
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await SelfImprovementAgentRunner(context);
      
      if (result.success) {
        this.performanceMetrics.optimizationCount++;
        await sendChatUpdate(`🔧 Accelerated improvement: ${result.message}`);
      }
    } catch (error) {
      console.error('[SELF IMPROVEMENT] Error:', error);
    }
  }

  private async executeGoalEvolution(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        currentGoals: this.getCurrentGoals(),
        trillionPathProgress: trillionPathEngine.getMetrics(),
        evolutionMode: 'aggressive_execution_optimization'
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await EnhancedGoalAgentRunner(context);
      
      if (result.success) {
        await sendChatUpdate(`🎯 Goals evolved for accelerated execution: ${result.message}`);
      }
    } catch (error) {
      console.error('[GOAL EVOLUTION] Error:', error);
    }
  }

  private async executeAgentCreation(): Promise<void> {
    const context: AgentContext = {
      input: {
        cycle: this.cycleCount,
        requiredSkills: await this.identifyMissingExecutionSkills(),
        urgencyLevel: 'aggressive_execution_acceleration',
        targetCapabilities: ['lead_generation', 'conversion_optimization', 'revenue_scaling', 'customer_acquisition']
      },
      user_id: 'accelerated_supervisor'
    };

    try {
      const result = await FactoryAgent(context);
      
      if (result.success) {
        await sendChatUpdate(`🏭 Created execution agents: ${result.message}`);
      }
    } catch (error) {
      console.error('[AGENT CREATION] Error:', error);
    }
  }

  private getExecutiveDirectives(): string[] {
    const metrics = trillionPathEngine.getMetrics();
    const directives = [
      'maximize_revenue_velocity',
      'accelerate_customer_acquisition',
      'optimize_conversion_rates'
    ];

    if (metrics.realRevenue < 10000) {
      directives.push('execute_day1_10k_strategy');
    } else if (metrics.realRevenue < 1000000) {
      directives.push('scale_to_week1_1m_target');
    } else {
      directives.push('compound_growth_acceleration');
    }

    return directives;
  }

  private getCurrentGoals(): string[] {
    const metrics = trillionPathEngine.getMetrics();
    const goals = [];

    if (metrics.realRevenue < 10000) {
      goals.push('achieve_10k_day1_milestone');
    }
    if (metrics.realRevenue < 1000000) {
      goals.push('reach_1m_week1_target');
    }
    if (metrics.realRevenue < 100000000) {
      goals.push('scale_to_100m_month1');
    }
    
    goals.push('maintain_zero_ad_spend_until_10k');
    goals.push('maximize_organic_growth_rate');
    goals.push('optimize_execution_velocity');

    return goals;
  }

  private async identifyMissingExecutionSkills(): Promise<string[]> {
    const metrics = trillionPathEngine.getMetrics();
    const skills = [];
    
    if (metrics.realRevenue < 10000) skills.push('day1_revenue_generator');
    if (metrics.activeConversions < 10) skills.push('conversion_accelerator');
    if (metrics.customerAcquisitionRate < 100) skills.push('lead_generation_multiplier');
    if (metrics.revenueVelocity < 500000) skills.push('revenue_velocity_booster');
    
    return skills;
  }

  private updatePerformanceMetrics(cycleTime: number): void {
    // Update average cycle time with exponential moving average
    this.performanceMetrics.avgCycleTime = this.performanceMetrics.avgCycleTime * 0.9 + cycleTime * 0.1;
    
    // Update success rate
    const totalCycles = this.cycleCount;
    const successfulCycles = totalCycles - this.performanceMetrics.errorCount;
    this.performanceMetrics.successRate = (successfulCycles / totalCycles) * 100;
  }

  private setupAutoRecovery(): void {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isRunning) {
        console.log('🌙 [24/7] Page hidden, maintaining background operation...');
        TrillionPathPersistence.saveState({
          isRunning: this.isRunning,
          startTime: new Date(this.startTime).toISOString(),
          lastUpdate: new Date().toISOString(),
          totalRuntime: Date.now() - this.startTime,
          autoRestart: true
        });
      } else if (!document.hidden && this.isRunning) {
        console.log('👁️ [24/7] Page visible, continuing trillion-path operation...');
      }
    });

    // Handle beforeunload to save state
    window.addEventListener('beforeunload', () => {
      if (this.isRunning) {
        TrillionPathPersistence.saveState({
          isRunning: this.isRunning,
          startTime: new Date(this.startTime).toISOString(),
          lastUpdate: new Date().toISOString(),
          totalRuntime: Date.now() - this.startTime,
          autoRestart: true
        });
      }
    });

    // Auto-recovery check on startup
    const savedState = TrillionPathPersistence.loadState();
    if (savedState && savedState.autoRestart && !this.isRunning) {
      console.log('🔄 [AUTO-RECOVERY] Resuming 24/7 operation from saved state...');
      setTimeout(() => this.startFemtosecondSupervision(), 1000);
    }
  }

  stop(): void {
    this.isRunning = false;
    
    // Stop heartbeat
    TrillionPathPersistence.stopHeartbeat();
    
    // Update persistence state
    TrillionPathPersistence.saveState({
      isRunning: false,
      startTime: new Date(this.startTime).toISOString(),
      lastUpdate: new Date().toISOString(),
      totalRuntime: Date.now() - this.startTime,
      autoRestart: false
    });
    
    console.log('⏹️ [ACCELERATED SUPERVISOR] Stopped aggressive execution');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      performanceMetrics: { ...this.performanceMetrics },
      trillionPathMetrics: trillionPathEngine.getMetrics(),
      runtime: this.isRunning ? Date.now() - this.startTime : 0,
      runtimeFormatted: TrillionPathPersistence.formatRuntime(this.isRunning ? Date.now() - this.startTime : 0)
    };
  }
}

// Auto-start recovery on module load
const checkAutoStart = () => {
  const savedState = TrillionPathPersistence.loadState();
  if (savedState && savedState.autoRestart && TrillionPathPersistence.shouldAutoRestart()) {
    console.log('🔄 [AUTO-START] Detected previous 24/7 operation, attempting recovery...');
    // Auto-start after a brief delay to ensure system is ready
    setTimeout(() => {
      femtosecondSupervisor.startFemtosecondSupervision();
    }, 2000);
  }
};

// Check for auto-start when module loads
if (typeof window !== 'undefined') {
  checkAutoStart();
}

export const femtosecondSupervisor = new FemtosecondSupervisor();
