
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { agentLogger } from '@/agents/AgentLogger';
import { persistentMemory } from '@/core/PersistentMemory';
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
  instance: any;
}

export interface SystemStatus {
  totalAgents: number;
  coreAgents: number;
  enhancedAgents: number;
  version: string;
}

export class AgentRegistryClass {
  private agents: RegisteredAgent[] = [];
  private instances: Map<string, any> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    // Core agents (12)
    this.registerAgent('SupervisorAgent', 'Monitors all system activities', 'core', 'V4.0', new SupervisorAgent());
    this.registerAgent('ResearchAgent', 'Scans external sources for insights', 'core', 'V4.0', new ResearchAgent());
    this.registerAgent('LearningAgentV2', 'Advanced learning and adaptation', 'core', 'V4.0', new LearningAgentV2());
    this.registerAgent('FactoryAgent', 'Creates new agents dynamically', 'core', 'V4.0', new FactoryAgent());
    this.registerAgent('CriticAgent', 'Evaluates system performance', 'core', 'V4.0', new CriticAgent());
    this.registerAgent('LLMAgent', 'Language model processing', 'core', 'V4.0', new LLMAgent());
    this.registerAgent('CoordinationAgent', 'Manages agent workflows', 'core', 'V4.0', new CoordinationAgent());
    this.registerAgent('MemoryAgent', 'Vector memory management', 'core', 'V4.0', new MemoryAgent());
    this.registerAgent('StrategicAgent', 'Strategic planning and decisions', 'core', 'V4.0', new StrategicAgent());
    this.registerAgent('OpportunityAgent', 'Identifies market opportunities', 'core', 'V4.0', new OpportunityAgent());
    this.registerAgent('EvolutionAgent', 'Handles agent evolution and genomes', 'core', 'V4.0', new EvolutionAgent());
    this.registerAgent('CollaborationAgent', 'Manages agent-to-agent communication', 'core', 'V4.0', new CollaborationAgent());

    // Enhanced agents (8)
    this.registerAgent('BrowserAgent', 'Web browsing and scraping capabilities', 'enhanced', 'V4.5+', new BrowserAgent());
    this.registerAgent('APIConnectorAgent', 'External API integrations', 'enhanced', 'V4.5+', new APIConnectorAgent());
    this.registerAgent('GoalAgent', 'Goal setting and tracking', 'enhanced', 'V4.5+', new GoalAgent());
    this.registerAgent('MetaAgent', 'System analysis and optimization', 'enhanced', 'V4.5+', new MetaAgent());
    this.registerAgent('SecurityAgent', 'Security monitoring and threat detection', 'enhanced', 'V4.5+', new SecurityAgent());
    this.registerAgent('TimelineAgent', 'Scheduling and time management', 'enhanced', 'V4.5+', new TimelineAgent());
    this.registerAgent('CreativityAgent', 'Creative ideation and innovation', 'enhanced', 'V4.5+', new CreativityAgent());

    console.log(`🚀 AgentRegistry: Initialized ${this.agents.length} agents`);
  }

  private registerAgent(name: string, description: string, category: 'core' | 'enhanced' | 'utility', version: string, instance: any) {
    const agent: RegisteredAgent = {
      name,
      description,
      category,
      version,
      instance
    };
    
    this.agents.push(agent);
    this.instances.set(name, instance);
    
    agentLogger.log('AgentRegistry', 'register', `${name} registered successfully`);
  }

  async runAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
    const instance = this.instances.get(agentName);
    
    if (!instance) {
      throw new Error(`Agent ${agentName} not found in registry`);
    }

    try {
      agentLogger.log(agentName, 'start', `Executing with context: ${JSON.stringify(context)}`);
      
      let result;
      if (instance.execute) {
        result = await instance.execute(context);
      } else if (instance.run) {
        result = await instance.run(context);
      } else {
        result = await instance.process(context);
      }

      agentLogger.log(agentName, 'complete', `Result: ${JSON.stringify(result)}`);
      
      return {
        success: true,
        message: result?.message || `${agentName} executed successfully`,
        data: result,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      const errorMessage = error.message || 'Unknown error occurred';
      agentLogger.log(agentName, 'error', errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString()
      };
    }
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
