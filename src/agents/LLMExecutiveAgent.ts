
import OpenAI from 'openai';
import { AgentContext, AgentResponse } from '@/types/AgentTypes';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class LLMExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    const input = context?.input?.goal || 'No goal specified';
    const sessionId = context?.input?.sessionId || 'default';

    const prompt = `You are the strategic thinking core of an AGI system. Use the following user input and memory to respond intelligently.\n\n${input}`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful, strategic assistant.' },
          { role: 'user', content: prompt }
        ]
      });

      const content = completion.choices[0]?.message?.content || 'No response generated.';

      return { 
        success: true,
        message: content,
        role: 'executive', 
        content,
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      console.error('[LLMExecutiveAgent] OpenAI error:', e);
      return { 
        success: false,
        message: 'Error generating response from LLM.',
        role: 'executive', 
        content: 'Error generating response from LLM.',
        timestamp: new Date().toISOString()
      };
    }
  }
}
