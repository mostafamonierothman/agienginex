
import { Agent } from '@/types/AgentTypes';
import { AgentFactory } from '@/agents/AgentFactory';
import { TaskExecutor } from '@/agents/TaskExecutor';
import { fastAPIService } from '@/services/FastAPIService';

export class SupervisionCycle {
  private agents: Map<string, Agent>;
  private isRunning = false;
  private supervisionInterval: NodeJS.Timeout | null = null;
  private backendConnected = false;
  private dynamicLoopInterval = 3000;

  constructor() {
    this.agents = new Map();
  }

  async initialize(): Promise<void> {
    // Check FastAPI backend connection
    this.backendConnected = await fastAPIService.checkStatus();
    
    if (this.backendConnected) {
      // Get dynamic loop interval from backend
      this.dynamicLoopInterval = (await fastAPIService.getLoopInterval()) * 1000;
      console.log(`🔗 FASTAPI BACKEND CONNECTED → Loop interval: ${this.dynamicLoopInterval}ms`);
    }

    // Initialize core agents
    const coreAgents = AgentFactory.createCoreAgents(this.backendConnected);
    
    coreAgents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });

    console.log('🤖 MULTI-AGENT SUPERVISOR V2 → INITIALIZED');
    console.log(`👥 AGENTS DEPLOYED: ${this.agents.size} (Backend: ${this.backendConnected ? 'CONNECTED' : 'LOCAL'})`);
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    await this.initialize();
    
    this.supervisionInterval = setInterval(() => {
      this.runCycle();
    }, this.dynamicLoopInterval);

    console.log('🎯 MULTI-AGENT SUPERVISION V2 → STARTED');
  }

  stop(): void {
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

  private async runCycle(): Promise<void> {
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
    TaskExecutor.allocateTasksToAgents(this.agents);

    // 3. Execute agent actions
    await this.executeAgentActions();

    // 4. Update coordination
    this.updateCoordination();
  }

  private assessAgentPerformance(): void {
    this.agents.forEach(agent => {
      AgentFactory.assessAgentPerformance(agent);
    });
  }

  private async executeAgentActions(): Promise<void> {
    for (const agent of this.agents.values()) {
      if (agent.status === 'thinking' && agent.currentTask) {
        await TaskExecutor.executeAgentTask(agent);
      }
    }
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

  getBackendStatus(): boolean {
    return this.backendConnected;
  }

  getDynamicLoopInterval(): number {
    return this.dynamicLoopInterval;
  }

  setBackendUrl(url: string): void {
    fastAPIService.setBaseUrl(url);
  }
}
