
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SystemContextAgent } from '@/agents/SystemContextAgent';
import { callLLMAPI } from '@/integrations/llm/callLLMAPI';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class SelfImprovementAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      console.log('[SelfImprovementAgent] Analyzing chat history for gaps...');

      // Load context
      const contextAgent = new SystemContextAgent();
      const contextResponse = await contextAgent.runner({ input: {} });

      // Build LLM prompt
      const prompt = `
# AGIengineX Self-Improvement Process
# Current chat and system history:
${contextResponse.data?.contextSummary || 'No context available'}

# TASK:
1. Identify any missing components or features.
2. Suggest concrete improvements.
3. If applicable, propose agent actions to implement improvements.

# RESPONSE:
`;

      const llmResponse = await callLLMAPI(prompt);

      // Save to chat history
      await saveChatMessage('SelfImprovementAgent', llmResponse);

      return {
        success: true,
        message: `🔧 SelfImprovementAgent: ${llmResponse}`,
        data: { improvements: llmResponse },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ SelfImprovementAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function SelfImprovementAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new SelfImprovementAgent();
  return await agent.runner(context);
}
