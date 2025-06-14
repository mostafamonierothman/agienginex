import { supabase } from '@/integrations/supabase/client';

export class PersistentMemory {
  private memoryCache: Map<string, any> = new Map();

  async set(key: string, value: any): Promise<void> {
    try {
      this.memoryCache.set(key, value);
      await supabase
        .from('agent_memory')
        .upsert([{ // Wrapped in array
          user_id: 'persistent_memory',
          agent_name: 'system_memory',
          memory_key: key,
          memory_value: typeof value === 'string' ? value : JSON.stringify(value)
        }], {
          onConflict: 'user_id,agent_name,memory_key' // This assumes a unique constraint exists on these columns
        });
      console.log(`🧠 Persistent memory set: ${key}`);
    } catch (error) {
      console.error('Failed to set persistent memory:', error);
    }
  }

  async get(key: string, defaultValue: any = null): Promise<any> {
    try {
      if (this.memoryCache.has(key)) {
        return this.memoryCache.get(key);
      }
      const { data, error } = await supabase
        .from('agent_memory')
        .select('memory_value')
        .eq('user_id', 'persistent_memory')
        .eq('agent_name', 'system_memory')
        .eq('memory_key', key)
        .order('timestamp', { ascending: false })
        .limit(1);
      if (error || !data || data.length === 0) {
        // If error, log it but still return defaultValue
        if (error) console.error('Failed to get persistent memory from DB:', error);
        return defaultValue;
      }
      const memValue = data[0].memory_value; // Renamed to avoid conflict
      try {
        // Ensure memValue is not null or undefined before parsing
        const parsed = memValue ? JSON.parse(memValue) : defaultValue;
        this.memoryCache.set(key, parsed);
        return parsed;
      } catch {
        this.memoryCache.set(key, memValue);
        return memValue;
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
      
      if (error) {
        console.error('Failed to get memory keys from DB:', error);
        return Array.from(this.memoryCache.keys()); // Fallback to cache keys
      }
      return data?.map(item => item.memory_key).filter(k => k !== null) as string[] || [];
    } catch (error) {
      console.error('Failed to get memory keys:', error);
      return Array.from(this.memoryCache.keys()); // Fallback to cache keys
    }
  }
}
