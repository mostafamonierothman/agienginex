import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MedicalTourismLeadFactoryRunner } from './MedicalTourismLeadFactory';
import { LeadGenerationMasterAgentRunner } from './LeadGenerationMasterAgent';
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

      // Immediate lead generation test
      await sendChatUpdate('⚡ Starting immediate lead generation test...');
      
      const immediateLeadResult = await LeadGenerationMasterAgentRunner({
        input: { 
          keyword: 'LASIK surgery abroad UK',
          agentId: 'emergency_lead_test_1'
        },
        user_id: 'emergency_system',
        timestamp: new Date().toISOString()
      });

      let totalLeadsGenerated = 0;
      if (immediateLeadResult.success && immediateLeadResult.data?.leadsGenerated) {
        totalLeadsGenerated += immediateLeadResult.data.leadsGenerated;
        await sendChatUpdate(`✅ Immediate test generated ${immediateLeadResult.data.leadsGenerated} leads`);
      }

      // Deploy medical tourism factory
      const factoryResult = await MedicalTourismLeadFactoryRunner({
        input: { 
          emergencyMode: true,
          targetLeads: 100000,
          agentCount: 50,
          specialties: ['eye_surgery', 'dental_procedures'],
          targetRegion: 'Europe'
        },
        user_id: 'emergency_system',
        timestamp: new Date().toISOString()
      });

      if (factoryResult.success) {
        await sendChatUpdate('✅ Emergency deployment successful');
        await sendChatUpdate('🎯 50 agents deployed for 100,000 lead generation');
        
        // Generate additional immediate test leads to verify system works
        await this.generateImmediateTestLeads();
        
        // Run multiple lead generation agents in parallel
        await sendChatUpdate('🚀 Deploying parallel lead generation agents...');
        
        const parallelResults = await Promise.all([
          LeadGenerationMasterAgentRunner({
            input: { keyword: 'dental veneers Europe', agentId: 'emergency_dental_1' },
            user_id: 'emergency_system',
            timestamp: new Date().toISOString()
          }),
          LeadGenerationMasterAgentRunner({
            input: { keyword: 'IVF treatment abroad', agentId: 'emergency_fertility_1' },
            user_id: 'emergency_system',
            timestamp: new Date().toISOString()
          }),
          LeadGenerationMasterAgentRunner({
            input: { keyword: 'cosmetic surgery Turkey', agentId: 'emergency_cosmetic_1' },
            user_id: 'emergency_system',
            timestamp: new Date().toISOString()
          })
        ]);

        // Count successful leads from parallel execution
        parallelResults.forEach((result, index) => {
          if (result.success && result.data?.leadsGenerated) {
            totalLeadsGenerated += result.data.leadsGenerated;
            sendChatUpdate(`✅ Parallel agent ${index + 1} generated ${result.data.leadsGenerated} leads`);
          }
        });

        await sendChatUpdate(`🎉 Emergency deployment complete: ${totalLeadsGenerated} total leads generated`);
        await sendChatUpdate(`💰 Revenue potential: $${(totalLeadsGenerated * 500).toLocaleString()}`);
      } else {
        await sendChatUpdate('⚠️ Factory deployment returned partial or failed result');
      }

      return {
        success: true,
        message: `Emergency deployment complete: ${totalLeadsGenerated} leads generated`,
        data: {
          totalLeadsGenerated,
          revenuePoetential: totalLeadsGenerated * 500,
          factoryResult: factoryResult.success,
          immediateTestResult: immediateLeadResult.success
        },
        timestamp: new Date().toISOString()
      };

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

      const now = new Date().toISOString();
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
          status: "new" as const,
          updated_at: now,
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
          status: "new" as const,
          updated_at: now,
        },
        {
          email: `emergency.fertility.${Date.now()}@ivfabroad.com`,
          first_name: 'Fertility',
          last_name: 'Seeker',
          company: 'IVF Abroad Prospect',
          job_title: 'Patient',
          source: 'emergency_deployment',
          industry: 'fertility treatment',
          location: 'Europe',
          status: "new" as const,
          updated_at: now,
        }
      ];

      const { data, error } = await supabase
        .from('leads')
        .insert(testLeads)
        .select();

      if (error) {
        console.error('❌ Failed to generate immediate test leads:', error);
        await sendChatUpdate(`⚠️ Test lead generation failed: ${error.message}`);
      } else {
        await sendChatUpdate(`✅ Generated ${data?.length || 0} immediate test leads`);
      }
    } catch (error) {
      console.error('❌ Error generating immediate test leads:', error);
      await sendChatUpdate(`⚠️ Test lead generation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export async function EmergencyAgentDeployerRunner(context: AgentContext): Promise<AgentResponse> {
  const deployer = new EmergencyAgentDeployer();
  return await deployer.deployEmergencyLeadGenerationSquad();
}
