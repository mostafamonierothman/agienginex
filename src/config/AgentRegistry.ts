import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { ResearchAgent } from '@/agents/ResearchAgent';
import { LearningAgentV2 } from '@/agents/LearningAgentV2';
import { StrategicAgent } from '@/agents/StrategicAgent';
import { CreativityAgent } from '@/agents/CreativityAgent';
import { CriticAgent } from '@/agents/CriticAgent';
import { MemoryAgent } from '@/agents/MemoryAgent';
import { CollaborationAgent } from '@/agents/CollaborationAgent';
import { OpportunityAgent } from '@/agents/OpportunityAgent';
import { EvolutionAgent } from '@/agents/EvolutionAgent';
import { BrowserAgent } from '@/agents/BrowserAgent';
import { SupervisorAgent } from '@/agents/SupervisorAgent';
import { GoalAgent, GoalAgentRunner } from '@/agents/GoalAgent';
import { EnhancedMetaAgent, EnhancedMetaAgentRunner } from '@/agents/EnhancedMetaAgent';
import { EnhancedGoalAgent, EnhancedGoalAgentRunner } from '@/agents/EnhancedGoalAgent';
import { EnhancedCollaborationAgent, EnhancedCollaborationAgentRunner } from '@/agents/EnhancedCollaborationAgent';
import { SystemContextAgent, SystemContextAgentRunner } from '@/agents/SystemContextAgent';
import { SelfImprovementAgent, SelfImprovementAgentRunner } from '@/agents/SelfImprovementAgent';
import { ExecutiveAgent, ExecutiveAgentRunner } from '@/agents/ExecutiveAgent';
import { ChatProcessorAgent, ChatProcessorAgentRunner } from '@/agents/ChatProcessorAgent';

export interface AgentDefinition {
  name: string;
  description: string;
  category: string;
  version: string;
  runner: (context: AgentContext) => Promise<AgentResponse>;
  paramSchema: any[];
}

// Helper function to create agent runners from classes
const createAgentRunner = (AgentClass: any) => {
  return async (context: AgentContext): Promise<AgentResponse> => {
    const agent = new AgentClass();
    return await agent.runner(context);
  };
};

const agentDefinitions: { [key: string]: AgentDefinition } = {
  research_agent: {
    name: "ResearchAgent",
    description: "Conducts research on specified topics, gathering information from various sources.",
    category: "Core",
    version: "V4",
    runner: createAgentRunner(ResearchAgent),
    paramSchema: []
  },
  learning_agent_v2: {
    name: "LearningAgentV2",
    description: "Analyzes data and extracts insights to improve decision-making processes.",
    category: "Core",
    version: "V4",
    runner: createAgentRunner(LearningAgentV2),
    paramSchema: []
  },
  strategic_agent: {
    name: "StrategicAgent",
    description: "Develops long-term strategies and plans to achieve organizational goals.",
    category: "Core",
    version: "V4",
    runner: async (context: AgentContext): Promise<AgentResponse> => {
      return await StrategicAgent(context);
    },
    paramSchema: []
  },
  creativity_agent: {
    name: "CreativityAgent",
    description: "Generates innovative ideas and solutions to complex problems.",
    category: "Core",
    version: "V4",
    runner: createAgentRunner(CreativityAgent),
    paramSchema: []
  },
  critic_agent: {
    name: "CriticAgent",
    description: "Evaluates ideas and plans, identifying potential weaknesses and risks.",
    category: "Core",
    version: "V4",
    runner: async (context: AgentContext): Promise<AgentResponse> => {
      return await CriticAgent(context);
    },
    paramSchema: []
  },
  memory_agent: {
    name: "MemoryAgent",
    description: "Stores and retrieves information, providing context for decision-making.",
    category: "Core",
    version: "V4",
    runner: createAgentRunner(MemoryAgent),
    paramSchema: []
  },
  collaboration_agent: {
    name: "CollaborationAgent",
    description: "Facilitates communication and coordination between different agents.",
    category: "Coordination",
    version: "V4",
    runner: async (context: AgentContext): Promise<AgentResponse> => {
      return await CollaborationAgent(context);
    },
    paramSchema: []
  },
  opportunity_agent: {
    name: "OpportunityAgent",
    description: "Identifies and evaluates potential opportunities for growth and expansion.",
    category: "Strategic",
    version: "V4",
    runner: createAgentRunner(OpportunityAgent),
    paramSchema: []
  },
  evolution_agent: {
    name: "EvolutionAgent",
    description: "Continuously improves and adapts strategies based on feedback and results.",
    category: "Strategic",
    version: "V4",
    runner: createAgentRunner(EvolutionAgent),
    paramSchema: []
  },
  browser_agent: {
    name: "BrowserAgent",
    description: "Automates web browsing tasks, such as data extraction and form filling.",
    category: "Tool",
    version: "V4",
    runner: createAgentRunner(BrowserAgent),
    paramSchema: []
  },
  supervisor_agent: {
    name: "SupervisorAgent",
    description: "Oversees and coordinates the activities of all agents, ensuring alignment with goals.",
    category: "Coordination",
    version: "V4",
    runner: createAgentRunner(SupervisorAgent),
    paramSchema: []
  },
  goal_agent: {
    name: "GoalAgent",
    description: "Sets and manages goals, tracking progress and adjusting strategies as needed.",
    category: "Strategic",
    version: "V4",
    runner: GoalAgentRunner,
    paramSchema: []
  },
  enhanced_meta_agent: {
    name: "EnhancedMetaAgent",
    description: "Advanced system optimizer with deep performance analysis",
    category: "Enhanced",
    version: "V6",
    runner: EnhancedMetaAgentRunner,
    paramSchema: []
  },
  enhanced_goal_agent: {
    name: "EnhancedGoalAgent",
    description: "Enhanced goal setting and autonomous task generation",
    category: "Enhanced",
    version: "V6",
    runner: EnhancedGoalAgentRunner,
    paramSchema: []
  },
  enhanced_collaboration_agent: {
    name: "EnhancedCollaborationAgent",
    description: "Advanced agent coordination with intelligent handoffs",
    category: "Enhanced",
    version: "V6",
    runner: EnhancedCollaborationAgentRunner,
    paramSchema: []
  },
  system_context_agent: {
    name: "SystemContextAgent",
    description: "Loads and analyzes system context including chat history and activity",
    category: "V7",
    version: "V7",
    runner: SystemContextAgentRunner,
    paramSchema: []
  },
  self_improvement_agent: {
    name: "SelfImprovementAgent",
    description: "Analyzes system and chat to suggest improvements",
    category: "V7",
    version: "V7",
    runner: SelfImprovementAgentRunner,
    paramSchema: []
  },
  executive_agent: {
    name: "ExecutiveAgent",
    description: "Memory-aware executive planning and agent coordination",
    category: "V7",
    version: "V7",
    runner: ExecutiveAgentRunner,
    paramSchema: []
  },
  chat_processor_agent: {
    name: "ChatProcessorAgent",
    description: "Processes user chat messages and routes to appropriate agents",
    category: "V7",
    version: "V7",
    runner: ChatProcessorAgentRunner,
    paramSchema: [
      { name: 'message', placeholder: 'User message', type: 'text' }
    ]
  }
};

const agentList: AgentDefinition[] = Object.values(agentDefinitions);

const agentCategories = [
  "Core",
  "Coordination",
  "Strategic",
  "Tool",
  "Enhanced",
  "V7"
];

const getAgentsByCategory = (category: string) => {
  return agentList.filter(agent => agent.category === category);
};

const getAgentByName = (name: string) => {
  return agentDefinitions[name];
};

const getAllAgents = () => {
  return agentList;
};

const getSystemStatus = () => {
  const totalAgents = agentList.length;
  const coreAgents = getAgentsByCategory("Core").length;
  const strategicAgents = getAgentsByCategory("Strategic").length;
  const coordinationAgents = getAgentsByCategory("Coordination").length;
  const toolAgents = getAgentsByCategory("Tool").length;
  const enhancedAgents = getAgentsByCategory("Enhanced").length;
  const v7Agents = getAgentsByCategory("V7").length;

  return {
    totalAgents,
    coreAgents,
    strategicAgents,
    coordinationAgents,
    toolAgents,
    enhancedAgents,
    v7Agents,
    version: 'V7'
  };
};

// Helper function to run an agent by name
const runAgent = async (agentName: string, context: AgentContext): Promise<AgentResponse> => {
  const agent = agentDefinitions[agentName];
  if (!agent) {
    throw new Error(`Agent ${agentName} not found in registry`);
  }
  return await agent.runner(context);
};

// Helper function to get a random agent
const getRandomAgent = () => {
  const agents = Object.keys(agentDefinitions);
  const randomKey = agents[Math.floor(Math.random() * agents.length)];
  return agentDefinitions[randomKey];
};

// Helper function to run a random agent
const runRandomAgent = async (context: AgentContext): Promise<AgentResponse> => {
  const randomAgent = getRandomAgent();
  return await randomAgent.runner(context);
};

// Export the registry object with all methods
export const agentRegistry = {
  ...agentDefinitions,
  getAllAgents,
  getAgentsByCategory,
  getAgentByName,
  getSystemStatus,
  runAgent,
  getRandomAgent,
  runRandomAgent
};

// Export types needed by other components
export type RegisteredAgent = {
  name: string;
  status: string;
  lastAction: string;
  category: string;
  description: string;
  version: string;
  runner: (context: AgentContext) => Promise<AgentResponse>;
};

// Export individual functions for backward compatibility
export { agentList, agentCategories, getAgentsByCategory, getAgentByName, getAllAgents, getSystemStatus, runAgent, getRandomAgent };
