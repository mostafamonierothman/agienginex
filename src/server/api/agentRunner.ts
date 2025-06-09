
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { ChatProcessorAgentRunner } from '../agents/ChatProcessorAgent';
import { LLMExecutiveAgentRunner } from '../agents/LLMExecutiveAgent';
import { MemoryAgentRunner } from '../agents/MemoryAgent';

// Registry of server-side agents with proper typing
const serverAgentRegistry: Record<string, (context: AgentContext) => Promise<AgentResponse>> = {
  chat_processor_agent: ChatProcessorAgentRunner,
  llm_executive_agent: LLMExecutiveAgentRunner,
  memory_agent: MemoryAgentRunner,
};

export async function runServerAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
  console.log(`[ServerAgentRunner] Running agent: ${agentName}`);
  
  const agentRunner = serverAgentRegistry[agentName];
  
  if (!agentRunner) {
    console.error(`[ServerAgentRunner] Agent '${agentName}' not found in registry`);
    return {
      success: false,
      message: `❌ Server agent '${agentName}' not found`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    const result = await agentRunner(context);
    console.log(`[ServerAgentRunner] Agent ${agentName} completed successfully`);
    return result;
  } catch (error) {
    console.error(`[ServerAgentRunner] Error running ${agentName}:`, error);
    return {
      success: false,
      message: `❌ Server agent '${agentName}' error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
}
