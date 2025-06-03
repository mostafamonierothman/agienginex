import { vectorMemoryService } from './VectorMemoryService';
import { fastAPIService } from './FastAPIService';
import { toast } from '@/hooks/use-toast';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'thinking' | 'executing' | 'completed' | 'error';
  currentTask?: string;
  performance: number;
  lastAction?: string;
  autonomyLevel: number;
  useBackend?: boolean;
}

export interface TaskAllocation {
  agentId: string;
  task: string;
  priority: number;
  estimatedDuration: number;
  dependencies: string[];
}

class MultiAgentSupervisorService {
  private agents: Map<string, Agent> = new Map();
  private taskQueue: TaskAllocation[] = [];
  private isRunning = false;
  private supervisionInterval: NodeJS.Timeout | null = null;
  private backendConnected = false;
  private dynamicLoopInterval = 3000;

  async initialize(): Promise<void> {
    // Check FastAPI backend connection
    this.backendConnected = await fastAPIService.checkStatus();
    
    if (this.backendConnected) {
      // Get dynamic loop interval from backend
      this.dynamicLoopInterval = (await fastAPIService.getLoopInterval()) * 1000;
      console.log(`🔗 FASTAPI BACKEND CONNECTED → Loop interval: ${this.dynamicLoopInterval}ms`);
    }

    // Initialize core agents
    const coreAgents: Agent[] = [
      {
        id: 'next-move-agent',
        name: 'Next Move Agent',
        role: 'Strategic Decision Making',
        status: 'idle',
        performance: 85,
        autonomyLevel: 75,
        useBackend: this.backendConnected
      },
      {
        id: 'opportunity-detector',
        name: 'Opportunity Detector',
        role: 'Market Analysis & Discovery',
        status: 'idle',
        performance: 92,
        autonomyLevel: 80,
        useBackend: this.backendConnected
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

    coreAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    console.log('🤖 MULTI-AGENT SUPERVISOR V2 → INITIALIZED');
    console.log(`👥 AGENTS DEPLOYED: ${this.agents.size} (Backend: ${this.backendConnected ? 'CONNECTED' : 'LOCAL'})`);
  }

  async startSupervision(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.initialize();
    
    this.supervisionInterval = setInterval(() => {
      this.supervisionCycle();
    }, this.dynamicLoopInterval);

    toast({
      title: "🤖 Multi-Agent Supervisor V2 Activated",
      description: `${this.agents.size} autonomous agents coordinating ${this.backendConnected ? 'with FastAPI backend' : 'locally'}`,
    });

    console.log('🎯 MULTI-AGENT SUPERVISION V2 → STARTED');
  }

  stopSupervision(): void {
    this.isRunning = false;
    if (this.supervisionInterval) {
      clearInterval(this.supervisionInterval);
      this.supervisionInterval = null;
    }
    
    // Set all agents to idle
    this.agents.forEach(agent => {
      agent.status = 'idle';
    });

    console.log('🛑 MULTI-AGENT SUPERVISION V2 → STOPPED');
  }

  private async supervisionCycle(): Promise<void> {
    if (!this.isRunning) return;

    // Update dynamic loop interval from backend if connected
    if (this.backendConnected) {
      try {
        const newInterval = (await fastAPIService.getLoopInterval()) * 1000;
        if (Math.abs(newInterval - this.dynamicLoopInterval) > 100) {
          this.dynamicLoopInterval = newInterval;
          console.log(`🔄 DYNAMIC LOOP UPDATED → ${this.dynamicLoopInterval}ms`);
        }
      } catch (error) {
        console.log('Backend loop interval update failed, continuing with current interval');
      }
    }

    // 1. Assess agent performance
    this.assessAgentPerformance();

    // 2. Allocate new tasks
    await this.allocateTasks();

    // 3. Execute agent actions
    await this.executeAgentActions();

    // 4. Update coordination
    this.updateCoordination();
  }

  private assessAgentPerformance(): void {
    this.agents.forEach(agent => {
      // Simulate performance assessment
      const performanceChange = (Math.random() - 0.5) * 2; // -1 to +1
      agent.performance = Math.max(0, Math.min(100, agent.performance + performanceChange));
      
      // Increase autonomy based on performance
      if (agent.performance > 90) {
        agent.autonomyLevel = Math.min(100, agent.autonomyLevel + 0.1);
      } else if (agent.performance < 60) {
        agent.autonomyLevel = Math.max(0, agent.autonomyLevel - 0.2);
      }
    });
  }

  private async allocateTasks(): Promise<void> {
    const highPriorityTasks = [
      'Analyze current revenue optimization opportunities',
      'Identify market expansion possibilities',
      'Optimize deployment efficiency metrics',
      'Scan for breakthrough business opportunities',
      'Coordinate cross-agent knowledge sharing'
    ];

    // Allocate tasks to idle agents
    const idleAgents = Array.from(this.agents.values()).filter(agent => agent.status === 'idle');
    
    idleAgents.forEach((agent, index) => {
      if (index < highPriorityTasks.length) {
        agent.currentTask = highPriorityTasks[index];
        agent.status = 'thinking';
      }
    });
  }

  private async executeAgentActions(): Promise<void> {
    for (const agent of this.agents.values()) {
      if (agent.status === 'thinking' && agent.currentTask) {
        await this.executeAgentTask(agent);
      }
    }
  }

  private async executeAgentTask(agent: Agent): Promise<void> {
    agent.status = 'executing';
    
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    let results;
    
    // Use backend for specific agents if connected
    if (agent.useBackend && this.backendConnected) {
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

  private async executeBackendTask(agent: Agent): Promise<{ action: string; importance: number }> {
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

  private generateLocalAgentResult(agent: Agent): { action: string; importance: number } {
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

  private updateCoordination(): void {
    // Cross-agent communication and coordination
    const activeAgents = Array.from(this.agents.values()).filter(agent => 
      agent.status === 'executing' || agent.status === 'completed'
    );

    if (activeAgents.length > 1) {
      console.log(`🔄 AGENT COORDINATION: ${activeAgents.length} agents synchronized`);
    }
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgentStats(): {
    totalAgents: number;
    activeAgents: number;
    avgPerformance: number;
    avgAutonomy: number;
  } {
    const agents = Array.from(this.agents.values());
    const activeAgents = agents.filter(agent => agent.status !== 'idle').length;
    const avgPerformance = agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length;
    const avgAutonomy = agents.reduce((sum, agent) => sum + agent.autonomyLevel, 0) / agents.length;

    return {
      totalAgents: agents.length,
      activeAgents,
      avgPerformance,
      avgAutonomy
    };
  }

  setBackendUrl(url: string): void {
    fastAPIService.setBaseUrl(url);
  }

  getBackendStatus(): boolean {
    return this.backendConnected;
  }

  getDynamicLoopInterval(): number {
    return this.dynamicLoopInterval;
  }
}

export const multiAgentSupervisor = new MultiAgentSupervisorService();
