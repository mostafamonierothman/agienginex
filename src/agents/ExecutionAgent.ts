
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { realBusinessExecutor } from '@/agents/RealBusinessExecutor';

export class ExecutionAgent {
  async runExecution(context: AgentContext): Promise<AgentResponse> {
    try {
      const { task, mode } = context.input || {};
      
      await sendChatUpdate('⚡ ExecutionAgent: Analyzing task for real business execution...');

      // Determine task type and parameters
      const taskType = this.determineTaskType(task);
      const parameters = this.extractTaskParameters(task, context.input);
      
      // Execute real business task
      const result = await realBusinessExecutor.executeBusinessTask(taskType, parameters);
      
      if (result.success) {
        await sendChatUpdate(`✅ Real business execution completed: ${result.message}`);
        
        return {
          success: true,
          message: result.message,
          data: {
            taskType,
            revenueGenerated: result.data?.actualRevenue || 0,
            leadsGenerated: result.data?.leadsGenerated || 0,
            executionSteps: result.data?.result?.steps_executed || [],
            nextActions: result.data?.result?.next_steps || []
          },
          timestamp: new Date().toISOString()
        };
      } else {
        return result;
      }

    } catch (error) {
      console.error('ExecutionAgent error:', error);
      return {
        success: false,
        message: `❌ ExecutionAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private determineTaskType(task: string): string {
    const taskLower = task?.toLowerCase() || '';
    
    if (taskLower.includes('lead') || taskLower.includes('prospect')) {
      return 'lead_generation';
    } else if (taskLower.includes('email') || taskLower.includes('outreach')) {
      return 'email_outreach';
    } else if (taskLower.includes('landing') || taskLower.includes('page') || taskLower.includes('website')) {
      return 'landing_page';
    } else if (taskLower.includes('research') || taskLower.includes('market') || taskLower.includes('analyze')) {
      return 'market_research';
    } else {
      return 'lead_generation'; // Default to lead generation
    }
  }

  private extractTaskParameters(task: string, input: any): any {
    const params: any = {};
    
    // Extract common parameters from task description
    if (task?.includes('medical tourism')) {
      params.target_market = 'medical tourism';
      params.service = 'medical tourism consultation';
    } else if (task?.includes('AGI') || task?.includes('consultancy')) {
      params.target_market = 'enterprise AI/AGI';
      params.service = 'AGI consultancy';
    }
    
    // Add any additional parameters from input
    if (input?.budget) params.budget = input.budget;
    if (input?.target_audience) params.target_audience = input.target_audience;
    if (input?.topic) params.topic = input.topic;
    
    return params;
  }
}

export async function ExecutionAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ExecutionAgent();
  return await agent.runExecution(context);
}
