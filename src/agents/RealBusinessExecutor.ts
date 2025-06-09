
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';

interface BusinessTask {
  id: string;
  type: 'lead_generation' | 'email_outreach' | 'content_creation' | 'landing_page' | 'market_research';
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  revenue_potential: number;
  actual_revenue: number;
  created_at: string;
  completed_at?: string;
}

export class RealBusinessExecutor {
  private executionHistory: any[] = [];

  async executeBusinessTask(taskType: string, parameters: any): Promise<AgentResponse> {
    try {
      await sendChatUpdate(`⚡ Executing REAL business task: ${taskType}`);
      await sendChatUpdate(`🔗 Connecting to Hunter API for lead generation...`);
      await sendChatUpdate(`📧 Connecting to Resend for email delivery...`);

      // Call the real business executor edge function
      const { data, error } = await supabase.functions.invoke('real-business-executor', {
        body: { taskType, parameters }
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.message || 'Unknown error from edge function');
      }

      const result = data.data;

      // Create execution entry
      const execution = {
        type: taskType,
        description: result.description,
        status: 'completed',
        revenue_potential: result.revenue_potential || 0,
        actual_revenue: result.actual_revenue || 0,
        timestamp: new Date().toISOString(),
        result: result
      };

      // Log to execution history (in-memory backup)
      this.executionHistory.unshift(execution);
      if (this.executionHistory.length > 50) {
        this.executionHistory = this.executionHistory.slice(0, 50);
      }

      // Try to log to database
      try {
        await this.logBusinessExecution(execution);
      } catch (dbError) {
        console.warn('Database logging failed, using in-memory storage:', dbError);
      }

      // Show real metrics
      if (result.leads_generated > 0) {
        await sendChatUpdate(`✅ REAL LEADS GENERATED: ${result.leads_generated} contacts added to CRM`);
      }
      if (result.emails_sent > 0) {
        await sendChatUpdate(`📧 REAL EMAILS SENT: ${result.emails_sent} outreach emails delivered`);
      }

      return {
        success: true,
        message: `✅ Real business task completed: ${result.description}`,
        data: {
          taskType,
          result,
          actualRevenue: result.actual_revenue || 0,
          leadsGenerated: result.leads_generated || 0,
          emailsSent: result.emails_sent || 0,
          nextSteps: result.next_steps || []
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Real business execution error:', error);
      await sendChatUpdate(`❌ Real business execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Log failed execution
      const failedExecution = {
        type: taskType,
        description: `Failed ${taskType} execution`,
        status: 'failed',
        revenue_potential: 0,
        actual_revenue: 0,
        timestamp: new Date().toISOString(),
        result: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
      
      this.executionHistory.unshift(failedExecution);
      
      return {
        success: false,
        message: `❌ Real business execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async logBusinessExecution(execution: any) {
    try {
      // Use supervisor_queue table as it's working
      await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'real_business_executor',
          agent_name: 'RealBusinessExecutor',
          action: 'business_execution',
          input: JSON.stringify({
            type: execution.type,
            description: execution.description
          }),
          status: execution.status,
          output: JSON.stringify(execution)
        });
    } catch (error) {
      console.error('Failed to log business execution to database:', error);
      throw error;
    }
  }

  async getExecutionHistory(): Promise<any[]> {
    try {
      // First try to get from database
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('*')
        .eq('agent_name', 'RealBusinessExecutor')
        .eq('action', 'business_execution')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Database fetch failed, using in-memory history:', error);
        return this.executionHistory;
      }
      
      // Convert database format to execution format
      const dbExecutions = data?.map(item => {
        try {
          return JSON.parse(item.output || '{}');
        } catch {
          return {
            type: 'unknown',
            description: item.input || 'Unknown task',
            status: item.status || 'unknown',
            revenue_potential: 0,
            actual_revenue: 0,
            timestamp: item.timestamp || new Date().toISOString(),
            result: {}
          };
        }
      }) || [];

      // Merge with in-memory history and deduplicate
      const allExecutions = [...this.executionHistory, ...dbExecutions];
      const uniqueExecutions = allExecutions.filter((exec, index, arr) => 
        arr.findIndex(e => e.timestamp === exec.timestamp) === index
      );

      return uniqueExecutions.slice(0, 10);
    } catch (error) {
      console.error('Failed to get execution history:', error);
      return this.executionHistory;
    }
  }

  // New method to get leads from CRM
  async getGeneratedLeads(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get leads:', error);
      return [];
    }
  }

  // New method to get email campaign results
  async getEmailCampaigns(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select(`
          *,
          email_logs (
            id,
            email,
            status,
            sent_at,
            opened_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get email campaigns:', error);
      return [];
    }
  }
}

export const realBusinessExecutor = new RealBusinessExecutor();
