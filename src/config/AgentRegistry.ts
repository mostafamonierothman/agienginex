
import { FactoryAgent } from '@/agents/FactoryAgent';
import { ResearchAgent } from '@/agents/ResearchAgent';
import { LearningAgentV2 } from '@/agents/LearningAgentV2';
import { CriticAgent } from '@/agents/CriticAgent';
import { SupervisorAgent } from '@/agents/SupervisorAgent';
import { LLMAgent } from '@/agents/LLMAgent';
import { CoordinationAgent } from '@/agents/CoordinationAgent';
import { MemoryAgent } from '@/agents/MemoryAgent';
import { StrategicAgent } from '@/agents/StrategicAgent';
import { OpportunityAgent } from '@/agents/OpportunityAgent';
import { EvolutionAgent } from '@/agents/EvolutionAgent';
import { CollaborationAgent } from '@/agents/CollaborationAgent';

// New V4.5 Agents
import { BrowserAgentRunner } from '@/agents/BrowserAgent';
import { APIConnectorAgentRunner } from '@/agents/APIConnectorAgent';
import { GoalAgentRunner } from '@/agents/GoalAgent';
import { MetaAgentRunner } from '@/agents/MetaAgent';
import { SecurityAgentRunner } from '@/agents/SecurityAgent';
import { TimelineAgentRunner } from '@/agents/TimelineAgent';
import { CreativityAgentRunner } from '@/agents/CreativityAgent';

import { AgentLogger } from '@/agents/AgentLogger';
import { UpgradedSupervisor } from '@/core/UpgradedSupervisor';
import { PersistentMemory } from '@/core/PersistentMemory';

export interface RegisteredAgent {
  name: string;
  runner: Function;
  description: string;
  category: 'core' | 'enhanced' | 'utility';
  version: string;
}

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, RegisteredAgent> = new Map();
  private logger: AgentLogger;
  private supervisor: UpgradedSupervisor;
  private memory: PersistentMemory;

  private constructor() {
    this.logger = new AgentLogger();
    this.supervisor = new UpgradedSupervisor();
    this.memory = new PersistentMemory();
    this.initializeAgents();
  }

  static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  private async initializeAgents(): Promise<void> {
    // Core V4 Agents (12 original)
    this.registerAgent('SupervisorAgent', SupervisorAgent, 'System oversight and coordination', 'core', 'v4.0');
    this.registerAgent('CoordinationAgent', CoordinationAgent, 'Multi-agent coordination', 'core', 'v4.0');
    this.registerAgent('StrategicAgent', StrategicAgent, 'Strategic planning and analysis', 'core', 'v4.0');
    this.registerAgent('ResearchAgent', ResearchAgent, 'Research and information gathering', 'core', 'v4.0');
    this.registerAgent('OpportunityAgent', OpportunityAgent, 'Opportunity detection and analysis', 'core', 'v4.0');
    this.registerAgent('LearningAgentV2', LearningAgentV2, 'Machine learning and adaptation', 'core', 'v4.0');
    this.registerAgent('MemoryAgent', MemoryAgent, 'Memory management and retrieval', 'core', 'v4.0');
    this.registerAgent('LLMAgent', LLMAgent, 'Language model interactions', 'core', 'v4.0');
    this.registerAgent('EvolutionAgent', EvolutionAgent, 'Evolutionary optimization', 'core', 'v4.0');
    this.registerAgent('CollaborationAgent', CollaborationAgent, 'Agent collaboration facilitation', 'core', 'v4.0');
    this.registerAgent('FactoryAgent', FactoryAgent, 'Dynamic agent creation', 'core', 'v4.0');
    this.registerAgent('CriticAgent', CriticAgent, 'Performance evaluation and criticism', 'core', 'v4.0');

    // Enhanced V4.5 Agents (8 new)
    this.registerAgent('BrowserAgent', BrowserAgentRunner, 'Web browsing and content extraction', 'enhanced', 'v4.5');
    this.registerAgent('APIConnectorAgent', APIConnectorAgentRunner, 'External API integration', 'enhanced', 'v4.5');
    this.registerAgent('GoalAgent', GoalAgentRunner, 'Goal management and tracking', 'enhanced', 'v4.5');
    this.registerAgent('MetaAgent', MetaAgentRunner, 'System meta-analysis and optimization', 'enhanced', 'v4.5');
    this.registerAgent('SecurityAgent', SecurityAgentRunner, 'Security monitoring and threat detection', 'enhanced', 'v4.5');
    this.registerAgent('TimelineAgent', TimelineAgentRunner, 'Time management and scheduling', 'enhanced', 'v4.5');
    this.registerAgent('CreativityAgent', CreativityAgentRunner, 'Creative ideation and innovation', 'enhanced', 'v4.5');

    // Register all agents with supervisor
    for (const [name] of this.agents) {
      await this.supervisor.registerAgent(name);
    }

    console.log(`🚀 AgentRegistry V4.5 initialized with ${this.agents.size} agents`);
    await this.logger.log('AgentRegistry', 'initialize', `${this.agents.size} agents registered successfully`, 'success');
  }

  private registerAgent(name: string, runner: Function, description: string, category: 'core' | 'enhanced' | 'utility', version: string): void {
    this.agents.set(name, {
      name,
      runner,
      description,
      category,
      version
    });
  }

  getAgent(name: string): RegisteredAgent | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  getCoreAgents(): RegisteredAgent[] {
    return this.getAllAgents().filter(agent => agent.category === 'core');
  }

  getEnhancedAgents(): RegisteredAgent[] {
    return this.getAllAgents().filter(agent => agent.category === 'enhanced');
  }

  getRandomAgent(): RegisteredAgent | undefined {
    const agents = this.getAllAgents();
    return agents[Math.floor(Math.random() * agents.length)];
  }

  async runAgent(name: string, context: any): Promise<any> {
    const agent = this.getAgent(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found in registry`);
    }

    try {
      await this.supervisor.reportHealth(name, 'OK');
      const result = await agent.runner(context);
      await this.logger.log('AgentRegistry', 'run_agent', `${name} executed successfully`, 'success');
      return result;
    } catch (error) {
      await this.supervisor.reportHealth(name, 'ERROR');
      await this.logger.log('AgentRegistry', 'run_agent', `${name} failed: ${error.message}`, 'error');
      throw error;
    }
  }

  getSystemStatus() {
    return {
      totalAgents: this.agents.size,
      coreAgents: this.getCoreAgents().length,
      enhancedAgents: this.getEnhancedAgents().length,
      supervisorStatus: this.supervisor.getSystemStatus(),
      version: 'v4.5+'
    };
  }

  async runRandomAgent(context: any): Promise<any> {
    const agent = this.getRandomAgent();
    if (!agent) {
      throw new Error('No agents available');
    }
    return await this.runAgent(agent.name, context);
  }
}

// Export singleton instance
export const agentRegistry = AgentRegistry.getInstance();
