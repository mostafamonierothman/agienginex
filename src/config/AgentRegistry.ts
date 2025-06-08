
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { agentLogger } from '@/agents/AgentLogger';
import { toast } from '@/hooks/use-toast';

// Import all core agents
import { SupervisorAgent } from '@/agents/SupervisorAgent';
import { ResearchAgent } from '@/agents/ResearchAgent';
import { LearningAgentV2 } from '@/agents/LearningAgentV2';
import { FactoryAgent } from '@/agents/FactoryAgent';
import { CriticAgent } from '@/agents/CriticAgent';
import { LLMAgent } from '@/agents/LLMAgent';
import { CoordinationAgent } from '@/agents/CoordinationAgent';
import { MemoryAgent } from '@/agents/MemoryAgent';
import { StrategicAgent } from '@/agents/StrategicAgent';
import { OpportunityAgent } from '@/agents/OpportunityAgent';
import { EvolutionAgent } from '@/agents/EvolutionAgent';
import { CollaborationAgent } from '@/agents/CollaborationAgent';

// Import new enhanced agents
import { BrowserAgent } from '@/agents/BrowserAgent';
import { APIConnectorAgent } from '@/agents/APIConnectorAgent';
import { GoalAgent } from '@/agents/GoalAgent';
import { MetaAgent } from '@/agents/MetaAgent';
import { SecurityAgent } from '@/agents/SecurityAgent';
import { TimelineAgent } from '@/agents/TimelineAgent';
import { CreativityAgent } from '@/agents/CreativityAgent';

export interface RegisteredAgent {
  name: string;
  description: string;
  category: 'core' | 'enhanced' | 'utility';
  version: string;
  runner: (context: AgentContext) => Promise<AgentResponse>;
}

export interface SystemStatus {
  totalAgents: number;
  coreAgents: number;
  enhancedAgents: number;
  version: string;
}

export class AgentRegistryClass {
  private agents: RegisteredAgent[] = [];
  private runners: Map<string, (context: AgentContext) => Promise<AgentResponse>> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Core agents (12) - store the function references directly
    this.registerAgent('SupervisorAgent', 'Monitors all system activities', 'core', 'V4.0', SupervisorAgent);
    this.registerAgent('ResearchAgent', 'Scans external sources for insights', 'core', 'V4.0', ResearchAgent);
    this.registerAgent('LearningAgentV2', 'Advanced learning and adaptation', 'core', 'V4.0', LearningAgentV2);
    this.registerAgent('FactoryAgent', 'Creates new agents dynamically', 'core', 'V4.0', FactoryAgent);
    this.registerAgent('CriticAgent', 'Evaluates system performance', 'core', 'V4.0', CriticAgent);
    this.registerAgent('LLMAgent', 'Language model processing', 'core', 'V4.0', LLMAgent);
    this.registerAgent('CoordinationAgent', 'Manages agent workflows', 'core', 'V4.0', CoordinationAgent);
    this.registerAgent('MemoryAgent', 'Vector memory management', 'core', 'V4.0', MemoryAgent);
    this.registerAgent('StrategicAgent', 'Strategic planning and decisions', 'core', 'V4.0', StrategicAgent);
    this.registerAgent('OpportunityAgent', 'Identifies market opportunities', 'core', 'V4.0', OpportunityAgent);
    this.registerAgent('EvolutionAgent', 'Handles agent evolution and genomes', 'core', 'V4.0', EvolutionAgent);
    this.registerAgent('CollaborationAgent', 'Manages agent-to-agent communication', 'core', 'V4.0', CollaborationAgent);

    // Enhanced agents (7) - store the function references directly
    this.registerAgent('BrowserAgent', 'Web browsing and scraping capabilities', 'enhanced', 'V4.5+', BrowserAgent);
    this.registerAgent('APIConnectorAgent', 'External API integrations', 'enhanced', 'V4.5+', APIConnectorAgent);
    this.registerAgent('GoalAgent', 'Goal setting and tracking', 'enhanced', 'V4.5+', GoalAgent);
    this.registerAgent('MetaAgent', 'System analysis and optimization', 'enhanced', 'V4.5+', MetaAgent);
    this.registerAgent('SecurityAgent', 'Security monitoring and threat detection', 'enhanced', 'V4.5+', SecurityAgent);
    this.registerAgent('TimelineAgent', 'Scheduling and time management', 'enhanced', 'V4.5+', TimelineAgent);
    this.registerAgent('CreativityAgent', 'Creative ideation and innovation', 'enhanced', 'V4.5+', CreativityAgent);

    console.log(`🚀 AgentRegistry: Initialized ${this.agents.length} agents`);
  }

  private registerAgent(
    name: string, 
    description: string, 
    category: 'core' | 'enhanced' | 'utility', 
    version: string, 
    runner: (context: AgentContext) => Promise<AgentResponse>
  ) {
    const agent: RegisteredAgent = {
      name,
      description,
      category,
      version,
      runner
    };
    
    this.agents.push(agent);
    this.runners.set(name, runner);
    
    agentLogger.log('AgentRegistry', 'register', `${name} registered successfully`);
  }

  async runAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
    const runner = this.runners.get(agentName);
    
    if (!runner) {
      throw new Error(`Agent ${agentName} not found in registry`);
    }

    try {
      agentLogger.log(agentName, 'start', `Executing with context: ${JSON.stringify(context)}`);
      
      const result = await runner(context);

      agentLogger.log(agentName, 'complete', `Result: ${JSON.stringify(result)}`);
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      agentLogger.log(agentName, 'error', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
  }

  async runRandomAgent(context?: AgentContext): Promise<AgentResponse> {
    const randomAgent = this.getRandomAgent();
    const defaultContext: AgentContext = context || {
      user_id: 'random_execution',
      timestamp: new Date().toISOString()
    };
    
    return await this.runAgent(randomAgent.name, defaultContext);
  }

  getAllAgents(): RegisteredAgent[] {
    return this.agents;
  }

  getAgent(name: string): RegisteredAgent | undefined {
    return this.agents.find(agent => agent.name === name);
  }

  getRandomAgent(): RegisteredAgent {
    const randomIndex = Math.floor(Math.random() * this.agents.length);
    return this.agents[randomIndex];
  }

  getSystemStatus(): SystemStatus {
    const coreAgents = this.agents.filter(a => a.category === 'core').length;
    const enhancedAgents = this.agents.filter(a => a.category === 'enhanced').length;
    
    return {
      totalAgents: this.agents.length,
      coreAgents,
      enhancedAgents,
      version: 'V4.5+'
    };
  }

  getAgentsByCategory(category: 'core' | 'enhanced' | 'utility'): RegisteredAgent[] {
    return this.agents.filter(agent => agent.category === category);
  }
}

// Export singleton instance
export const agentRegistry = new AgentRegistryClass();
