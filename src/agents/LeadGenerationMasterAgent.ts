import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { LeadDataEnricher } from './LeadDataEnricher';
import { LeadDatabaseService } from './LeadDatabaseService';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';
import type { LeadStatus } from '@/types/DatabaseTypes';

export class LeadGenerationMasterAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const keyword = context.input?.keyword || 'medical tourism';
      const agentId = context.input?.agentId || 'master_agent';
      await sendChatUpdate(`🚀 ${agentId}: Starting lead generation for "${keyword}"...`);

      const enricher = new LeadDataEnricher();
      const databaseService = new LeadDatabaseService();

      // Simulate search results - replace with actual search logic
      const searchResults = Array.from({ length: 10 }, (_, i) => ({
        title: `Result ${i + 1}`,
        link: `https://example.com/result${i + 1}`
      }));

      const enrichedLeads = enricher.enrichSearchResults(searchResults, keyword);
      const leadsToInsert = enrichedLeads.map(lead => ({
        ...lead,
        status: "new" as const, // match DB type
        updated_at: new Date().toISOString(),
      }));

      const savedLeads = await databaseService.saveLeadsToDatabase(leadsToInsert, agentId);

      const leadCount = savedLeads.length;
      await sendChatUpdate(`✅ ${agentId}: Generated and saved ${leadCount} leads for "${keyword}"`);

      // Log to supervisor queue
      await supabase
        .from('supervisor_queue')
        .insert({
          user_id: context.user_id || 'lead_agent',
          agent_name: agentId,
          action: 'generate_leads',
          input: JSON.stringify({ keyword }),
          status: 'completed',
          output: `Generated ${leadCount} leads for "${keyword}"`
        });

      return {
        success: true,
        message: `🎯 ${agentId}: Lead generation complete: ${leadCount} leads generated`,
        data: { leadsGenerated: leadCount },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ LeadGenerationMasterAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function LeadGenerationMasterAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new LeadGenerationMasterAgent();
  return await agent.runner(context);
}
