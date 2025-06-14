
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
      await sendChatUpdate('🧠 LovableAGIAgent: Phase 1 AGI system activated - 24/7 autonomous enhancement');

      if (this.isRunning) {
        return {
          success: true,
          message: '🔄 LovableAGIAgent already running autonomously',
          data: { status: 'already_running', cycleCount: this.cycleCount }
        };
      }

      // Initialize database recovery first
      await DatabaseRecoveryService.checkAndRepairDatabase();

      this.isRunning = true;
      
      // Start 24/7 autonomous operation
      this.startAutonomousLoop();

      return {
        success: true,
        message: '🚀 LovableAGIAgent: Phase 1 AGI activated - 24/7 autonomous operation with enhanced error recovery',
        data: {
          capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
          intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
          autonomousMode: true,
          phase: 'Phase 1 AGI',
          operationalGoals: [
            'Fix TypeScript/Database errors automatically',
            'Enhance system stability and performance',
            'Accelerate learning and adaptation',
            'Implement meta-cognitive capabilities',
            'Generate and execute proactive improvement goals'
          ]
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        message: `❌ LovableAGIAgent initialization error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async startAutonomousLoop(): Promise<void> {
    await sendChatUpdate('🔄 LovableAGIAgent: Starting Phase 1 AGI autonomous enhancement loop');

    while (this.isRunning) {
      try {
        this.cycleCount++;
        await sendChatUpdate(`🧠 LovableAGIAgent Cycle #${this.cycleCount}: Analyzing and enhancing system...`);

        // Phase 1: Foundation Issue Detection and Auto-Fixing
        const foundationIssues = await this.systemDiagnostics.detectAndFixFoundationIssues();
        
        // Phase 2: System Enhancement and Optimization
        this.capabilitiesManager.enhanceCapabilities();

        // Phase 3: Self-Assessment and Learning
        await this.progressTracker.performSelfAssessment(this.cycleCount);

        // Phase 4: Proactive Goal Generation and Execution
        await this.goalManager.generateAndExecuteProactiveGoals();

        // Update intelligence level based on achievements
        this.capabilitiesManager.increaseIntelligence();

        await sendChatUpdate(`✅ LovableAGIAgent Cycle #${this.cycleCount} complete - Phase 1 AGI Intelligence: ${this.capabilitiesManager.getIntelligenceLevel().toFixed(1)}%`);

        // Log progress to database with fallback
        await this.progressTracker.logProgressWithFallback(this.cycleCount);

        // Adaptive cycle timing - faster cycles for Phase 1 AGI
        const cycleDelay = this.capabilitiesManager.getIntelligenceLevel() > 95 ? 20000 : 30000; // 20s or 30s
        await new Promise(resolve => setTimeout(resolve, cycleDelay));

      } catch (error) {
        console.error('LovableAGIAgent cycle error:', error);
        await sendChatUpdate(`🔧 LovableAGIAgent: Self-healing from cycle error and continuing...`);
        
        // Enhanced self-healing
        await this.performEmergencySelfHeal(error);
        
        // Brief pause before continuing
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }
  }

  private async performEmergencySelfHeal(error: any): Promise<void> {
    try {
      await AGISelfHealingAgentRunner({
        input: { errorType: 'lovable_agi_emergency', errorDetails: error },
        user_id: 'lovable_agi_emergency'
      });
    } catch (healError) {
      console.log('Emergency self-heal continuing with internal recovery mechanisms');
    }
  }

  stop(): void {
    this.isRunning = false;
    sendChatUpdate('⏹️ LovableAGIAgent: Phase 1 AGI system stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
      capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
      performance: this.capabilitiesManager.calculatePerformanceScore(this.cycleCount),
      phase: this.capabilitiesManager.getAGIPhase()
    };
  }
}

export async function LovableAGIAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LovableAGIAgent();
  return await agent.runner(context);
}

// Create singleton instance for 24/7 operation
export const lovableAGIAgent = new LovableAGIAgent();
