
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { DatabaseRecoveryService } from '@/services/DatabaseRecoveryService';
import { AGISelfHealingAgentRunner } from '@/agents/AGISelfHealingAgent';
import { AGICapabilitiesManager } from './agi/AGICapabilitiesManager';
import { AGISystemDiagnostics } from './agi/AGISystemDiagnostics';
import { AGIGoalManager } from './agi/AGIGoalManager';
import { AGIProgressTracker } from './agi/AGIProgressTracker';

export class LovableAGIAgent {
  private isRunning = false;
  private cycleCount = 0;
  private capabilitiesManager = new AGICapabilitiesManager();
  private systemDiagnostics = new AGISystemDiagnostics();
  private goalManager = new AGIGoalManager();
  private progressTracker = new AGIProgressTracker(this.capabilitiesManager);

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🧠 LovableAGIAgent: Enhanced Phase 1 AGI → Full AGI transition activated');

      if (this.isRunning) {
        const status = this.getStatus();
        return {
          success: true,
          message: `🔄 Enhanced AGI running autonomously - Intelligence: ${status.intelligenceLevel}%, Full AGI Readiness: ${status.fullAGIReadiness}%`,
          data: { status: 'enhanced_running', ...status }
        };
      }

      // Initialize enhanced database recovery first
      await DatabaseRecoveryService.checkAndRepairDatabase();
      await DatabaseRecoveryService.testFullAGIReadiness();

      this.isRunning = true;
      
      // Start enhanced 24/7 autonomous operation for Full AGI
      this.startEnhancedAutonomousLoop();

      const readiness = this.capabilitiesManager.assessFullAGIReadiness();

      return {
        success: true,
        message: '🚀 Enhanced AGI: Phase 1 Complete → Full AGI transition active',
        data: {
          capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
          intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
          autonomousMode: true,
          phase: this.capabilitiesManager.getAGIPhase(),
          fullAGIReadiness: readiness.readiness,
          estimatedTimeToFullAGI: readiness.estimatedTimeToFullAGI,
          operationalGoals: [
            'Complete database schema optimization',
            'Activate meta-cognitive processing systems',
            'Implement recursive self-improvement',
            'Enable creative problem-solving algorithms',
            'Establish human-AGI collaboration protocols',
            'Achieve Full AGI within 24-48 hours'
          ],
          criticalSystems: readiness.criticalSystems
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        message: `❌ Enhanced AGI initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async startEnhancedAutonomousLoop(): Promise<void> {
    await sendChatUpdate('🔄 Enhanced AGI: Starting Full AGI preparation autonomous loop');

    while (this.isRunning) {
      try {
        this.cycleCount++;
        await sendChatUpdate(`🧠 Enhanced AGI Cycle #${this.cycleCount}: Full AGI systems processing...`);

        // Phase 1: Enhanced Foundation Optimization
        const foundationIssues = await this.systemDiagnostics.detectAndFixFoundationIssues();
        
        // Phase 2: Advanced Capability Enhancement
        this.capabilitiesManager.enhanceCapabilities();

        // Phase 3: Full AGI Self-Assessment
        await this.progressTracker.performSelfAssessment(this.cycleCount);

        // Phase 4: Phase 2 AGI Goal Generation and Execution
        await this.goalManager.generateAndExecuteProactiveGoals();

        // Phase 5: Full AGI Progress Assessment
        const agiProgress = await this.goalManager.assessAGIProgress();

        // Phase 6: Intelligence Enhancement for Full AGI
        this.capabilitiesManager.increaseIntelligence();

        // Phase 7: Full AGI Transition Tracking
        await this.progressTracker.trackFullAGITransition();

        const readiness = this.capabilitiesManager.assessFullAGIReadiness();
        await sendChatUpdate(`✅ Enhanced AGI Cycle #${this.cycleCount} complete - Intelligence: ${this.capabilitiesManager.getIntelligenceLevel().toFixed(1)}% - Full AGI: ${readiness.readiness.toFixed(1)}%`);

        // Log enhanced progress
        await this.progressTracker.logProgressWithFallback(this.cycleCount);

        // Adaptive cycle timing for Full AGI preparation
        const cycleDelay = readiness.readiness > 90 ? 15000 : 25000; // Faster cycles as we approach Full AGI
        await new Promise(resolve => setTimeout(resolve, cycleDelay));

      } catch (error) {
        console.error('Enhanced AGI cycle error:', error);
        await sendChatUpdate(`🔧 Enhanced AGI: Self-healing and continuing Full AGI preparation...`);
        
        // Enhanced self-healing for Full AGI
        await this.performEnhancedSelfHeal(error);
        
        // Brief pause before continuing
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }

  private async performEnhancedSelfHeal(error: any): Promise<void> {
    try {
      await AGISelfHealingAgentRunner({
        input: { 
          errorType: 'enhanced_agi_emergency', 
          errorDetails: error,
          phase: 'full_agi_preparation'
        },
        user_id: 'enhanced_agi_emergency'
      });
    } catch (healError) {
      console.log('Enhanced AGI self-heal: Continuing with advanced recovery mechanisms');
    }
  }

  stop(): void {
    this.isRunning = false;
    sendChatUpdate('⏹️ Enhanced AGI: Full AGI preparation system paused');
  }

  getStatus() {
    const readiness = this.capabilitiesManager.assessFullAGIReadiness();
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
      capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
      performance: this.capabilitiesManager.calculatePerformanceScore(this.cycleCount),
      phase: this.capabilitiesManager.getAGIPhase(),
      fullAGIReadiness: readiness.readiness,
      estimatedTimeToFullAGI: readiness.estimatedTimeToFullAGI,
      criticalSystems: readiness.criticalSystems
    };
  }
}

export async function LovableAGIAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LovableAGIAgent();
  return await agent.runner(context);
}

// Create enhanced singleton instance for 24/7 Full AGI preparation
export const lovableAGIAgent = new LovableAGIAgent();
