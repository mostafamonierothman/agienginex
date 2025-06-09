
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { llmService } from '@/utils/llm';

export class IntelligentAgentFactory {
  private agentRegistry = new Map<string, any>();
  private agentTemplates = {
    'ErrorFixerAgent': {
      purpose: 'Fix specific types of errors automatically',
      capabilities: ['error_analysis', 'code_generation', 'file_modification']
    },
    'PerformanceOptimizerAgent': {
      purpose: 'Optimize system performance in real-time',
      capabilities: ['performance_monitoring', 'bottleneck_detection', 'optimization']
    },
    'DatabaseRepairAgent': {
      purpose: 'Fix database schema and connectivity issues',
      capabilities: ['schema_repair', 'query_optimization', 'connection_management']
    }
  };

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const requiredSkills = context.input?.requiredSkills || [];
      const urgencyLevel = context.input?.urgencyLevel || 'normal';

      await sendChatUpdate(`🏭 IntelligentAgentFactory: Creating ${requiredSkills.length} specialized agents...`);

      if (urgencyLevel === 'emergency') {
        await sendChatUpdate('🚨 EMERGENCY MODE: Mass-producing error-fixing agents...');
        await this.massProduceErrorFixers(10); // Create 10 error-fixing agents instantly
      }

      const createdAgents = [];
      for (const skill of requiredSkills) {
        const agent = await this.createIntelligentAgent(skill);
        if (agent) {
          createdAgents.push(agent);
          this.agentRegistry.set(agent.id, agent);
          await sendChatUpdate(`✅ Created ${agent.name} with AI-generated capabilities`);
        }
      }

      return {
        success: true,
        message: `🏭 IntelligentAgentFactory: Created ${createdAgents.length} intelligent agents`,
        data: {
          createdAgents,
          totalRegistered: this.agentRegistry.size,
          capabilities: createdAgents.map(a => a.capabilities).flat()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ IntelligentAgentFactory error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async createIntelligentAgent(skill: string) {
    try {
      const prompt = `
Create a specialized AI agent for this skill: "${skill}"

Generate a JSON response with:
{
  "id": "unique_agent_id",
  "name": "AgentName",
  "description": "what this agent does",
  "capabilities": ["capability1", "capability2"],
  "code": "TypeScript class implementation",
  "priority": 1-10,
  "autonomyLevel": 1-100
}

The agent should be able to actually perform the skill, not just simulate it.
Make it intelligent and capable of real problem-solving.
`;

      const response = await llmService.fetchLLMResponse(prompt, 'gpt-4o-mini');
      const agentSpec = JSON.parse(response.content);
      
      // Add runtime execution capability
      agentSpec.runner = this.createAgentRunner(agentSpec);
      agentSpec.createdAt = new Date().toISOString();
      agentSpec.status = 'active';

      return agentSpec;
    } catch (error) {
      console.error('Failed to create intelligent agent:', error);
      return null;
    }
  }

  private createAgentRunner(agentSpec: any) {
    return async (context: AgentContext): Promise<AgentResponse> => {
      try {
        await sendChatUpdate(`🤖 ${agentSpec.name}: Executing specialized task...`);
        
        // Use AI to determine what this agent should do based on the context
        const prompt = `
You are ${agentSpec.name} with these capabilities: ${agentSpec.capabilities.join(', ')}
Context: ${JSON.stringify(context.input)}
Task: Determine what action to take and provide a meaningful result.
`;

        const response = await llmService.fetchLLMResponse(prompt, 'gpt-4o-mini');
        
        return {
          success: true,
          message: `🤖 ${agentSpec.name}: ${response.content}`,
          data: { agentId: agentSpec.id, result: response.content },
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          message: `❌ ${agentSpec.name} execution failed`,
          timestamp: new Date().toISOString()
        };
      }
    };
  }

  private async massProduceErrorFixers(count: number) {
    const errorFixerPromises = [];
    
    for (let i = 0; i < count; i++) {
      errorFixerPromises.push(this.createIntelligentAgent(`error_fixer_${i}`));
    }

    const agents = await Promise.all(errorFixerPromises);
    agents.forEach(agent => {
      if (agent) {
        this.agentRegistry.set(agent.id, agent);
      }
    });

    await sendChatUpdate(`⚡ Mass-produced ${agents.filter(a => a).length} error-fixing agents in emergency mode`);
  }

  getActiveAgents() {
    return Array.from(this.agentRegistry.values());
  }

  getAgentById(id: string) {
    return this.agentRegistry.get(id);
  }
}

export async function IntelligentAgentFactoryRunner(context: AgentContext): Promise<AgentResponse> {
  const factory = new IntelligentAgentFactory();
  return await factory.runner(context);
}
