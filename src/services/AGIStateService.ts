
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAGIStateService {
  static async saveState(key: string, state: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('agi_state')
        .upsert({
          key: key,
          state: state,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase AGI state save error:', error.message);
        // Don't throw - just log the error
        return;
      }
    } catch (error: any) {
      console.error('Supabase AGI state save error:', error.message);
      // Don't throw - just log the error
      return;
    }
  }

  static async loadState(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('agi_state')
        .select('state')
        .eq('key', key)
        .single();

      if (error) {
        console.error('Supabase AGI state load error:', error);
        return null;
      }
      
      return data?.state || null;
    } catch (error: any) {
      console.error('Supabase AGI state load error:', error.message);
      return null;
    }
  }
}
