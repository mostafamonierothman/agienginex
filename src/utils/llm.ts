interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LLMService {
  private static instance: LLMService;
  private openaiKey: string = '';
  private anthropicKey: string = '';

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  constructor() {
    // Load API keys from environment variables with Vite fallback
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  }

  setOpenAIKey(key: string): void {
    this.openaiKey = key;
  }

  setAnthropicKey(key: string): void {
    this.anthropicKey = key;
  }

  async fetchLLMResponse(prompt: string, model: string = 'gpt-4o-mini'): Promise<LLMResponse> {
    console.log(`🧠 LLM Request: ${model} - ${prompt.substring(0, 100)}...`);

    if (model.startsWith('gpt-') || model.startsWith('o1-')) {
      return this.callOpenAI(prompt, model);
    } else if (model.startsWith('claude-')) {
      return this.callAnthropic(prompt, model);
    } else if (model.startsWith('ollama-')) {
      return this.callOllama(prompt, model.replace('ollama-', ''));
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }
  }

  private async callOpenAI(prompt: string, model: string): Promise<LLMResponse> {
    if (!this.openaiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        model,
        usage: data.usage
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  private async callAnthropic(prompt: string, model: string): Promise<LLMResponse> {
    if (!this.anthropicKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.content[0].text,
        model,
        usage: data.usage
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }

  private async callOllama(prompt: string, model: string): Promise<LLMResponse> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.response,
        model: `ollama-${model}`
      };
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  async autoSelectModel(prompt: string, complexity: 'simple' | 'medium' | 'complex' = 'medium'): Promise<LLMResponse> {
    const models = {
      simple: 'gpt-4o-mini',
      medium: 'gpt-4o-mini',
      complex: 'gpt-4o'
    };

    const selectedModel = models[complexity];
    console.log(`🎯 Auto-selected model: ${selectedModel} for ${complexity} task`);
    
    return this.fetchLLMResponse(prompt, selectedModel);
  }

  getAvailableModels(): string[] {
    return [
      'gpt-4o-mini',
      'gpt-4o',
      'claude-3-haiku-20240307',
      'claude-3-sonnet-20240229',
      'claude-3-opus-20240229',
      'ollama-llama2',
      'ollama-codellama',
      'ollama-mistral'
    ];
  }
}

export const llmService = LLMService.getInstance();

// Utility functions for backward compatibility
export async function fetchLLMResponse(prompt: string, model: string = 'gpt-4o-mini'): Promise<string> {
  const response = await llmService.fetchLLMResponse(prompt, model);
  return response.content;
}

export async function autoSelectLLM(prompt: string, complexity: 'simple' | 'medium' | 'complex' = 'medium'): Promise<string> {
  const response = await llmService.autoSelectModel(prompt, complexity);
  return response.content;
}
