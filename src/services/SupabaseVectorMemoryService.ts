
import { supabase } from '@/integrations/supabase/client';

export class SupabaseVectorMemoryService {
  static async storeMemory(agentId: string, content: string, source: string, importance: number = 0.5, metadata: any = {}) {
    try {
      const { data, error } = await supabase
        .from('vector_memories')
        .insert({
          agent_id: agentId,
          content: content,
          source: source,
          importance: importance,
          embedding: metadata // Store metadata as embedding for now
        });

      if (error) {
        console.error('Supabase vector memory insert error:', error.message);
        throw new Error(`Supabase vector memory insert error: ${error.message}`);
      }
      return data;
    } catch (error: any) {
      console.error('Supabase vector memory insert error:', error.message);
      throw new Error(`Supabase vector memory insert error: ${error.message}`);
    }
  }

  static async retrieveMemories(agentId: string, query: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('vector_memories')
        .select('*')
        .eq('agent_id', agentId)
        .ilike('content', `%${query}%`)
        .order('importance', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase vector memory retrieval error:', error);
        return [];
      }
      return data || [];
    } catch (error: any) {
      console.error('Supabase vector memory retrieval error:', error.message);
      return [];
    }
  }

  static async getMemoryStats(agentId: string) {
    try {
      const { data, error } = await supabase
        .from('vector_memories')
        .select('id')
        .eq('agent_id', agentId);

      if (error) return { total: 0, recent: 0 };
      
      return {
        total: data?.length || 0,
        recent: data?.length || 0
      };
    } catch (error) {
      return { total: 0, recent: 0 };
    }
  }
}
