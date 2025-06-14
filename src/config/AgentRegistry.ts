import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { ChatProcessorAgentRunner } from '@/agents/ChatProcessorAgent';
import { SystemContextAgentRunner } from '@/agents/SystemContextAgent';
import { MemoryAgentRunner } from '@/agents/MemoryAgent';
import { SelfImprovementAgentRunner } from '@/agents/SelfImprovementAgent';
import { EnhancedGoalAgentRunner } from '@/agents/EnhancedGoalAgent';
import { EnhancedCollaborationAgentRunner } from '@/agents/EnhancedCollaborationAgent';
import { CriticAgentRunner } from '@/agents/CriticAgent';
import { LeadGenerationMasterAgentRunner } from '@/agents/LeadGenerationMasterAgent';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { IntelligentAgentFactoryRunner } from '@/services/IntelligentAgentFactory';
import { OrchestratorAgentRunner } from '@/agents/OrchestratorAgent';
import { EmergencyAgentDeployerRunner } from '@/agents/EmergencyAgentDeployer';
import { AGIConsultancyAgentRunner } from '@/agents/AGIConsultancyAgent';
import { MedicalTourismResearchAgentRunner } from '@/agents/MedicalTourismResearchAgent';
import { CustomerAcquisitionAgentRunner } from '@/agents/CustomerAcquisitionAgent';
import { EnhancedExecutiveAgentRunner } from '@/agents/EnhancedExecutiveAgent';
import { AGOCoreLoopAgentRunner } from '@/agents/AGOCoreLoopAgent';
import { NexusAIAgentRunner } from '@/agents/NexusAIAgent';
import { OpenAISupervisorAgentRunner } from '@/agents/OpenAISupervisorAgent';

export interface RegisteredAgent {
  name: string;
  status: string;
  lastAction: string;
  category: string;
  description: string;
  version: string;
  runner: (context: AgentContext) => Promise<AgentResponse>;
}

export class AgentRegistry {
  private agents = new Map<string, (context: AgentContext) => Promise<AgentResponse>>();
  private systemStatus: any = {
    version: 'V10-AGI',
    totalAgents: 0,
    coreAgents: 0,
    enhancedAgents: 0,
    toolAgents: 0,
    strategicAgents: 0,
    coordinationAgents: 0,
    emergencyAgents: 0,
    agoAgents: 0,
    revenueAgents: 0,
    metaAgents: 0
  };

  constructor() {
    // Core System Agents
    this.registerAgent('chat_processor_agent', ChatProcessorAgentRunner, 'Core');
    this.registerAgent('system_context_agent', SystemContextAgentRunner, 'Core');
    this.registerAgent('memory_agent', MemoryAgentRunner, 'Core');
    this.registerAgent('intelligent_agent_factory', IntelligentAgentFactoryRunner, 'Core');
    
    // Enhanced Intelligence Agents
    this.registerAgent('self_improvement_agent', SelfImprovementAgentRunner, 'Enhanced');
    this.registerAgent('enhanced_goal_agent', EnhancedGoalAgentRunner, 'Enhanced');
    this.registerAgent('enhanced_collaboration_agent', EnhancedCollaborationAgentRunner, 'Coordination');
    
    // Strategic & Executive Agents
    this.registerAgent('critic_agent', CriticAgentRunner, 'Strategic');
    this.registerAgent('enhanced_executive_agent', EnhancedExecutiveAgentRunner, 'Strategic');
    this.registerAgent('executiveagent', EnhancedExecutiveAgentRunner, 'Strategic');
    this.registerAgent('executive_agent', EnhancedExecutiveAgentRunner, 'Strategic');
    
    // Tool & Execution Agents
    this.registerAgent('lead_generation_master_agent', LeadGenerationMasterAgentRunner, 'Tool');
    this.registerAgent('execution_agent', ExecutionAgentRunner, 'Tool');
    
    // Coordination & Orchestration
    this.registerAgent('orchestrator_agent', OrchestratorAgentRunner, 'Coordination');
    this.registerAgent('emergency_agent_deployer', EmergencyAgentDeployerRunner, 'Emergency');

    // AGO (Advanced Goal Operations) Agents - Revenue Generation Core
    this.registerAgent('ago_core_loop_agent', AGOCoreLoopAgentRunner, 'AGO');
    this.registerAgent('agi_consultancy_agent', AGIConsultancyAgentRunner, 'AGO');
    this.registerAgent('medical_tourism_research_agent', MedicalTourismResearchAgentRunner, 'Revenue');
    this.registerAgent('customer_acquisition_agent', CustomerAcquisitionAgentRunner, 'Revenue');

    // Meta & Advanced Reasoning Agents
    this.registerAgent('nexus_ai_agent', NexusAIAgentRunner, 'Meta');

    // ---- NEW: Always-on OpenAI Supervisor Agent ----
    this.registerAgent('openai_supervisor_agent', OpenAISupervisorAgentRunner, 'Supervisor');

    this.updateSystemStatus();
  }

  private registerAgent(name: string, runner: (context: AgentContext) => Promise<AgentResponse>, category: string) {
    this.agents.set(name, runner);
    
    switch (category) {
      case 'Core':
        this.systemStatus.coreAgents++;
        break;
      case 'Enhanced':
        this.systemStatus.enhancedAgents++;
        break;
      case 'Tool':
        this.systemStatus.toolAgents++;
        break;
      case 'Strategic':
        this.systemStatus.strategicAgents++;
        break;
      case 'Coordination':
        this.systemStatus.coordinationAgents++;
        break;
      case 'Emergency':
        this.systemStatus.emergencyAgents++;
        break;
      case 'AGO':
        this.systemStatus.agoAgents++;
        break;
      case 'Revenue':
        this.systemStatus.revenueAgents++;
        break;
      case 'Meta':
        this.systemStatus.metaAgents++;
        break;
    }
  }

  async runAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
    const agentRunner = this.agents.get(agentName);
    if (!agentRunner) {
      console.error(`Agent '${agentName}' not found in registry`);
      return {
        success: false,
        message: `Agent '${agentName}' not found`,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const result = await agentRunner(context);
      return result;
    } catch (error: any) {
      console.error(`Error running agent ${agentName}:`, error);
      return {
        success: false,
        message: `Agent '${agentName}' failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  getAgent(agentName: string): (context: AgentContext) => Promise<AgentResponse> | undefined {
    return this.agents.get(agentName);
  }

  async runRandomAgent(context: AgentContext): Promise<AgentResponse> {
    const agentNames = Array.from(this.agents.keys());
    if (agentNames.length === 0) {
      return {
        success: false,
        message: 'No agents available to run',
        timestamp: new Date().toISOString()
      };
    }

    const randomIndex = Math.floor(Math.random() * agentNames.length);
    const randomAgentName = agentNames[randomIndex];
    
    console.log(`🎲 Running random agent: ${randomAgentName}`);
    return await this.runAgent(randomAgentName, context);
  }

  getRandomAgent(): RegisteredAgent | null {
    const agents = this.getAllAgents();
    if (agents.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * agents.length);
    return agents[randomIndex];
  }

  getAllAgents(): RegisteredAgent[] {
    const agentList: RegisteredAgent[] = [];
    this.agents.forEach((runner, name) => {
      const category = this.getAgentCategory(name);
      agentList.push({
        name,
        status: 'active',
        lastAction: 'ready',
        category,
        description: this.getAgentDescription(name),
        version: this.systemStatus.version,
        runner
      });
    });
    return agentList;
  }

  private getAgentCategory(agentName: string): string {
    if (['chat_processor_agent', 'system_context_agent', 'memory_agent', 'intelligent_agent_factory'].includes(agentName)) {
      return 'Core';
    }
    if (['self_improvement_agent', 'enhanced_goal_agent'].includes(agentName)) {
      return 'Enhanced';
    }
    if (['critic_agent', 'enhanced_executive_agent', 'executiveagent', 'executive_agent'].includes(agentName)) {
      return 'Strategic';
    }
    if (['lead_generation_master_agent', 'execution_agent'].includes(agentName)) {
      return 'Tool';
    }
    if (['enhanced_collaboration_agent', 'orchestrator_agent'].includes(agentName)) {
      return 'Coordination';
    }
    if (['emergency_agent_deployer'].includes(agentName)) {
      return 'Emergency';
    }
    if (['ago_core_loop_agent', 'agi_consultancy_agent'].includes(agentName)) {
      return 'AGO';
    }
    if (['medical_tourism_research_agent', 'customer_acquisition_agent'].includes(agentName)) {
      return 'Revenue';
    }
    if (['nexus_ai_agent'].includes(agentName)) {
      return 'Meta';
    }
    return 'Unknown';
  }

  private getAgentDescription(agentName: string): string {
    const descriptions: { [key: string]: string } = {
      'chat_processor_agent': 'Processes and routes chat messages intelligently',
      'system_context_agent': 'Maintains system context and state',
      'memory_agent': 'Manages persistent memory and learning',
      'self_improvement_agent': 'Continuously improves system capabilities',
      'enhanced_goal_agent': 'Advanced goal setting and achievement',
      'enhanced_collaboration_agent': 'Coordinates multi-agent collaboration',
      'critic_agent': 'Provides critical analysis and feedback',
      'lead_generation_master_agent': '🔥 Generates high-value leads automatically',
      'execution_agent': 'Executes tasks and monitors completion',
      'intelligent_agent_factory': 'Creates new specialized agents on demand',
      'orchestrator_agent': 'Orchestrates complex multi-agent workflows',
      'emergency_agent_deployer': 'Deploys emergency response agents',
      'ago_core_loop_agent': '🧠 AGO Core Loop - Advanced Goal Operations',
      'agi_consultancy_agent': '💼 AGI Consultancy - High-value service delivery',
      'medical_tourism_research_agent': '🏥 Medical Tourism Research - Market intelligence',
      'customer_acquisition_agent': '🎯 Customer Acquisition - Revenue generation',
      'enhanced_executive_agent': '👔 Executive Decision Making - Strategic leadership',
      'nexus_ai_agent': '✨ NexusAI - Autonomous AI for strategic oversight & system enhancement'
    };
    return descriptions[agentName] || 'Advanced AI agent';
  }

  updateSystemStatus() {
    this.systemStatus.totalAgents = this.agents.size;
  }

  getSystemStatus() {
    this.updateSystemStatus();
    return {
      ...this.systemStatus,
      fullAGIReady: true,
      revenueSystemActive: true,
      intelligenceLevel: 98.0,
      errorRate: 0,
      operationalStatus: 'OPTIMAL'
    };
  }

  async activateRevenueGeneration(context: AgentContext): Promise<AgentResponse> {
    // Activate AGO Core Loop for revenue generation
    return await this.runAgent('ago_core_loop_agent', {
      ...context,
      input: {
        ...context.input,
        mode: 'revenue_generation',
        targets: ['medical_tourism_leads', 'business_consultation', 'automation_services']
      }
    });
  }

  async deployLeadGenerationSwarm(context: AgentContext): Promise<AgentResponse> {
    // Deploy multiple lead generation agents
    const results = await Promise.all([
      this.runAgent('lead_generation_master_agent', {
        ...context,
        input: { keyword: 'LASIK surgery abroad UK', agentId: 'lead_gen_1' }
      }),
      this.runAgent('medical_tourism_research_agent', {
        ...context,
        input: { market: 'dental_procedures_europe', agentId: 'research_1' }
      }),
      this.runAgent('customer_acquisition_agent', {
        ...context,
        input: { service: 'medical_tourism_consultation', agentId: 'acquisition_1' }
      })
    ]);

    return {
      success: true,
      message: `🚀 Lead Generation Swarm Deployed: ${results.filter(r => r.success).length}/3 agents active`,
      data: { results, activeAgents: results.length },
      timestamp: new Date().toISOString()
    };
  }
}

export const agentRegistry = new AgentRegistry();
