import { supabase } from '@/integrations/supabase/client';

export class SupabaseMemoryService {
  static async saveMemory(sessionId: string, content: any) {
    try {
      await supabase
        .from('api.agent_memory')
        .insert([{ 
          user_id: sessionId, 
          agent_name: 'memory_service',
          memory_key: sessionId, 
          memory_value: JSON.stringify(content), 
          timestamp: new Date().toISOString() 
        }]);
    } catch (e) {
      console.error('[SupabaseMemoryService] Save error:', e);
    }
  }

  static async loadMemory(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('api.agent_memory')
        .select('*')
        .eq('memory_key', sessionId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      const memoryValue = data?.[0]?.memory_value;
      if (memoryValue) {
        try {
          return JSON.parse(memoryValue);
        } catch (parseError) {
          console.error('[SupabaseMemoryService] JSON parse error:', parseError);
          return memoryValue; // Return as string if not valid JSON
        }
      }
      
      return null;
    } catch (e) {
      console.error('[SupabaseMemoryService] Load error:', e);
      return null;
    }
  }

  static async saveExecutionLog(agentName: string, action: string, result: any) {
    try {
      await supabase
        .from('api.agent_memory')
        .insert([{
          user_id: 'system',
          agent_name: agentName,
          memory_key: `execution_log_${action}`,
          memory_value: JSON.stringify(result),
          timestamp: new Date().toISOString()
        }]);
    } catch (e) {
      console.error('[SupabaseMemoryService] Execution log error:', e);
    }
  }
}
