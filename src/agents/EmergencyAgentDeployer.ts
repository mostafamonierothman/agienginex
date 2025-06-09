
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MedicalTourismLeadFactoryRunner } from './MedicalTourismLeadFactory';
import { agentTaskQueue } from '@/services/AgentTaskQueue';

export class EmergencyAgentDeployer {
  async deployEmergencyLeadGenerationSquad(): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🚨 EMERGENCY DEPLOYMENT INITIATED');
      await sendChatUpdate('📡 Activating Medical Tourism Lead Generation Factory...');
      
      // Add emergency tasks to queue
      await agentTaskQueue.addEmergencyErrorFixingTasks([
        { type: 'lead_generation', message: 'Deploy emergency lead generation agents' }
      ]);

      // Deploy the medical tourism factory
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
        await sendChatUpdate('👁️ Eye surgery specialists: 25 agents (LASEK, LASIK, Femto-LASEK)');
        await sendChatUpdate('🦷 Dental procedure specialists: 25 agents (veneers, major dental work)');
        await sendChatUpdate('🌍 Target region: Europe');
        await sendChatUpdate('📊 Agents will disappear after mission completion, knowledge preserved');
      }

      return factoryResult;

    } catch (error) {
      await sendChatUpdate(`❌ Emergency deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: `❌ Emergency deployment error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function EmergencyAgentDeployerRunner(context: AgentContext): Promise<AgentResponse> {
  const deployer = new EmergencyAgentDeployer();
  return await deployer.deployEmergencyLeadGenerationSquad();
}
