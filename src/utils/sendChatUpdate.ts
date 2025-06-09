
import { agentChatBus } from '@/engine/AgentChatBus';
import { saveChatMessage } from '@/utils/saveChatMessage';

export async function sendChatUpdate(message: string) {
  try {
    await saveChatMessage('system', message);
    
    // Emit event for real-time updates
    agentChatBus.postMessage({
      agent: 'system',
      message: message,
      timestamp: new Date().toISOString()
    });
    
    console.log(`[ChatUpdate] ${message}`);
  } catch (error) {
    console.error('[ChatUpdate] Error:', error);
  }
}
