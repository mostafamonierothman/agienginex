
import { agentChatBus } from '@/engine/AgentChatBus';
import { supabase } from '@/integrations/supabase/client';

export async function sendChatUpdate(message: string) {
  try {
    // Emit event for real-time updates
    agentChatBus.postMessage({
      agent: 'system',
      message: message,
      timestamp: new Date().toISOString()
    });
    
    // Log to console for monitoring
    console.log(`[ChatUpdate] ${message}`);
    
    // Try to save to Supabase (but don't fail if it doesn't work)
    try {
      await supabase
        .from('agent_memory')
        .insert({
          user_id: 'system_updates',
          agent_name: 'system',
          memory_key: 'chat_update',
          memory_value: message.substring(0, 1000), // Limit message length
          timestamp: new Date().toISOString()
        });
    } catch (dbError) {
      // Silently fail for database issues - console log is sufficient
      console.log('[ChatUpdate] Database save failed (non-critical):', dbError);
    }
    
  } catch (error) {
    console.error('[ChatUpdate] Error:', error);
  }
}
