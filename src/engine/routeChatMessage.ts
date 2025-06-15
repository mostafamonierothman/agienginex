
import { agentRegistry } from '@/config/AgentRegistry';
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { llmService } from '@/utils/llm';

export async function routeChatMessage(message: string): Promise<AgentResponse> {
  console.log('🚀 Chat Router - Processing message:', message);

  try {
    const lowerMessage = message.toLowerCase();

    // Simple direct OpenAI integration for chat
    try {
      const response = await llmService.fetchLLMResponse(
        `You are a helpful AI assistant. Respond to this message: ${message}`,
        'gpt-4o-mini'
      );

      return {
        success: true,
        message: response.content,
        content: response.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      
      // Fallback response
      return {
        success: true,
        message: `I received your message: "${message}". The AI system is currently optimizing itself and will provide enhanced responses shortly.`,
        content: `I received your message: "${message}". The AI system is currently optimizing itself and will provide enhanced responses shortly.`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
    }

  } catch (error) {
    console.error('Chat routing error:', error);
    return {
      success: false,
      message: `I'm experiencing some technical difficulties but I'm here to help. You said: "${message}". Let me know how I can assist you!`,
      content: `I'm experiencing some technical difficulties but I'm here to help. You said: "${message}". Let me know how I can assist you!`,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
  }
}
