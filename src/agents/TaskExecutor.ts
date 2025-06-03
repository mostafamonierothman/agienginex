
import { Agent, TaskResult } from '@/types/AgentTypes';
import { fastAPIService } from '@/services/FastAPIService';
import { vectorMemoryService } from '@/services/VectorMemoryService';

export class TaskExecutor {
  static async executeAgentTask(agent: Agent): Promise<void> {
    agent.status = 'executing';
    
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let results: TaskResult;
    
    // Use backend for specific agents if connected
    if (agent.useBackend) {
      results = await this.executeBackendTask(agent);
    } else {
      results = this.generateLocalAgentResult(agent);
    }

    agent.lastAction = results.action;
    agent.status = 'completed';

    // Store in vector memory
    await vectorMemoryService.storeMemory(
      agent.id,
      `Task: ${agent.currentTask} | Result: ${results.action}`,
      'agent-execution',
      results.importance
    );

    console.log(`🤖 ${agent.name} → ${results.action}`);

    // Reset for next cycle
    setTimeout(() => {
      agent.status = 'idle';
      agent.currentTask = undefined;
    }, 2000);
  }

  private static async executeBackendTask(agent: Agent): Promise<TaskResult> {
    try {
      let action: string;
      
      if (agent.id === 'next-move-agent') {
        action = await fastAPIService.getNextMove();
      } else if (agent.id === 'opportunity-detector') {
        action = await fastAPIService.getOpportunity();
      } else {
        action = 'Backend task completed successfully';
      }

      console.log(`🔗 BACKEND AGENT ${agent.name} → ${action}`);
      
      return {
        action: `[BACKEND] ${action}`,
        importance: 0.9 // Backend results have high importance
      };
    } catch (error) {
      console.error(`Backend task failed for ${agent.name}:`, error);
      return this.generateLocalAgentResult(agent);
    }
  }

  private static generateLocalAgentResult(agent: Agent): TaskResult {
    const resultTemplates = {
      'next-move-agent': [
        'Identified optimal next strategic move: Scale MedJourney+ enterprise sales',
        'Strategic priority updated: Focus on billionaire health network expansion',
        'Cross-project synergy detected: Combine AGI healthcare with Sweden initiatives'
      ],
      'opportunity-detector': [
        'New opportunity: €50M healthcare AI contract tender discovered',
        'Market gap identified: Ultra-premium health optimization services',
        'Partnership opportunity: Nordic government health digitalization'
      ],
      'deployment-optimizer': [
        'System efficiency improved by 15% through algorithmic optimization',
        'Deployment pipeline streamlined: 40% faster time-to-market achieved',
        'Resource allocation optimized: 25% cost reduction in compute usage'
      ],
      'revenue-maximizer': [
        'Revenue optimization: New pricing strategy could increase ARR by 30%',
        'Monetization pathway identified: Freemium to enterprise conversion funnel',
        'Business model enhancement: Subscription + consulting hybrid approach'
      ]
    };

    const templates = resultTemplates[agent.id as keyof typeof resultTemplates] || ['Task completed successfully'];
    const action = templates[Math.floor(Math.random() * templates.length)];
    const importance = 0.7 + Math.random() * 0.3; // 0.7 to 1.0

    return { action, importance };
  }

  static allocateTasksToAgents(agents: Map<string, Agent>): void {
    const highPriorityTasks = [
      'Analyze current revenue optimization opportunities',
      'Identify market expansion possibilities',
      'Optimize deployment efficiency metrics',
      'Scan for breakthrough business opportunities',
      'Coordinate cross-agent knowledge sharing'
    ];

    // Allocate tasks to idle agents
    const idleAgents = Array.from(agents.values()).filter(agent => agent.status === 'idle');
    
    idleAgents.forEach((agent, index) => {
      if (index < highPriorityTasks.length) {
        agent.currentTask = highPriorityTasks[index];
        agent.status = 'thinking';
      }
    });
  }
}
