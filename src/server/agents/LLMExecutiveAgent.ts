
import OpenAI from 'openai';
import { AgentContext, AgentResponse } from '../../types/AgentTypes';
import { saveChatMessage } from '../../utils/saveChatMessage';

export class LLMExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const input = context.input || {};

      console.log('[LLMExecutiveAgent] Processing strategic decision with GPT-4...');

      // Get API key from localStorage or environment
      const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        return {
          success: false,
          message: '❌ OpenAI API key not configured. Please set your API key in the chat settings.',
          timestamp: new Date().toISOString()
        };
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `You are the ExecutiveAgent of AGIengineX, an advanced multi-agent system. Your job is to provide strategic guidance for real business execution.

Context: ${JSON.stringify(input)}
User Request: ${input.message || 'Provide strategic guidance'}

As an AI executive assistant, analyze this request and provide actionable strategic advice for real business execution. Focus on practical steps that can generate actual results and revenue.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert AGI ExecutiveAgent providing strategic guidance for real business execution.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const decision = response.choices[0]?.message?.content || 'No response generated.';

      await saveChatMessage('LLMExecutiveAgent', decision);

      return {
        success: true,
        message: decision,
        data: {
          decision,
          model: 'gpt-4o-mini',
          input
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('[LLMExecutiveAgent] Error:', error);
      return {
        success: false,
        message: `❌ LLMExecutiveAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function LLMExecutiveAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LLMExecutiveAgent();
  return await agent.runner(context);
}
