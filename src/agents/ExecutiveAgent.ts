
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SystemContextAgent } from '@/agents/SystemContextAgent';
import { callLLMAPI } from '@/integrations/llm/callLLMAPI';
import { agentChatBus } from '@/engine/AgentChatBus';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class ExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const goal = context.input?.goal || 'System optimization and planning';

      const contextAgent = new SystemContextAgent();
      const contextResponse = await contextAgent.runner({ input: {} });

      const prompt = `
# AGIengineX Executive Planning
# System and chat context:
${contextResponse.data?.contextSummary || 'No context available'}

# Goal: ${goal}
# PLAN: What agents should be run? In what order? Why?

# RESPONSE:
`;

      const llmResponse = await callLLMAPI(prompt);

      agentChatBus.postMessage({
        agent: 'ExecutiveAgent',
        message: llmResponse,
        timestamp: new Date().toISOString()
      });

      await saveChatMessage('ExecutiveAgent', llmResponse);

      return {
        success: true,
        message: `🎯 ExecutiveAgent: ${llmResponse}`,
        data: { plan: llmResponse, goal },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ ExecutiveAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function ExecutiveAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ExecutiveAgent();
  return await agent.runner(context);
}
