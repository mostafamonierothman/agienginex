
import { Agent } from '@/types/AgentTypes';

export class AgentFactory {
  static createCoreAgents(backendConnected: boolean): Agent[] {
    return [
      {
        id: 'next-move-agent',
        name: 'Next Move Agent',
        role: 'Strategic Decision Making',
        status: 'idle',
        performance: 85,
        autonomyLevel: 75,
        useBackend: backendConnected
      },
      {
        id: 'opportunity-detector',
        name: 'Opportunity Detector',
        role: 'Market Analysis & Discovery',
        status: 'idle',
        performance: 92,
        autonomyLevel: 80,
        useBackend: backendConnected
      },
      {
        id: 'deployment-optimizer',
        name: 'Deployment Optimizer',
        role: 'System Optimization & Scaling',
        status: 'idle',
        performance: 78,
        autonomyLevel: 70,
        useBackend: false
      },
      {
        id: 'revenue-maximizer',
        name: 'Revenue Maximizer',
        role: 'Business Growth & Monetization',
        status: 'idle',
        performance: 88,
        autonomyLevel: 85,
        useBackend: false
      }
    ];
  }

  static assessAgentPerformance(agent: Agent): void {
    // Simulate performance assessment
    const performanceChange = (Math.random() - 0.5) * 2; // -1 to +1
    agent.performance = Math.max(0, Math.min(100, agent.performance + performanceChange));
    
    // Increase autonomy based on performance
    if (agent.performance > 90) {
      agent.autonomyLevel = Math.min(100, agent.autonomyLevel + 0.1);
    } else if (agent.performance < 60) {
      agent.autonomyLevel = Math.max(0, agent.autonomyLevel - 0.2);
    }
  }
}
