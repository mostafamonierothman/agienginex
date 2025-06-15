
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';

// Import the real lead generation agent
import { LeadGenerationMasterAgentRunner } from './LeadGenerationMasterAgent';

export class SupervisorAgent {
  private errorHistory: Array<{
    timestamp: string;
    error: string;
    agent: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  // A real, simple runner function
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🕹️ SupervisorAgent: Activating functional workflow...');

      // 1. Create a simple agent task (lead generation)
      await sendChatUpdate('🚀 SupervisorAgent: Triggering real LeadGenerationMasterAgent...');

      // Run the agent
      const agentResult = await LeadGenerationMasterAgentRunner({
        input: {
          keyword: 'medical tourism lead (supervisor demo)',
          agentId: `supervised_demo_${Date.now()}`
        },
        user_id: context.user_id || 'supervisor_functional_test'
      });

      // Log the action in supervisor_queue
      const { data: supervisedQueue, error: supervisorQueueError } = await supabase
        .from('supervisor_queue')
        .insert([{
          user_id: context.user_id || 'supervisor_functional_test',
          agent_name: 'LeadGenerationMasterAgent',
          action: 'lead_generated',
          input: 'medical tourism lead (supervisor demo)',
          status: agentResult.success ? 'completed' : 'failed',
          output: JSON.stringify(agentResult)
        }]);

      if (supervisorQueueError) {
        await sendChatUpdate(`❌ Failed logging supervisor action: ${supervisorQueueError.message}`);
      }

      // 2. Report functional system status using live DB
      // Count total leads in database
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id');

      // Count actions in supervisor_queue
      const { data: queueItems, error: queueError } = await supabase
        .from('supervisor_queue')
        .select('id');

      const totalLeads = leads?.length ?? 0;
      const totalSupervisorActions = queueItems?.length ?? 0;

      let statusMessage: string;

      if (agentResult.success) {
        statusMessage = `Functional supervisor completed a real agent task successfully! [Leads in DB: ${totalLeads}, Supervisor actions: ${totalSupervisorActions}]`;
      } else {
        statusMessage = `Supervisor attempted a real agent task but failed: ${agentResult.message}`;
      }

      await sendChatUpdate(`✅ ${statusMessage}`);

      return {
        success: agentResult.success,
        message: statusMessage,
        data: {
          leads_generated: agentResult.data?.leadsGenerated || 0,
          total_leads_db: totalLeads,
          total_supervisor_actions: totalSupervisorActions,
          last_agent_run: agentResult
        },
        timestamp: new Date().toISOString(),
        nextAgent: null
      };
    } catch (error) {
      await sendChatUpdate(`❌ SupervisorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: `❌ SupervisorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Not strictly needed with the new plan, but kept for type compatibility
  getErrorHistory() {
    return this.errorHistory;
  }
}

// The single runner: this will run the functional supervisor
export async function SupervisorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new SupervisorAgent();
  return await agent.runner(context);
}
