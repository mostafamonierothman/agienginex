
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { agentRegistry } from '@/config/AgentRegistry';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

interface RunAgentRequest {
  agent_name: string;
  task: string;
  parameters?: any;
}

export async function handleRunAgent(request: RunAgentRequest): Promise<AgentResponse> {
  try {
    const { agent_name, task, parameters } = request;
    
    await sendChatUpdate(`🚀 API Request: Running ${agent_name} with task: "${task}"`);
    
    // Create agent context from the task
    const context: AgentContext = {
      input: {
        goal: task,
        task: task,
        parameters: parameters || {},
        timestamp: new Date().toISOString(),
        source: 'api_request'
      },
      user_id: 'api_user'
    };

    // Run the agent through the registry
    const result = await agentRegistry.runAgent(agent_name.toLowerCase().replace(/\s+/g, '_'), context);
    
    await sendChatUpdate(`✅ Agent ${agent_name} completed successfully`);
    
    return result;
    
  } catch (error) {
    console.error('Error running agent:', error);
    await sendChatUpdate(`❌ Error running ${request.agent_name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      success: false,
      message: `❌ Failed to run ${request.agent_name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Export for direct use
export const runAgentAPI = handleRunAgent;
