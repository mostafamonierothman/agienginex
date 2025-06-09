
import { supabase } from '@/integrations/supabase/client';

export async function saveChatMessage(agent: string, message: string): Promise<void> {
  try {
    await supabase
      .from('agent_memory')
      .insert({
        user_id: 'system',
        agent_name: agent,
        memory_key: 'chat_message',
        memory_value: message,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    console.error('Failed to save chat message:', error);
  }
}
