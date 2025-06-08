
import { AgentLogger } from '@/agents/AgentLogger';
import { PersistentMemory } from './PersistentMemory';

export interface AgentHealth {
  name: string;
  status: 'OK' | 'WARNING' | 'ERROR' | 'OFFLINE';
  lastUpdate: string;
  performance: number;
}

export class UpgradedSupervisor {
  private cycleCount: number = 0;
  private agentHealth: Map<string, AgentHealth> = new Map();
  private logger: AgentLogger;
  private memory: PersistentMemory;
  private isRunning: boolean = false;

  constructor() {
    this.logger = new AgentLogger();
    this.memory = new PersistentMemory();
  }

  async registerAgent(agentName: string): Promise<void> {
    const health: AgentHealth = {
      name: agentName,
      status: 'OK',
      lastUpdate: new Date().toISOString(),
      performance: 100
    };
    
    this.agentHealth.set(agentName, health);
    await this.logger.log('UpgradedSupervisor', 'register_agent', `${agentName} registered successfully`, 'success');
    await this.memory.set(`agent_${agentName}_registered`, true);
  }

  async reportHealth(agentName: string, status: AgentHealth['status'], performance: number = 100): Promise<void> {
    const health = this.agentHealth.get(agentName);
    if (health) {
      health.status = status;
      health.lastUpdate = new Date().toISOString();
      health.performance = performance;
      this.agentHealth.set(agentName, health);
    }

    await this.logger.log('UpgradedSupervisor', 'report_health', `${agentName}: ${status} (${performance}%)`, 
      status === 'ERROR' ? 'error' : status === 'WARNING' ? 'warning' : 'info');
  }

  async runCycle(): Promise<void> {
    this.cycleCount++;
    const cycleStart = Date.now();
    
    await this.logger.log('UpgradedSupervisor', 'run_cycle', `Starting cycle ${this.cycleCount}`, 'info');
    
    // Check agent health
    for (const [name, health] of this.agentHealth) {
      const timeSinceUpdate = Date.now() - new Date(health.lastUpdate).getTime();
      if (timeSinceUpdate > 60000) { // 1 minute timeout
        await this.reportHealth(name, 'WARNING', health.performance * 0.9);
      }
    }

    // Store cycle metrics
    await this.memory.set('last_cycle_count', this.cycleCount);
    await this.memory.set('last_cycle_time', new Date().toISOString());
    
    const cycleTime = Date.now() - cycleStart;
    await this.logger.log('UpgradedSupervisor', 'run_cycle', `Cycle ${this.cycleCount} completed in ${cycleTime}ms`, 'success');
  }

  getSystemStatus() {
    const agents = Array.from(this.agentHealth.values());
    const healthyAgents = agents.filter(a => a.status === 'OK').length;
    const totalAgents = agents.length;
    const avgPerformance = agents.reduce((sum, a) => sum + a.performance, 0) / Math.max(totalAgents, 1);

    return {
      cycleCount: this.cycleCount,
      totalAgents,
      healthyAgents,
      avgPerformance: Math.round(avgPerformance),
      agentHealth: agents,
      isRunning: this.isRunning
    };
  }

  start(): void {
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }
}
