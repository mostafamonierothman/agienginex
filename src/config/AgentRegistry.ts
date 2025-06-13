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

export class AgentRegistry {
  private agents = new Map<string, (context: AgentContext) => Promise<AgentResponse>>();
  private systemStatus: any = {
    version: 'V9',
    totalAgents: 0,
    coreAgents: 0,
    enhancedAgents: 0,
    toolAgents: 0,
    strategicAgents: 0,
    coordinationAgents: 0,
    emergencyAgents: 0,
    agoAgents: 0
  };

  constructor() {
    this.registerAgent('chat_processor_agent', ChatProcessorAgentRunner, 'Core');
    this.registerAgent('system_context_agent', SystemContextAgentRunner, 'Core');
    this.registerAgent('memory_agent', MemoryAgentRunner, 'Core');
    this.registerAgent('self_improvement_agent', SelfImprovementAgentRunner, 'Enhanced');
    this.registerAgent('enhanced_goal_agent', EnhancedGoalAgentRunner, 'Enhanced');
    this.registerAgent('enhanced_collaboration_agent', EnhancedCollaborationAgentRunner, 'Coordination');
    this.registerAgent('critic_agent', CriticAgentRunner, 'Strategic');
    this.registerAgent('lead_generation_master_agent', LeadGenerationMasterAgentRunner, 'Tool');
    this.registerAgent('execution_agent', ExecutionAgentRunner, 'Tool');
    this.registerAgent('intelligent_agent_factory', IntelligentAgentFactoryRunner, 'Core');
    this.registerAgent('orchestrator_agent', OrchestratorAgentRunner, 'Coordination');
    this.registerAgent('emergency_agent_deployer', EmergencyAgentDeployerRunner, 'Emergency');

    // AGO Agents
    this.registerAgent('agi_consultancy_agent', AGIConsultancyAgentRunner, 'AGO');
    this.registerAgent('medical_tourism_research_agent', MedicalTourismResearchAgentRunner, 'AGO');
    this.registerAgent('customer_acquisition_agent', CustomerAcquisitionAgentRunner, 'AGO');
    
    // Enhanced Executive Agent
    this.registerAgent('enhanced_executive_agent', EnhancedExecutiveAgentRunner, 'Strategic');
    this.registerAgent('executiveagent', EnhancedExecutiveAgentRunner, 'Strategic'); // Alias for API compatibility
    this.registerAgent('executive_agent', EnhancedExecutiveAgentRunner, 'Strategic'); // Alternative naming

    this.updateSystemStatus();
  }

  private registerAgent(name: string, runner: (context: AgentContext) => Promise<AgentResponse>, category: string) {
    this.agents.set(name, runner);
    
    // Update system status based on category
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

  getAllAgents(): { name: string; description: string; category: string; version: string }[] {
    return Array.from(this.agents.entries()).map(([name, runner]) => {
      // Extract description and version from the agent's code or a metadata store
      let description = 'No description available.';
      let version = '1.0';

      if (name === 'chat_processor_agent') {
        description = 'Processes chat messages and determines the next action.';
        version = '1.1';
      } else if (name === 'system_context_agent') {
        description = 'Provides system context to other agents.';
        version = '1.2';
      } else if (name === 'memory_agent') {
        description = 'Manages the system memory and retrieves relevant information.';
        version = '1.3';
      } else if (name === 'self_improvement_agent') {
        description = 'Analyzes past performance and suggests improvements.';
        version = '1.4';
      } else if (name === 'enhanced_goal_agent') {
        description = 'Sets and refines goals based on system state.';
        version = '1.5';
      } else if (name === 'enhanced_collaboration_agent') {
        description = 'Coordinates actions between multiple agents.';
        version = '1.6';
      } else if (name === 'critic_agent') {
        description = 'Evaluates system performance and provides feedback.';
        version = '1.7';
      } else if (name === 'lead_generation_master_agent') {
        description = 'Generates leads using various techniques.';
        version = '1.8';
      } else if (name === 'execution_agent') {
        description = 'Executes tasks and interacts with external systems.';
        version = '1.9';
      } else if (name === 'intelligent_agent_factory') {
        description = 'Creates new agents based on system needs.';
        version = '2.0';
      } else if (name === 'orchestrator_agent') {
        description = 'Orchestrates the execution of multiple agents.';
        version = '2.1';
      } else if (name === 'emergency_agent_deployer') {
        description = 'Deploys emergency agents to handle critical situations.';
        version = '2.2';
      } else if (name === 'agi_consultancy_agent') {
        description = 'Provides AGI consultancy services.';
        version = '2.3';
      } else if (name === 'medical_tourism_research_agent') {
        description = 'Researches medical tourism opportunities.';
        version = '2.4';
      } else if (name === 'customer_acquisition_agent') {
        description = 'Acquires new customers for the business.';
        version = '2.5';
      } else if (name === 'enhanced_executive_agent' || name === 'executiveagent' || name === 'executive_agent') {
        description = 'Provides strategic guidance and decision-making.';
        version = '2.6';
      }

      let category = 'Core';
      if (name.includes('enhanced')) {
        category = 'Enhanced';
      } else if (name.includes('tool')) {
        category = 'Tool';
      } else if (name.includes('strategic')) {
        category = 'Strategic';
      } else if (name.includes('coordination')) {
        category = 'Coordination';
      } else if (name.includes('emergency')) {
        category = 'Emergency';
      } else if (name.includes('ago') || name.includes('consultancy') || name.includes('tourism') || name.includes('acquisition')) {
        category = 'AGO';
      }

      return { name, description, category, version };
    });
  }

  getSystemStatus() {
    return this.systemStatus;
  }

  updateSystemStatus() {
    this.systemStatus.totalAgents = this.agents.size;
  }

  getSystemStatusDetails() {
    return {
      totalAgents: this.agents.size,
      agentList: Array.from(this.agents.keys())
    };
  }
}

export const agentRegistry = new AgentRegistry();
