
import { supabase } from '@/integrations/supabase/client';

export class SupabaseMemoryService {
  static async saveMemory(sessionId: string, content: any) {
    try {
      const { error } = await supabase
        .from('agent_memory')
        .insert({
          user_id: sessionId,
          agent_name: content.agent || 'system',
          memory_key: sessionId,
          memory_value: JSON.stringify(content),
          timestamp: new Date().toISOString()
        });
      
      if (error) {
        console.error('[SupabaseMemoryService] Save error:', error);
      }
    } catch (e) {
      console.error('[SupabaseMemoryService] Save error:', e);
    }
  }

  static async loadMemory(sessionId: string) {
    try {
      const { data, error } = await supabase
        .from('agent_memory')
        .select('*')
        .eq('memory_key', sessionId)
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('[SupabaseMemoryService] Load error:', error);
        return null;
      }
      
      return data?.map(item => {
        try {
          return JSON.parse(item.memory_value);
        } catch {
          return { content: item.memory_value };
        }
      }) || null;
    } catch (e) {
      console.error('[SupabaseMemoryService] Load error:', e);
      return null;
    }
  }

  static async saveExecutionLog(agentName: string, action: string, result: any) {
    try {
      const { error } = await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'dashboard_user',
          agent_name: agentName,
          action: action,
          input: JSON.stringify(result.input || {}),
          status: result.success ? 'completed' : 'failed',
          output: result.message || JSON.stringify(result),
          timestamp: new Date().toISOString()
        });
      
      if (error) {
        console.error('[SupabaseMemoryService] Execution log error:', error);
      }
    } catch (e) {
      console.error('[SupabaseMemoryService] Execution log error:', e);
    }
  }
}
