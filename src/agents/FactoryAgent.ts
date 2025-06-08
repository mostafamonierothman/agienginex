
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export async function FactoryAgent(context: AgentContext): Promise<AgentResponse> {
  try {
    const agentName = `Agent_${Date.now()}`;
    const agentType = "Custom";
    const purpose = "Self-created agent for exploratory tasks";

    // Create agent in supervisor queue as a registry entry
    const { data, error } = await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'demo_user',
        agent_name: 'factory_agent',
        action: 'agent_creation',
        input: JSON.stringify({
          new_agent_name: agentName,
          agent_type: agentType,
          purpose: purpose,
          config: {
            learning: true,
            coordination: true,
            autonomous: true
          }
        }),
        status: 'completed',
        output: `Created new agent: ${agentName}`,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('FactoryAgent error:', error);
      return {
        success: false,
        message: `❌ FactoryAgent failed: ${error.message}`
      };
    }

    console.log(`🏭 FactoryAgent created new agent: ${agentName}`);
    
    return {
      success: true,
      message: `✅ FactoryAgent created new agent: ${agentName}`,
      data: { agentName, agentType, purpose },
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
