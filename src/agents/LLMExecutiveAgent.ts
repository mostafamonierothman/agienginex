
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { llmService } from '@/utils/llm';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class LLMExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const input = context.input || {};
      
      console.log('[LLMExecutiveAgent] Processing strategic decision with GPT-4o...');

      const prompt = `You are the ExecutiveAgent of AGIengineX, an advanced multi-agent system. Your job is to make strategic decisions and provide executive-level guidance.

Context: ${JSON.stringify(input)}
System Status: Multi-agent AGI system with 22+ agents active
Goal: Determine the next strategic action for optimal system performance

Provide a clear, actionable strategic decision:`;

      const decision = await llmService.fetchLLMResponse(prompt, 'gpt-4o');

      await saveChatMessage('LLMExecutiveAgent', decision);

      return {
        success: true,
        message: `🎯 LLMExecutiveAgent Strategic Decision: ${decision}`,
        data: {
          decision,
          model: 'gpt-4o',
          input
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[LLMExecutiveAgent] Error:', error);
      return {
        success: false,
        message: `❌ LLMExecutiveAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function LLMExecutiveAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LLMExecutiveAgent();
  return await agent.runner(context);
}
