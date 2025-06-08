
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { llmService } from '@/utils/llm';

export async function LLMAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    const prompt = context.input?.prompt || 'Analyze the current state and provide strategic insights';
    const model = context.input?.model || 'gpt-4o-mini';
    const complexity = context.input?.complexity || 'medium';

    console.log(`🧠 LLMAgent processing with ${model}...`);

    let response;
    if (context.input?.auto_select) {
      response = await llmService.autoSelectModel(prompt, complexity);
    } else {
      response = await llmService.fetchLLMResponse(prompt, model);
    }

    console.log(`✅ LLMAgent (${response.model}) completed: ${response.content.substring(0, 100)}...`);

    return {
      success: true,
      message: `🧠 LLM(${response.model}): ${response.content}`,
      data: {
        content: response.content,
        model: response.model,
        usage: response.usage
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('LLMAgent error:', error);
    return {
      success: false,
      message: `❌ LLMAgent failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
}
