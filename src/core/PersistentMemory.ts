
import { supabase } from '@/integrations/supabase/client';

export class PersistentMemory {
  private memoryCache: Map<string, any> = new Map();

  async set(key: string, value: any): Promise<void> {
    try {
      // Update cache
      this.memoryCache.set(key, value);

      // Store in Supabase
      await supabase
        .from('agent_memory')
        .upsert({
          user_id: 'persistent_memory',
          agent_name: 'system_memory',
          memory_key: key,
          memory_value: typeof value === 'string' ? value : JSON.stringify(value)
        }, {
          onConflict: 'user_id,agent_name,memory_key'
        });

      console.log(`🧠 Persistent memory set: ${key}`);
    } catch (error) {
      console.error('Failed to set persistent memory:', error);
    }
  }

  async get(key: string, defaultValue: any = null): Promise<any> {
    try {
      // Check cache first
      if (this.memoryCache.has(key)) {
        return this.memoryCache.get(key);
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('agent_memory')
        .select('memory_value')
        .eq('user_id', 'persistent_memory')
        .eq('agent_name', 'system_memory')
        .eq('memory_key', key)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        return defaultValue;
      }

      const value = data[0].memory_value;
      // Try to parse JSON, fallback to string
      try {
        const parsed = JSON.parse(value);
        this.memoryCache.set(key, parsed);
        return parsed;
      } catch {
        this.memoryCache.set(key, value);
        return value;
      }
    } catch (error) {
      console.error('Failed to get persistent memory:', error);
      return defaultValue;
    }
  }

  async clear(): Promise<void> {
    try {
      this.memoryCache.clear();
      
      await supabase
        .from('agent_memory')
        .delete()
        .eq('user_id', 'persistent_memory')
        .eq('agent_name', 'system_memory');

      console.log('🧠 Persistent memory cleared');
    } catch (error) {
      console.error('Failed to clear persistent memory:', error);
    }
  }

  async keys(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('agent_memory')
        .select('memory_key')
        .eq('user_id', 'persistent_memory')
        .eq('agent_name', 'system_memory');

      if (error) throw error;
      return data?.map(item => item.memory_key) || [];
    } catch (error) {
      console.error('Failed to get memory keys:', error);
      return [];
    }
  }
}
