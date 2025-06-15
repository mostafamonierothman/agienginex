
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

export class LeadDatabaseService {
  async saveLeadsToDatabase(leads: any[], agentId: string): Promise<any[]> {
    try {
      console.log(`💾 ${agentId}: Attempting to save ${leads.length} leads to database...`);
      const batchSize = 5;
      const savedLeads = [];
      // Ensure status is restricted to allowed enum
      const patchLeads = leads.map(lead => ({
        ...lead,
        status: "new" as
          | "new"
          | "contacted"
          | "replied"
          | "qualified"
          | "converted"
          | "unsubscribed",
        updated_at: new Date().toISOString(),
      }));
      for (let i = 0; i < patchLeads.length; i += batchSize) {
        const batch = patchLeads.slice(i, i + batchSize);
        const { data, error } = await supabase
          // FIX: Use 'leads' not 'api.leads'
          .from('leads')
          .insert(batch)
          .select();
        if (error) {
          console.error(`❌ ${agentId}: Batch insert failed:`, error);
          await sendChatUpdate(`⚠️ ${agentId}: Batch ${Math.floor(i/batchSize) + 1} failed - ${error.message}`);
          continue;
        }
        if (data) {
          savedLeads.push(...data);
          console.log(`✅ ${agentId}: Batch ${Math.floor(i/batchSize) + 1} saved ${data.length} leads`);
        }
      }
      return savedLeads;
    } catch (error) {
      console.error(`❌ ${agentId}: Database error saving leads:`, error);
      await sendChatUpdate(`❌ ${agentId}: Database error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }
}
