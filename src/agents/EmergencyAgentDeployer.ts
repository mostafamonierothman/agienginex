import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MedicalTourismLeadFactoryRunner } from './MedicalTourismLeadFactory';
import { agentTaskQueue } from '@/engine/AgentTaskQueue';

export class EmergencyAgentDeployer {
  async deployEmergencyLeadGenerationSquad(): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🚨 EMERGENCY DEPLOYMENT INITIATED');
      await sendChatUpdate('📡 Activating Medical Tourism Lead Generation Factory...');

      await agentTaskQueue.enqueue({
        type: 'emergency_deployment',
        timestamp: new Date().toISOString(),
        message: 'Triggered by EmergencyAgentDeployer'
      });

      const factoryResult = await MedicalTourismLeadFactoryRunner({
        input: { 
          emergencyMode: true,
          targetLeads: 100000,
          agentCount: 50,
          specialties: ['eye_surgery', 'dental_procedures'],
          targetRegion: 'Europe'
        }
      });

      if (factoryResult.success) {
        await sendChatUpdate('✅ Emergency deployment successful');
        await sendChatUpdate('🎯 50 agents deployed for 100,000 lead generation');
      } else {
        await sendChatUpdate('⚠️ Factory deployment returned partial or failed result');
      }

      return factoryResult;

    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      await sendChatUpdate(`❌ Emergency deployment failed: ${msg}`);
      return {
        success: false,
        message: `❌ Emergency deployment error: ${msg}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function EmergencyAgentDeployerRunner(context: AgentContext): Promise<AgentResponse> {
  const deployer = new EmergencyAgentDeployer();
  return await deployer.deployEmergencyLeadGenerationSquad();
}
