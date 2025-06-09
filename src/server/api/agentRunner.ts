
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { ChatProcessorAgentRunner } from '../agents/ChatProcessorAgent';
import { LLMExecutiveAgentRunner } from '../agents/LLMExecutiveAgent';

// Registry of server-side agents
const serverAgentRegistry = {
  chat_processor_agent: ChatProcessorAgentRunner,
  llm_executive_agent: LLMExecutiveAgentRunner,
};

export async function runServerAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
  const agentRunner = serverAgentRegistry[agentName];
  
  if (!agentRunner) {
    return {
      success: false,
      message: `❌ Server agent '${agentName}' not found`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    return await agentRunner(context);
  } catch (error) {
    console.error(`[ServerAgentRunner] Error running ${agentName}:`, error);
    return {
      success: false,
      message: `❌ Server agent '${agentName}' error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
}
