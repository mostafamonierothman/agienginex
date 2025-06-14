
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

export class DatabaseRecoveryService {
  static async checkAndRepairDatabase(): Promise<boolean> {
    try {
      await sendChatUpdate('🔍 DatabaseRecoveryService: Checking database connectivity...');
      
      // Test basic connectivity
      const { error: connectError } = await supabase
        .from('supervisor_queue')
        .select('count')
        .limit(1);

      if (connectError) {
        await sendChatUpdate(`⚠️ Database connectivity issue: ${connectError.message}`);
        return false;
      }

      // Check if agi_state table is accessible
      const { error: agiStateError } = await supabase
        .from('agi_state')
        .select('count')
        .limit(1);

      if (agiStateError) {
        await sendChatUpdate(`⚠️ AGI state table issue: ${agiStateError.message}`);
        // Fallback to using supervisor_queue for AGI state if needed
        return false;
      }

      await sendChatUpdate('✅ Database connectivity verified');
      return true;
    } catch (error) {
      await sendChatUpdate(`❌ Database recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  static async initializeFallbackStorage(): Promise<void> {
    try {
      // Use supervisor_queue as fallback for AGI state storage
      await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'database_recovery_service',
          agent_name: 'database_recovery',
          action: 'initialize_fallback',
          input: JSON.stringify({ timestamp: new Date().toISOString() }),
          status: 'completed',
          output: 'Fallback storage initialized for AGI system'
        });

      await sendChatUpdate('🔧 Initialized fallback storage mechanism');
    } catch (error) {
      console.error('Failed to initialize fallback storage:', error);
    }
  }
}
