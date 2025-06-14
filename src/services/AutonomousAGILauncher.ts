
import { lovableAGIAgent, LovableAGIAgentRunner } from '@/agents/LovableAGIAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

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
      console.log('🤖 LovableAGIAgent already launched');
      return;
    }

    try {
      console.log('🚀 Auto-launching LovableAGIAgent for 24/7 operation...');
      
      // Launch the autonomous agent
      const result = await LovableAGIAgentRunner({
        input: { mode: 'autonomous_24_7' },
        user_id: 'auto_launcher_system'
      });

      if (result.success) {
        this.launched = true;
        await sendChatUpdate('🎯 LovableAGIAgent: 24/7 autonomous operation launched successfully - Working on AGI enhancement without permission requirements');
        console.log('✅ LovableAGIAgent launched successfully');
      } else {
        console.error('❌ Failed to launch LovableAGIAgent:', result.message);
      }

    } catch (error) {
      console.error('🔥 LovableAGIAgent launch error:', error);
      
      // Retry after delay
      setTimeout(() => {
        console.log('🔄 Retrying LovableAGIAgent launch...');
        this.launched = false;
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
