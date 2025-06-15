
import { supabase } from '@/integrations/supabase/client';

export class SupabaseVectorMemoryService {
  static async storeMemory(agentId: string, key: string, content: any, metadata: any = {}) {
    try {
      const { data, error } = await supabase
        .from('vector_memories')
        .insert({
          agent_id: agentId,
          memory_key: key,
          content: typeof content === 'string' ? content : JSON.stringify(content),
          metadata: metadata,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase vector memory insert error:', error.message);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Supabase vector memory insert error:', error.message);
      return null;
    }
  }

  static async retrieveMemories(agentId: string, query: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('vector_memories')
        .select('*')
        .eq('agent_id', agentId)
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase vector memory retrieval error:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Supabase vector memory retrieval error:', error);
      return [];
    }
  }

  static async migrateLocalStorageToSupabase(agentId: string): Promise<boolean> {
    try {
      const localKey = `vector_memory_${agentId}`;
      const localData = localStorage.getItem(localKey);
      
      if (!localData) return false;

      const memories = JSON.parse(localData);
      if (Array.isArray(memories) && memories.length > 0) {
        for (const memory of memories) {
          await this.storeMemory(agentId, memory.key || 'migrated', memory.content, memory.metadata || {});
        }
        localStorage.removeItem(localKey);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Migration error:', error);
      return false;
    }
  }
}
