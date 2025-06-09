
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { callLLMAPI } from '@/integrations/llm/callLLMAPI';
import { saveChatMessage } from '@/utils/saveChatMessage';

// Dynamic agent registry
const dynamicAgentRegistry = new Map<string, any>();

export class EnhancedFactoryAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🏭 FactoryAgent activated. Checking for missing skills...');

      const missingSkills = context.input?.missingSkills || [];
      const goalRequirements = context.input?.goalRequirements || {};

      if (missingSkills.length === 0) {
        await sendChatUpdate('✅ No missing skills detected. FactoryAgent idle.');
        return { 
          success: true, 
          message: 'No agents needed.',
          timestamp: new Date().toISOString()
        };
      }

      const createdAgents = [];

      for (const skill of missingSkills) {
        await sendChatUpdate(`🛠️ Creating agent for skill: ${skill}...`);

        const prompt = `
        The AGIengineX system needs an agent with this skill: "${skill}".
        
        Generate an agent template with:
        - Agent name (based on skill)
        - Agent description
        - Main purpose and capabilities
        - Expected input/output format
        - Key methods it should have
        
        Keep it focused and practical for real-world use.
        
        Skill: ${skill}
        Goal context: ${JSON.stringify(goalRequirements)}
        `;

        const agentSpecification = await callLLMAPI(prompt);

        // Register the new agent dynamically
        const agentName = `${skill}_agent_${Date.now()}`;
        
        dynamicAgentRegistry.set(agentName, {
          name: agentName,
          skill: skill,
          specification: agentSpecification,
          created: new Date().toISOString(),
          status: 'active'
        });

        createdAgents.push({
          name: agentName,
          skill: skill,
          specification: agentSpecification
        });

        await sendChatUpdate(`✅ Created agent: ${agentName} for skill "${skill}"`);
        
        await saveChatMessage('EnhancedFactoryAgent', 
          `Created new agent ${agentName} for skill ${skill}: ${agentSpecification}`
        );
      }

      await sendChatUpdate(`🎯 FactoryAgent completed. Created ${createdAgents.length} new agents.`);

      return {
        success: true,
        message: `🏭 FactoryAgent generated ${createdAgents.length} agents successfully`,
        data: {
          createdAgents,
          registrySize: dynamicAgentRegistry.size,
          skills: missingSkills
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      await sendChatUpdate(`❌ FactoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      return {
        success: false,
        message: `❌ FactoryAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  static getDynamicAgents() {
    return Array.from(dynamicAgentRegistry.values());
  }

  static getAgent(agentName: string) {
    return dynamicAgentRegistry.get(agentName);
  }

  static getRegistryStats() {
    return {
      totalAgents: dynamicAgentRegistry.size,
      skills: Array.from(dynamicAgentRegistry.values()).map(agent => agent.skill),
      activeAgents: Array.from(dynamicAgentRegistry.values()).filter(agent => agent.status === 'active').length
    };
  }
}

export async function EnhancedFactoryAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const factory = new EnhancedFactoryAgent();
  return await factory.runner(context);
}

// Export the factory function for backwards compatibility
export const FactoryAgent = EnhancedFactoryAgentRunner;
