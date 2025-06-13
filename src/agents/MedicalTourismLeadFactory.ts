import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';
import { LeadGenerationMasterAgentRunner } from './LeadGenerationMasterAgent';

export class MedicalTourismLeadFactory {
  private deployedAgents: Map<string, any> = new Map();
  
  async deployEmergencyAgents(): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🚑 Launching 50 emergency agents...');

      const eyeSurgeryKeywords = [
        'LASIK surgery abroad UK', 'LASEK Europe reviews', 'PRK abroad clinic',
        'laser eye surgery cost Egypt', 'SMILE surgery Istanbul'
      ];

      const dentalKeywords = [
        'dental implants Turkey', 'veneers Egypt reviews', 'cosmetic dentist abroad',
        'dental crowns Europe', 'smile makeover Tunisia'
      ];

      const allKeywords = [...eyeSurgeryKeywords, ...dentalKeywords];
      const agentPromises = [];

      for (let i = 0; i < 50; i++) {
        const keyword = allKeywords[i % allKeywords.length];
        const agentId = `Agent_${i + 1}_${Date.now()}`;
        const specialty = i < 25 ? 'eye_surgery' : 'dental_procedures';

        this.deployedAgents.set(agentId, {
          id: agentId,
          keyword,
          specialty,
          deployed_at: new Date().toISOString()
        });

        const agentPromise = this.deployRealAgent(agentId, keyword, specialty, i * 150);
        agentPromises.push(agentPromise);
      }

      await Promise.all(agentPromises);

      await sendChatUpdate('✅ All agents deployed and reporting');
      return {
        success: true,
        message: '50 real agents deployed successfully',
        data: {
          eye_surgery_agents: 25,
          dental_agents: 25
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `🚫 Factory error: ${error instanceof Error ? error.message : 'Unknown issue'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async deployRealAgent(agentId: string, keyword: string, specialty: string, delay: number): Promise<void> {
    await new Promise(r => setTimeout(r, delay));

    await supabase.from('supervisor_queue').insert({
      user_id: 'demo_user',
      agent_name: agentId,
      action: 'agent_deployed',
      input: JSON.stringify({ keyword, specialty }),
      status: 'active',
      output: `Agent deployed for keyword "${keyword}"`
    });

    const result = await LeadGenerationMasterAgentRunner({
      input: { keyword, agentId },
      user_id: 'demo_user',
      timestamp: new Date().toISOString()
    });

    await supabase.from('supervisor_queue').insert({
      user_id: 'demo_user',
      agent_name: agentId,
      action: 'lead_generation_complete',
      input: JSON.stringify({ keyword }),
      status: result.success ? 'completed' : 'failed',
      output: result.message
    });
  }
}

export async function MedicalTourismLeadFactoryRunner(context: AgentContext): Promise<AgentResponse> {
  const factory = new MedicalTourismLeadFactory();
  return await factory.deployEmergencyAgents();
}
