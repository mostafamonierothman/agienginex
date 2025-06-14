
import { agentRegistry } from '@/config/AgentRegistry';
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { smartChatService } from '@/services/SmartChatService';

export async function routeChatMessage(message: string): Promise<AgentResponse> {
  console.log('🚀 AGI V5 Chat Router - Processing message:', message);

  try {
    // Check for revenue-related commands
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('revenue') || lowerMessage.includes('money') || lowerMessage.includes('income')) {
      console.log('💰 Revenue command detected - activating revenue system');
      
      const context: AgentContext = {
        input: { 
          goal: 'activate_revenue_generation',
          command: message,
          mode: 'revenue_optimization'
        },
        user_id: 'revenue_chat_user',
        timestamp: new Date().toISOString()
      };

      return await agentRegistry.activateRevenueGeneration(context);
    }

    if (lowerMessage.includes('lead') || lowerMessage.includes('generate leads')) {
      console.log('🎯 Lead generation command detected');
      
      const context: AgentContext = {
        input: { 
          goal: 'generate_leads',
          command: message,
          mode: 'lead_generation_swarm'
        },
        user_id: 'lead_chat_user',
        timestamp: new Date().toISOString()
      };

      return await agentRegistry.deployLeadGenerationSwarm(context);
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('deploy')) {
      console.log('🚨 Emergency deployment command detected');
      
      const context: AgentContext = {
        input: { 
          goal: 'emergency_deployment',
          command: message,
          mode: 'emergency_response'
        },
        user_id: 'emergency_chat_user',
        timestamp: new Date().toISOString()
      };

      return await agentRegistry.runAgent('emergency_agent_deployer', context);
    }

    if (lowerMessage.includes('test leads') || lowerMessage.includes('test database')) {
      console.log('🧪 Test command detected');
      
      const context: AgentContext = {
        input: { 
          keyword: 'LASIK surgery abroad UK test',
          agentId: 'chat_test_agent'
        },
        user_id: 'test_chat_user',
        timestamp: new Date().toISOString()
      };

      return await agentRegistry.runAgent('lead_generation_master_agent', context);
    }

    if (lowerMessage.includes('ago') || lowerMessage.includes('core loop')) {
      console.log('🧠 AGO Core Loop command detected');
      
      const context: AgentContext = {
        input: { 
          goal: message,
          mode: 'ago_core_loop'
        },
        user_id: 'ago_chat_user',
        timestamp: new Date().toISOString()
      };

      return await agentRegistry.runAgent('ago_core_loop_agent', context);
    }

    // Use SmartChatService for intelligent processing
    const smartResponse = await smartChatService.processMessage(message);
    
    if (smartResponse.success) {
      return {
        success: true,
        message: smartResponse.message,
        content: smartResponse.message,
        role: 'assistant',
        data: {
          agent_used: smartResponse.agent_used,
          actions: smartResponse.actions,
          executedActions: smartResponse.executedActions
        },
        timestamp: new Date().toISOString()
      };
    }

    // Fallback to enhanced executive agent
    const context: AgentContext = {
      input: { 
        goal: message,
        sessionId: 'chat_' + Date.now()
      },
      user_id: 'chat_user',
      timestamp: new Date().toISOString()
    };

    const result = await agentRegistry.runAgent('enhanced_executive_agent', context);
    
    return {
      success: result.success,
      message: result.message,
      content: result.message,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('AGI V5 Chat routing error:', error);
    return {
      success: false,
      message: `🤖 AGI V5 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      content: `🤖 AGI V5 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      role: 'system',
      timestamp: new Date().toISOString()
    };
  }
}
