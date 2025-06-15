
import { supabase } from '@/integrations/supabase/client';

export class EnhancedExecutiveAgentData {
  static async getLeadsCount() {
    try {
      const { count } = await supabase.from('api.leads' as any).select('*', { count: 'exact', head: true });
      return count || 0;
    } catch {
      return 0;
    }
  }

  static async getCampaignsCount() {
    try {
      const { count } = await supabase.from('api.email_campaigns' as any).select('*', { count: 'exact', head: true });
      return count || 0;
    } catch {
      return 0;
    }
  }

  static async getTotalRevenue() {
    try {
      const { data } = await supabase
        .from('api.supervisor_queue' as any)
        .select('output')
        .eq('agent_name', 'RealBusinessExecutor');
      let totalRevenue = 0;
      if (Array.isArray(data)) {
        (data as any[])
          .filter(
            (item) =>
              item &&
              typeof item === "object" &&
              "output" in item &&
              typeof (item as any).output === "string"
          )
          .forEach((item) => {
            const outputStr = (item as any).output ?? '';
            if (outputStr) {
              let output;
              try {
                output = JSON.parse(outputStr);
              } catch {
                return; // skip invalid JSON
              }
              if (
                output &&
                typeof output === 'object' &&
                'actual_revenue' in output &&
                output.actual_revenue != null
              ) {
                totalRevenue += output.actual_revenue || 0;
              }
            }
          });
      }
      return totalRevenue;
    } catch {
      return 0;
    }
  }

  static async gatherCurrentData() {
    try {
      const { data: leads } = await supabase.from('api.leads' as any).select('*').limit(5);
      const { data: campaigns } = await supabase.from('api.email_campaigns' as any).select('*').limit(3);
      const { data: executions } = await supabase.from('api.supervisor_queue' as any)
        .select('*')
        .eq('agent_name', 'RealBusinessExecutor')
        .limit(5);

      return {
        totalLeads: leads?.length || 0,
        activeCampaigns: campaigns?.length || 0,
        recentExecutions: executions?.length || 0,
        lastExecution: executions && executions[0] && 'timestamp' in executions[0] ? (executions[0] as any).timestamp : null
      };
    } catch (error) {
      console.error('Error gathering current data:', error);
      return { totalLeads: 0, activeCampaigns: 0, recentExecutions: 0, lastExecution: null };
    }
  }
}
