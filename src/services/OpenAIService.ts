
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string = '';
  private isEnabled: boolean = false;

  setApiKey(key: string): void {
    this.apiKey = key;
    this.isEnabled = !!key;
    if (key) {
      localStorage.setItem('openai_core_api_key', key);
    }
  }

  loadApiKey(): void {
    const savedKey = localStorage.getItem('openai_core_api_key');
    if (savedKey) {
      this.apiKey = savedKey;
      this.isEnabled = true;
    }
  }

  isAvailable(): boolean {
    return this.isEnabled && !!this.apiKey;
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  async generateAgentDecision(agentName: string, task: string, context: string = ''): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API not available');
    }

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: `You are ${agentName}, an autonomous AGI agent in the Engine X multi-agent system. You specialize in strategic thinking and decision making. Provide concise, actionable responses that drive business value.`
      },
      {
        role: 'user',
        content: `Task: ${task}\n\nContext: ${context}\n\nProvide a strategic decision or action for this task:`
      }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 200,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }

  async generateOpportunity(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API not available');
    }

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an AI opportunity detector. Identify high-value business opportunities in healthcare AI, focusing on premium markets and enterprise solutions.'
      },
      {
        role: 'user',
        content: 'Identify a specific, actionable business opportunity in the healthcare AI space that could generate significant revenue.'
      }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 150,
          temperature: 0.8
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI opportunity generation failed:', error);
      throw error;
    }
  }

  async enhanceV4Agent(agentType: string, input: string, context: any = {}): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API not available');
    }

    const agentPrompts = {
      strategic: 'You are a Strategic AI Agent. Analyze the current state and provide specific, actionable strategic recommendations for business growth and system optimization.',
      opportunity: 'You are an Opportunity Detection AI Agent. Identify high-value business opportunities with clear revenue potential and market viability.',
      learning: 'You are a Learning AI Agent. Analyze patterns, performance data, and system behavior to generate insights for continuous improvement.',
      coordination: 'You are a Coordination AI Agent. Optimize multi-agent collaboration, workflow efficiency, and synchronized goal achievement.',
      memory: 'You are a Memory Management AI Agent. Focus on semantic memory optimization, pattern recognition, and knowledge organization.',
      critic: 'You are a Performance Critic AI Agent. Evaluate system performance, agent effectiveness, and provide constructive improvement recommendations.'
    };

    const systemPrompt = agentPrompts[agentType as keyof typeof agentPrompts] || agentPrompts.strategic;

    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Input: ${input}\n\nContext: ${JSON.stringify(context)}\n\nProvide a specific, actionable response:`
      }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI V4 agent enhancement failed:', error);
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();
