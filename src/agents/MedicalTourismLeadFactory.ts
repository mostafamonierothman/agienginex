
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';
import { LeadGenerationMasterAgentRunner } from './LeadGenerationMasterAgent';

export class MedicalTourismLeadFactory {
  private deployedAgents: Map<string, any> = new Map();
  
  async deployEmergencyAgents(): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🚨 EMERGENCY: Deploying 50 real lead generation agents...');

      // Create specialized keywords for different agents
      const eyeSurgeryKeywords = [
        'LASIK surgery abroad UK', 'LASEK surgery Europe', 'eye surgery consultation UK',
        'laser eye surgery abroad cost', 'vision correction Europe clinic',
        'PRK surgery abroad reviews', 'SMILE eye surgery Europe',
        'refractive surgery abroad UK', 'eye surgery medical tourism',
        'laser vision correction consultation UK'
      ];

      const dentalKeywords = [
        'dental veneers abroad UK', 'dental implants Europe cost',
        'smile makeover abroad reviews', 'cosmetic dentistry Europe',
        'porcelain veneers abroad UK', 'dental tourism Europe clinic',
        'teeth whitening abroad cost', 'dental crowns Europe reviews',
        'orthodontics abroad UK', 'full mouth reconstruction Europe'
      ];

      const allKeywords = [...eyeSurgeryKeywords, ...dentalKeywords];
      const agentPromises = [];

      // Deploy 50 real agents with different keywords
      for (let i = 0; i < 50; i++) {
        const keyword = allKeywords[i % allKeywords.length];
        const agentId = `RealLeadAgent_${i + 1}_${Date.now()}`;
        const specialty = i < 25 ? 'eye_surgery' : 'dental_procedures';

        // Store agent info
        this.deployedAgents.set(agentId, {
          id: agentId,
          name: agentId,
          specialty,
          keyword,
          status: 'active',
          deployment_time: new Date().toISOString()
        });

        // Deploy real agent with delay to avoid overwhelming the system
        const agentPromise = this.deployRealAgent(agentId, keyword, specialty, i * 100);
        agentPromises.push(agentPromise);
      }

      // Wait for all agents to deploy
      await Promise.all(agentPromises);

      await sendChatUpdate(`✅ ${agentPromises.length} real lead generation agents deployed and working`);

      return {
        success: true,
        message: `🚨 Emergency deployment complete: ${agentPromises.length} real agents deployed`,
        data: {
          totalAgents: agentPromises.length,
          eyeSurgeryAgents: 25,
          dentalAgents: 25,
          deployment_time: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Emergency deployment error:', error);
      return {
        success: false,
        message: `❌ Factory deployment error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async deployRealAgent(agentId: string, keyword: string, specialty: string, delay: number): Promise<void> {
    try {
      // Add delay to stagger agent deployment
      await new Promise(resolve => setTimeout(resolve, delay));

      // Log agent deployment
      await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'demo_user',
          agent_name: agentId,
          action: 'agent_deployed',
          input: JSON.stringify({ keyword, specialty }),
          status: 'active',
          output: `Real lead generation agent deployed for "${keyword}"`
        });

      // Run the actual lead generation agent
      const result = await LeadGenerationMasterAgentRunner({
        input: { keyword, agentId },
        user_id: 'demo_user',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        // Update agent status to completed
        await supabase
          .from('supervisor_queue')
          .insert({
            user_id: 'demo_user',
            agent_name: agentId,
            action: 'lead_generation_complete',
            input: JSON.stringify({ 
              keyword, 
              leadsGenerated: result.data?.leadsGenerated || 0 
            }),
            status: 'completed',
            output: `Generated ${result.data?.leadsGenerated || 0} real leads`
          });

        console.log(`✅ Agent ${agentId} completed: ${result.data?.leadsGenerated || 0} leads generated`);
      } else {
        console.error(`❌ Agent ${agentId} failed:`, result.message);
      }

    } catch (error) {
      console.error(`Failed to deploy agent ${agentId}:`, error);
    }
  }

  async getDeploymentStatus(): Promise<any> {
    try {
      // Get agent deployment status from database
      const { data: deployments } = await supabase
        .from('supervisor_queue')
        .select('*')
        .eq('action', 'agent_deployed')
        .eq('user_id', 'demo_user');

      // Get completed agents
      const { data: completions } = await supabase
        .from('supervisor_queue')
        .select('*')
        .eq('action', 'lead_generation_complete')
        .eq('user_id', 'demo_user');

      // Get total leads generated
      const { data: leads } = await supabase
        .from('leads')
        .select('id, industry')
        .eq('source', 'lead_generation_agent');

      const totalAgents = deployments?.length || 0;
      const completedAgents = completions?.length || 0;
      const totalLeads = leads?.length || 0;
      const eyeSurgeryLeads = leads?.filter(l => l.industry === 'eye surgery').length || 0;
      const dentalLeads = leads?.filter(l => l.industry === 'dental procedures').length || 0;

      return {
        totalAgents,
        completedAgents,
        totalLeadsGenerated: totalLeads,
        eyeSurgeryLeads,
        dentalLeads,
        targetLeads: 100000,
        progress: Math.min((totalLeads / 100000) * 100, 100),
        deploymentComplete: completedAgents >= totalAgents && totalAgents > 0
      };
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      return {
        totalAgents: 0,
        completedAgents: 0,
        totalLeadsGenerated: 0,
        eyeSurgeryLeads: 0,
        dentalLeads: 0,
        targetLeads: 100000,
        progress: 0,
        deploymentComplete: false
      };
    }
  }
}

export async function MedicalTourismLeadFactoryRunner(context: AgentContext): Promise<AgentResponse> {
  const factory = new MedicalTourismLeadFactory();
  return await factory.deployEmergencyAgents();
}
