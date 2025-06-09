
import { EnhancedFactoryAgent } from '@/agents/EnhancedFactoryAgent';

export const EnhancedAgentRegistry = {
  // Static agents
  staticAgents: new Map(),

  // Dynamic agents from factory
  getDynamicAgents() {
    return EnhancedFactoryAgent.getDynamicAgents();
  },

  getAllAgents() {
    const staticAgents = Array.from(this.staticAgents.values());
    const dynamicAgents = this.getDynamicAgents();
    return [...staticAgents, ...dynamicAgents];
  },

  registerStaticAgent(name: string, agent: any) {
    this.staticAgents.set(name, {
      name,
      type: 'static',
      agent,
      registered: new Date().toISOString()
    });
    console.log(`✅ Registered static agent: ${name}`);
  },

  getAgent(agentName: string) {
    // Check static agents first
    const staticAgent = this.staticAgents.get(agentName);
    if (staticAgent) return staticAgent;

    // Check dynamic agents
    return EnhancedFactoryAgent.getAgent(agentName);
  },

  getRegistryStats() {
    const factoryStats = EnhancedFactoryAgent.getRegistryStats();
    return {
      staticAgents: this.staticAgents.size,
      dynamicAgents: factoryStats.totalAgents,
      totalAgents: this.staticAgents.size + factoryStats.totalAgents,
      availableSkills: [
        'memory', 'research', 'collaboration', 'goal_setting', 'orchestration',
        ...factoryStats.skills
      ]
    };
  }
};
