
import { agentChatBus } from '@/engine/AgentChatBus';
import { supabase } from '@/integrations/supabase/client';

export async function sendChatUpdate(message: string) {
  try {
    agentChatBus.postMessage({
      agent: 'system',
      message: message,
      timestamp: new Date().toISOString()
    });
    console.log(`[ChatUpdate] ${message}`);

    try {
      await supabase
        .from('api.agent_memory')
        .insert({
          user_id: 'system_updates',
          agent_name: 'system',
          memory_key: 'chat_update',
          memory_value: message.substring(0, 1000),
          timestamp: new Date().toISOString()
        });
    } catch (dbError) {
      console.log('[ChatUpdate] Database save failed (non-critical):', dbError);
    }
    
  } catch (error) {
    console.error('[ChatUpdate] Error:', error);
  }
}
