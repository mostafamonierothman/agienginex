import { supabase } from '@/integrations/supabase/client';

export interface LogEntry {
  id?: string;
  timestamp: string;
  agent_name: string;
  action: string;
  result: string;
  level: 'info' | 'warning' | 'error' | 'success';
}

export class AgentLogger {
  private logs: LogEntry[] = [];

  async log(agent_name: string, action: string, result: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): Promise<void> {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      agent_name,
      action,
      result,
      level
    };

    console.log(`[${level.toUpperCase()}] ${agent_name}: ${action} → ${result}`);
    this.logs.push(entry);

    // Store in Supabase
    try {
      await supabase
        .from('supervisor_queue')
        .insert([{ // Wrapped in array
          user_id: 'system_logger',
          agent_name,
          action,
          input: JSON.stringify({ action }),
          status: level === 'error' ? 'error' : 'completed',
          output: result
        }]);
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  getLogs(limit: number = 100): LogEntry[] {
    return this.logs.slice(-limit);
  }

  async getStoredLogs(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('*')
        .eq('user_id', 'system_logger')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to retrieve stored logs:', error);
      return [];
    }
  }
}

// Export singleton instance
export const agentLogger = new AgentLogger();
