
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { realBusinessExecutor } from '@/agents/RealBusinessExecutor';

export class ExecutionAgent {
  async runExecution(context: AgentContext): Promise<AgentResponse> {
    try {
      const { task, mode } = context.input || {};
      
      await sendChatUpdate('⚡ ExecutionAgent: Analyzing task for REAL business execution...');

      // Determine task type and parameters
      const taskType = this.determineTaskType(task);
      const parameters = this.extractTaskParameters(task, context.input);
      
      await sendChatUpdate(`🎯 ExecutionAgent: Executing ${taskType} with real integrations`);
      await sendChatUpdate(`📊 Parameters: ${JSON.stringify(parameters)}`);
      
      // Execute real business task
      const result = await realBusinessExecutor.executeBusinessTask(taskType, parameters);
      
      if (result.success) {
        await sendChatUpdate(`✅ ExecutionAgent: REAL business task completed successfully!`);
        await sendChatUpdate(`📊 Check CRM dashboard for live data and results`);
        
        return {
          success: true,
          message: result.message,
          data: {
            taskType,
            revenueGenerated: result.data?.actualRevenue || 0,
            leadsGenerated: result.data?.leadsGenerated || 0,
            emailsSent: result.data?.emailsSent || 0,
            executionSteps: result.data?.result?.steps_executed || [],
            nextActions: result.data?.result?.next_steps || []
          },
          timestamp: new Date().toISOString()
        };
      } else {
        await sendChatUpdate(`❌ ExecutionAgent: Task failed - ${result.message}`);
        return result;
      }

    } catch (error) {
      console.error('ExecutionAgent error:', error);
      await sendChatUpdate(`❌ ExecutionAgent: Critical error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: `❌ ExecutionAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private determineTaskType(task: string): string {
    const taskLower = task?.toLowerCase() || '';
    
    if (taskLower.includes('lead') || taskLower.includes('prospect') || taskLower.includes('generate') || taskLower.includes('find')) {
      return 'lead_generation';
    } else if (taskLower.includes('email') || taskLower.includes('outreach') || taskLower.includes('send') || taskLower.includes('contact')) {
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
    const taskLower = task?.toLowerCase() || '';
    
    // Extract lead count from task
    const leadCountMatch = task?.match(/(\d+)\s*(leads?|prospects?|contacts?)/i);
    if (leadCountMatch) {
      params.lead_count = parseInt(leadCountMatch[1]);
    }
    
    // Extract target market/industry
    if (taskLower.includes('medical tourism')) {
      params.target_market = 'medical tourism';
      params.service = 'medical tourism consultation';
      params.target_industry = 'medical tourism';
    } else if (taskLower.includes('agi') || taskLower.includes('consultancy') || taskLower.includes('ai')) {
      params.target_market = 'enterprise AI/AGI';
      params.service = 'AGI consultancy';
      params.target_industry = 'technology';
    } else if (taskLower.includes('healthcare')) {
      params.target_market = 'healthcare';
      params.service = 'healthcare services';
      params.target_industry = 'healthcare';
    }
    
    // Set default lead count if not specified
    if (!params.lead_count) {
      params.lead_count = 50; // Default to 50 leads
    }
    
    // Add campaign name for email outreach
    if (taskLower.includes('email') || taskLower.includes('outreach')) {
      params.campaign_name = `${params.target_market || 'Business'} Outreach Campaign`;
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
