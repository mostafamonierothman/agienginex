
import { supabase } from '@/integrations/supabase/client';

export class SupabaseAGIStateService {
  static async saveState(key: string, state: any) {
    try {
      const { data, error } = await supabase
        .from('agi_state')
        .upsert({
          key: key,
          state: state,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Supabase AGI state save failed:', error.message);
        throw new Error(`Supabase AGI state save failed: ${error.message}`);
      }
      return data;
    } catch (error) {
      console.error('Supabase AGI state save failed:', error.message);
      throw new Error(`Supabase AGI state save failed: ${error.message}`);
    }
  }

  static async loadState(key: string) {
    try {
      const { data, error } = await supabase
        .from('agi_state')
        .select('state')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null
          return null;
        }
        console.error('Supabase AGI state load failed:', error.message);
        return null;
      }
      return data?.state || null;
    } catch (error) {
      console.error('Supabase AGI state load failed:', error.message);
      return null;
    }
  }

  static async deleteState(key: string) {
    try {
      const { error } = await supabase
        .from('agi_state')
        .delete()
        .eq('key', key);

      if (error) {
        console.error('Supabase AGI state delete failed:', error.message);
        throw new Error(`Supabase AGI state delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Supabase AGI state delete failed:', error.message);
      throw new Error(`Supabase AGI state delete failed: ${error.message}`);
    }
  }
}
