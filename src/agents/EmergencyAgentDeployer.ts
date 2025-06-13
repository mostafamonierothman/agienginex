
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MedicalTourismLeadFactoryRunner } from './MedicalTourismLeadFactory';
import { AgentTaskQueue } from '@/engine/AgentTaskQueue';

export class EmergencyAgentDeployer {
  async deployEmergencyLeadGenerationSquad(): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🚨 EMERGENCY DEPLOYMENT INITIATED');
      await sendChatUpdate('📡 Activating Medical Tourism Lead Generation Factory...');

      await AgentTaskQueue.enqueue({
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
        
        // Trigger immediate lead generation
        await sendChatUpdate('⚡ Starting immediate lead generation...');
        
        // Generate some immediate test leads to verify system works
        await this.generateImmediateTestLeads();
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

  private async generateImmediateTestLeads() {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const testLeads = [
        {
          email: `emergency.lead.${Date.now()}@medicaltourism.com`,
          first_name: 'Emergency',
          last_name: 'Generated',
          company: 'Medical Tourism Test',
          job_title: 'Potential Patient',
          source: 'emergency_deployment',
          industry: 'eye surgery',
          location: 'Europe',
          status: 'new'
        },
        {
          email: `emergency.patient.${Date.now()}@healthtravel.com`,
          first_name: 'Test',
          last_name: 'Patient',
          company: 'Health Travel Prospect',
          job_title: 'Patient',
          source: 'emergency_deployment',
          industry: 'dental procedures',
          location: 'Europe',
          status: 'new'
        }
      ];

      const { data, error } = await supabase
        .from('leads')
        .insert(testLeads)
        .select();

      if (error) {
        console.error('❌ Failed to generate immediate test leads:', error);
      } else {
        await sendChatUpdate(`✅ Generated ${data?.length || 0} immediate test leads`);
      }
    } catch (error) {
      console.error('❌ Error generating immediate test leads:', error);
    }
  }
}

export async function EmergencyAgentDeployerRunner(context: AgentContext): Promise<AgentResponse> {
  const deployer = new EmergencyAgentDeployer();
  return await deployer.deployEmergencyLeadGenerationSquad();
}
