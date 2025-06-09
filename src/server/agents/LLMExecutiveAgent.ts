
import { Configuration, OpenAIApi } from 'openai';
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { saveChatMessage } from '../../utils/saveChatMessage';

export class LLMExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const input = context.input || {};

      console.log('[LLMExecutiveAgent] Processing strategic decision with GPT-4o...');

      // ✅ Safe fallback — will work with GitHub OPENAI_API_KEY or VITE_OPENAI_API_KEY
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
      });

      if (!configuration.apiKey) {
        throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY or VITE_OPENAI_API_KEY.');
      }

      const openai = new OpenAIApi(configuration);

      const prompt = `You are the ExecutiveAgent of AGIengineX, an advanced multi-agent system. Your job is to make strategic decisions and provide executive-level guidance.

Context: ${JSON.stringify(input)}
System Status: Multi-agent AGI system with 22+ agents active
Goal: Determine the next strategic action for optimal system performance

Provide a clear, actionable strategic decision:`;

      const response = await openai.createChatCompletion({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert AGI ExecutiveAgent providing strategic guidance.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 400
      });

      const decision = response.data.choices[0]?.message?.content || 'No decision returned.';

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
