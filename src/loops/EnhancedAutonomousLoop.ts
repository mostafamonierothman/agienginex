
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

// Enhanced V4.5 Agents
import { BrowserAgentRunner } from '@/agents/BrowserAgent';
import { APIConnectorAgentRunner } from '@/agents/APIConnectorAgent';
import { GoalAgentRunner } from '@/agents/GoalAgent';
import { MetaAgentRunner } from '@/agents/MetaAgent';
import { SecurityAgentRunner } from '@/agents/SecurityAgent';
import { TimelineAgentRunner } from '@/agents/TimelineAgent';
import { CreativityAgentRunner } from '@/agents/CreativityAgent';

import { AgentContext } from '@/types/AgentTypes';
import { agentRegistry } from '@/config/AgentRegistry';

export class EnhancedAutonomousLoop {
  private isRunning = false;
  private loopInterval: NodeJS.Timeout | null = null;
  private cycleCount = 0;

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('🔄 Enhanced Autonomous Loop is already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting Enhanced Autonomous Loop V4.5 with 19 agents...');

    this.runLoop();
  }

  stop(): void {
    if (this.loopInterval) {
      clearTimeout(this.loopInterval);
      this.loopInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Enhanced autonomous loop stopped');
  }

  private async runLoop(): Promise<void> {
    if (!this.isRunning) return;

    this.cycleCount++;
    console.log(`🔄 Enhanced Loop Cycle #${this.cycleCount} starting with all 19 agents...`);

    const context: AgentContext = {
      user_id: 'enhanced_autonomous_system',
      timestamp: new Date().toISOString()
    };

    try {
      // Core Agents (12 original)
      const coreAgents = [
        { name: 'SupervisorAgent', runner: () => new SupervisorAgent().runner(context) },
        { name: 'CoordinationAgent', runner: () => CoordinationAgent(context) },
        { name: 'StrategicAgent', runner: () => StrategicAgent(context) },
        { name: 'ResearchAgent', runner: () => ResearchAgent(context) },
        { name: 'OpportunityAgent', runner: () => new OpportunityAgent().runner(context) },
        { name: 'LearningAgentV2', runner: () => LearningAgentV2(context) },
        { name: 'MemoryAgent', runner: () => MemoryAgentRunner(context) },
        { name: 'LLMAgent', runner: () => LLMAgent(context) },
        { name: 'EvolutionAgent', runner: () => EvolutionAgent(context) },
        { name: 'CollaborationAgent', runner: () => CollaborationAgent(context) },
        { name: 'FactoryAgent', runner: () => FactoryAgent(context) },
        { name: 'CriticAgent', runner: () => CriticAgent(context) }
      ];

      // Enhanced Agents (7 new)
      const enhancedAgents = [
        { name: 'BrowserAgent', runner: () => BrowserAgentRunner(context) },
        { name: 'APIConnectorAgent', runner: () => APIConnectorAgentRunner(context) },
        { name: 'GoalAgent', runner: () => GoalAgentRunner(context) },
        { name: 'MetaAgent', runner: () => MetaAgentRunner(context) },
        { name: 'SecurityAgent', runner: () => SecurityAgentRunner(context) },
        { name: 'TimelineAgent', runner: () => TimelineAgentRunner(context) },
        { name: 'CreativityAgent', runner: () => CreativityAgentRunner(context) }
      ];

      // Combine all agents
      const allAgents = [...coreAgents, ...enhancedAgents];

      // Run agents in sequence with enhanced coordination
      for (const { name, runner } of allAgents) {
        try {
          console.log(`🤖 [V4.5] Running ${name}...`);
          const result = await runner();
          
          if (result.success) {
            console.log(`✅ [V4.5] ${name}: ${result.message}`);
          } else {
            console.log(`❌ [V4.5] ${name}: ${result.message}`);
          }
        } catch (error) {
          console.error(`💥 [V4.5] ${name} failed:`, error);
        }

        // Small delay between agents to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      console.log(`✅ Enhanced Loop Cycle #${this.cycleCount} completed with all 19 agents (12 core + 7 enhanced)`);

    } catch (error) {
      console.error('💥 Enhanced autonomous loop cycle error:', error);
    }

    // Schedule next cycle with adaptive timing
    const nextInterval = this.getAdaptiveInterval();
    console.log(`⏰ Next enhanced cycle in ${nextInterval}ms`);
    
    this.loopInterval = setTimeout(() => this.runLoop(), nextInterval);
  }

  private getAdaptiveInterval(): number {
    // Enhanced timing with more agents
    const baseInterval = 3000; // 3 seconds
    const maxInterval = 12000; // 12 seconds
    const adaptiveInterval = Math.min(
      baseInterval + (this.cycleCount * 150),
      maxInterval
    );
    return adaptiveInterval;
  }

  getStatus(): { isRunning: boolean; cycleCount: number; totalAgents: number } {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      totalAgents: 19 // 12 core + 7 enhanced
    };
  }

  async runRandomEnhancedAgent(): Promise<void> {
    const context: AgentContext = {
      user_id: 'random_enhanced_execution',
      timestamp: new Date().toISOString()
    };

    try {
      const result = await agentRegistry.runRandomAgent(context);
      console.log('🎲 Random enhanced agent executed:', result);
    } catch (error) {
      console.error('🎲 Random enhanced agent failed:', error);
    }
  }
}

// Global instance
export const enhancedAutonomousLoop = new EnhancedAutonomousLoop();
