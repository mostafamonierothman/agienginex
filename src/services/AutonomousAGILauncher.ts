
import { lovableAGIAgent, LovableAGIAgentRunner } from '@/agents/LovableAGIAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { OrchestratorAgentRunner } from '@/agents/OrchestratorAgent';

export class AutonomousAGILauncher {
  private static instance: AutonomousAGILauncher;
  private launched = false;

  static getInstance(): AutonomousAGILauncher {
    if (!AutonomousAGILauncher.instance) {
      AutonomousAGILauncher.instance = new AutonomousAGILauncher();
    }
    return AutonomousAGILauncher.instance;
  }

  async autoLaunch(): Promise<void> {
    if (this.launched) {
      console.log('🤖 System already launched');
      return;
    }

    try {
      console.log('🚀 Auto-launching full autonomous system...');
      
      // --- 1. Run Full System Orchestration ---
      await sendChatUpdate('🚀 Initiating full system deployment at maximum capacity...');
      const orchestratorResponse = await OrchestratorAgentRunner({
          input: 'Execute full system initialization plan.',
          user_id: 'auto_launcher_system'
      });

      if (!orchestratorResponse.success) {
          await sendChatUpdate(`⚠️ Orchestration issue: ${orchestratorResponse.message}. Continuing with agent launch...`);
          console.warn('⚠️ Orchestration issue:', orchestratorResponse.message);
      } else {
          await sendChatUpdate(`✅ System orchestration complete: ${orchestratorResponse.message}`);
          console.log('✅ Orchestration complete.');
      }

      // --- 2. Launch LovableAGIAgent for continuous operation ---
      const result = await LovableAGIAgentRunner({
        input: { mode: 'autonomous_24_7' },
        user_id: 'auto_launcher_system'
      });

      if (result.success) {
        this.launched = true; // Mark as launched ONLY if everything succeeds
        await sendChatUpdate('🎯 LovableAGIAgent: 24/7 autonomous operation launched successfully - Working on AGI enhancement without permission requirements');
        console.log('✅ Full autonomous system is online.');
      } else {
        console.error('❌ Failed to launch LovableAGIAgent:', result.message);
        throw new Error(`LovableAGIAgent launch failed: ${result.message}`); // throw to trigger catch and retry
      }

    } catch (error) {
      console.error('🔥 Full system auto-launch error:', error);
      
      // Retry the entire launch sequence after a delay
      setTimeout(() => {
        console.log('🔄 Retrying full system launch...');
        this.launched = false; // Reset for retry
        this.autoLaunch();
      }, 30000); // Retry in 30 seconds
    }
  }

  getStatus() {
    return {
      launched: this.launched,
      agentStatus: lovableAGIAgent.getStatus()
    };
  }
}

// Auto-launch when module loads
const launcher = AutonomousAGILauncher.getInstance();

// Launch immediately
launcher.autoLaunch();

// Export for external access
export const autonomousLauncher = launcher;
