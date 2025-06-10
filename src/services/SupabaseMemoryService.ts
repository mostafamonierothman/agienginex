import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseMemoryService {
  static async saveMemory(sessionId: string, content: any) {
    try {
      await supabase.from('memory').insert([{ key: sessionId, data: content, timestamp: new Date() }]);
    } catch (e) {
      console.error('[SupabaseMemoryService] Save error:', e);
    }
  }

  static async loadMemory(sessionId: string) {
    try {
      const { data } = await supabase.from('memory')
        .select('*')
        .eq('key', sessionId)
        .order('timestamp', { ascending: false })
        .limit(1);
      return data?.[0]?.data || null;
    } catch (e) {
      console.error('[SupabaseMemoryService] Load error:', e);
      return null;
    }
  }
}
