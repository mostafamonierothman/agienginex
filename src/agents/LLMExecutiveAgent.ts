
import OpenAI from 'openai';
import { AgentContext, AgentResponse } from '@/types/AgentTypes';

export class LLMExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    const input = context?.input?.goal || 'No goal specified';
    const sessionId = context?.input?.sessionId || 'default';

    // Get API key from localStorage or environment variables
    const apiKey = localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        message: '❌ OpenAI API key not configured. Please set your API key in the chat settings.',
        timestamp: new Date().toISOString()
      };
    }

    const prompt = `You are the strategic thinking core of an AGI system. Use the following user input and memory to respond intelligently.\n\n${input}`;

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
