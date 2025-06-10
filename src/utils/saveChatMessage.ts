
import { supabase } from '@/integrations/supabase/client';

export async function saveChatMessage(sessionId: string, role: string, message: string): Promise<void>;
export async function saveChatMessage(agentName: string, message: string): Promise<void>;
export async function saveChatMessage(param1: string, param2: string, param3?: string): Promise<void> {
  try {
    let agentName: string;
    let message: string;
    let sessionId: string | undefined;

    if (param3 !== undefined) {
      // 3 parameter version: sessionId, role, message
      sessionId = param1;
      agentName = param2;
      message = param3;
    } else {
      // 2 parameter version: agentName, message
      agentName = param1;
      message = param2;
    }

    console.log(`[SaveChatMessage] Saving message from ${agentName}:`, message.substring(0, 100));
    
    // Try to save to Supabase
    const { error } = await supabase
      .from('agent_memory')
      .insert({
        user_id: sessionId || 'chat_system',
        agent_name: agentName,
        memory_key: 'chat_message',
        memory_value: message,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('[SaveChatMessage] Supabase error:', error);
      
      // Fallback to localStorage if Supabase fails
      const fallbackKey = `chat_memory_${Date.now()}`;
      const fallbackData = {
        agent_name: agentName,
        memory_value: message,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(fallbackKey, JSON.stringify(fallbackData));
      console.log(`[SaveChatMessage] Saved to localStorage as fallback: ${fallbackKey}`);
    } else {
      console.log(`[SaveChatMessage] Successfully saved to Supabase: ${agentName}`);
    }
  } catch (error) {
    console.error('[SaveChatMessage] Critical error:', error);
    
    // Emergency fallback - always store locally
    try {
      const emergencyKey = `emergency_chat_${Date.now()}`;
      const emergencyData = {
        agent_name: param2,
        memory_value: param3 || param2,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      localStorage.setItem(emergencyKey, JSON.stringify(emergencyData));
      console.log(`[SaveChatMessage] Emergency fallback successful: ${emergencyKey}`);
    } catch (fallbackError) {
      console.error('[SaveChatMessage] Even fallback failed:', fallbackError);
    }
  }
}
