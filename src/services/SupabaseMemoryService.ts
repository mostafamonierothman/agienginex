// SupabaseMemoryService.ts
import { createClient } from '@supabase/supabase-js';

// 1. Attempt to use env variables first (Lovable browser-compatible)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hnudinfejowoxlybifqq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWluZmVqb3dveGx5YmlmcXEiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwNzE3OTc5OCwiZXhwIjoxNzM4NzE1Nzk4fQ.5sK0zt3_YUGBNBAcP8p8_aPja2z1MkmlQLtr5c6lvEs';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// 2. Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Export the memory service
export class SupabaseMemoryService {
  static async saveMemory(sessionId: string, content: any) {
    try {
      await supabase
        .from('memory')
        .insert([{ key: sessionId, data: content, timestamp: new Date() }]);
    } catch (e) {
      console.error('[SupabaseMemoryService] Save error:', e);
    }
  }

  static async loadMemory(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('memory')
        .select('*')
        .eq('key', sessionId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.data || null;
    } catch (e) {
      console.error('[SupabaseMemoryService] Load error:', e);
      return null;
    }
  }
}
