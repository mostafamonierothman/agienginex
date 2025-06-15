
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';

export class ConversionTrackerAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('📈 ConversionTrackerAgent: Analyzing lead conversions...');

      // Get all leads (type guard in next step)
      const { data: leadsRaw } = await supabase
        .from('api.leads' as any)
        .select('*');

      // Guard: leadsRaw may contain error objects; only process objects with string 'email'
      const leads = Array.isArray(leadsRaw) ? leadsRaw.filter(
        (lead): lead is { email: string } => 
          !!lead && typeof lead === 'object' && typeof (lead as any).email === 'string'
      ) : [];

      // Extract emails from leads
      const leadEmails = leads.map(lead => lead.email);

      // Get all email logs
      const { data: emailLogsRaw } = await supabase
        .from('api.email_log' as any)
        .select('*');

      const emailLogs = Array.isArray(emailLogsRaw) ? emailLogsRaw.filter(
        (log): log is { email: string } => 
          !!log && typeof log === 'object' && typeof (log as any).email === 'string'
      ) : [];

      // Filter email logs for those sent to leads
      const convertedEmails = emailLogs.filter(log => leadEmails.includes(log.email));

      // Calculate conversion metrics
      const totalLeads = leads.length;
      const convertedLeads = convertedEmails.length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      await sendChatUpdate(`📊 Conversion Rate: ${conversionRate.toFixed(2)}%`);

      return {
        success: true,
        message: `📈 ConversionTrackerAgent: Conversion rate is ${conversionRate.toFixed(2)}%`,
        data: {
          totalLeads,
          convertedLeads,
          conversionRate,
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ ConversionTrackerAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function ConversionTrackerAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ConversionTrackerAgent();
  return await agent.runner(context);
}
