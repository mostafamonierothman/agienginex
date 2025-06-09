
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SystemContextAgent } from '@/agents/SystemContextAgent';
import { ExecutiveAgent } from '@/agents/ExecutiveAgent';
import { SelfImprovementAgent } from '@/agents/SelfImprovementAgent';
import { callLLMAPI } from '@/integrations/llm/callLLMAPI';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class ChatProcessorAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const userMessage = context.input?.message || '';
      
      console.log('[ChatProcessorAgent] Processing user message:', userMessage);

      // Save user message to chat history
      await saveChatMessage('User', userMessage);

      // Get system context
      const contextAgent = new SystemContextAgent();
      const contextResponse = await contextAgent.runner({ input: {} });

      // Determine which agent should handle this request
      const routingPrompt = `
# AGIengineX Chat Router
# User message: "${userMessage}"
# System context: ${contextResponse.data?.contextSummary || 'No context'}

# Task: Determine which agent should handle this request:
# Options: ExecutiveAgent, SelfImprovementAgent, SystemContextAgent, ResearchAgent, StrategicAgent
# If it's a general question, use SystemContextAgent
# If it's about improvements, use SelfImprovementAgent  
# If it's about planning, use ExecutiveAgent
# Return only the agent name.

# Response:
`;

      const selectedAgent = await callLLMAPI(routingPrompt);
      const agentName = selectedAgent.trim();

      console.log('[ChatProcessorAgent] Routing to:', agentName);

      // Route to appropriate agent
      let agentResponse: AgentResponse;
      
      if (agentName.includes('Executive')) {
        const executiveAgent = new ExecutiveAgent();
        agentResponse = await executiveAgent.runner({
          ...context,
          input: { goal: userMessage }
        });
      } else if (agentName.includes('SelfImprovement')) {
        const improvementAgent = new SelfImprovementAgent();
        agentResponse = await improvementAgent.runner(context);
      } else {
        // Default to system context for general queries
        agentResponse = await contextAgent.runner(context);
      }

      // Generate a natural response based on agent output
      const responsePrompt = `
# AGIengineX Chat Response Generator
# User asked: "${userMessage}"
# Agent (${agentName}) responded: ${agentResponse.message}
# System data: ${JSON.stringify(agentResponse.data || {})}

# Task: Generate a natural, helpful response to the user that incorporates the agent's findings.
# Be conversational and informative.

# Response:
`;

      const naturalResponse = await callLLMAPI(responsePrompt);

      // Save the response
      await saveChatMessage('AGI V5', naturalResponse);

      return {
        success: true,
        message: naturalResponse,
        data: { 
          routedTo: agentName,
          originalResponse: agentResponse.message,
          userMessage
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[ChatProcessorAgent] Error:', error);
      return {
        success: false,
        message: `❌ ChatProcessorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function ChatProcessorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ChatProcessorAgent();
  return await agent.runner(context);
}
