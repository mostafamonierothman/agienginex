
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { serverAgentService } from '@/services/ServerAgentService';

// Client-side agent registry for UI-only agents
const clientAgentDefinitions = {
  // Add any pure UI agents here if needed in the future
};

export const clientAgentRegistry = {
  ...clientAgentDefinitions,
  
  // Run server-side agents through the service
  async runAgent(agentName: string, context: AgentContext): Promise<AgentResponse> {
    // Check if it's a server-side agent
    const serverAgents = ['chat_processor_agent', 'llm_executive_agent'];
    
    if (serverAgents.includes(agentName)) {
      return await serverAgentService.runAgent(agentName, context);
    }
    
    // Check for client-side agents
    if (clientAgentDefinitions[agentName]) {
      return await clientAgentDefinitions[agentName].runner(context);
    }
    
    return {
      success: false,
      message: `❌ Agent '${agentName}' not found in client or server registry`,
      timestamp: new Date().toISOString()
    };
  }
};
