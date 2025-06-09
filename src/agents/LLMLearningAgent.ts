import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { llmService } from '@/utils/llm';
import { saveChatMessage } from '@/utils/saveChatMessage';

export class LLMLearningAgent {
  private history: any[] = [];

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const input = context.input || {};
      
      console.log('[LLMLearningAgent] Analyzing performance with GPT-4o...');

      // Store agent results if provided
      if (input?.agentResults) {
        this.history.push({
          timestamp: new Date().toISOString(),
          results: input.agentResults
        });
      }

      // Keep only last 10 entries for analysis
      this.history = this.history.slice(-10);

      const prompt = `You are the LearningAgent of AGIengineX, responsible for analyzing system performance and suggesting improvements.

Recent Performance History:
${JSON.stringify(this.history, null, 2)}

Current Input:
${JSON.stringify(input)}

Tasks:
1. Analyze the recent performance data
2. Identify patterns and trends
3. Suggest specific improvements for system optimization
4. Recommend next steps for enhanced performance

Provide detailed analysis and actionable recommendations:`;

      const analysis = await llmService.fetchLLMResponse(prompt, 'gpt-4o');

      await saveChatMessage('LLMLearningAgent', analysis);

      return {
        success: true,
        message: `🧠 LLMLearningAgent Analysis: ${analysis}`,
        data: {
          analysis,
          historyCount: this.history.length,
          model: 'gpt-4o',
          input
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[LLMLearningAgent] Error:', error);
      return {
        success: false,
        message: `❌ LLMLearningAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

export async function LLMLearningAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LLMLearningAgent();
  return await agent.runner(context);
}
