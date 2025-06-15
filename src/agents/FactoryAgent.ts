
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { getRandomTemplate } from '@/utils/agent_templates';

export async function FactoryAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    // Get a random agent template
    const template = getRandomTemplate();
    const timestamp = Date.now();
    const agentName = `${template.nameTemplate}${timestamp}`;

    // Create agent in supervisor queue as a registry entry
    const { data, error } = await supabase
      .from('api.supervisor_queue' as any)
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'factory_agent',
        action: 'agent_creation',
        input: JSON.stringify({
          new_agent_name: agentName,
          agent_type: template.type,
          purpose: template.purpose,
          config: {
            ...template.config,
            learning: true,
            coordination: true,
            autonomous: true,
            template_based: true
          }
        }),
        status: 'completed',
        output: `Created new ${template.type} agent: ${agentName}`,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('FactoryAgent error:', error);
      return {
        success: false,
        message: `❌ FactoryAgent failed: ${error.message}`
      };
    }

    console.log(`🏭 FactoryAgent created new ${template.type} agent: ${agentName}`);
    
    return {
      success: true,
      message: `✅ FactoryAgent created new ${template.type} agent: ${agentName}`,
      data: { 
        agentName, 
        agentType: template.type, 
        purpose: template.purpose,
        template: template.nameTemplate
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('FactoryAgent error:', error);
    return {
      success: false,
      message: `❌ FactoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
