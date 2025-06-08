
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
    return await agent.runner ? agent.runner(context) : agent(context);
  };
};

export const agentRegistry: { [key: string]: AgentDefinition } = {
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
    runner: StrategicAgent,
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
    runner: CriticAgent,
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
    runner: CollaborationAgent,
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
  }
};

export const agentList: AgentDefinition[] = Object.values(agentRegistry);

export const agentCategories = [
  "Core",
  "Coordination",
  "Strategic",
  "Tool",
  "Enhanced"
];

export const getAgentsByCategory = (category: string) => {
  return agentList.filter(agent => agent.category === category);
};

export const getAgentByName = (name: string) => {
  return agentRegistry[name];
};

export const getAllAgents = () => {
  return agentList;
};

export const getSystemStatus = () => {
  const totalAgents = agentList.length;
  const coreAgents = getAgentsByCategory("Core").length;
  const strategicAgents = getAgentsByCategory("Strategic").length;
  const coordinationAgents = getAgentsByCategory("Coordination").length;
  const toolAgents = getAgentsByCategory("Tool").length;
  const enhancedAgents = getAgentsByCategory("Enhanced").length;

  return {
    totalAgents,
    coreAgents,
    strategicAgents,
    coordinationAgents,
    toolAgents,
    enhancedAgents
  };
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
