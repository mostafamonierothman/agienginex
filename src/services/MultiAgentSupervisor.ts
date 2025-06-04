import { vectorMemoryService } from './VectorMemoryService';
import { fastAPIService } from './FastAPIService';
import { openAIService } from './OpenAIService';
import { toast } from '@/hooks/use-toast';
import { Agent, AgentStats } from '@/types/AgentTypes';
import { SupervisionCycle } from '@/supervision/SupervisionCycle';

class MultiAgentSupervisorService {
  private supervisionCycle: SupervisionCycle;

  constructor() {
    this.supervisionCycle = new SupervisionCycle();
  }

  async startSupervision(): Promise<void> {
    await this.supervisionCycle.start();

    const backendStatus = this.getBackendStatus() ? 'with FastAPI backend' : 'locally';
    const openAIStatus = openAIService.isAvailable() ? ' + OpenAI enhanced' : '';
    
    toast({
      title: "🤖 Multi-Agent Supervisor V2 Activated",
      description: `${this.getAgents().length} autonomous agents coordinating ${backendStatus}${openAIStatus}`,
    });
  }

  setOpenAIAvailable(available: boolean): void {
    this.supervisionCycle.setOpenAIAvailable(available);
  }

  stopSupervision(): void {
    this.supervisionCycle.stop();
  }

  getAgents(): Agent[] {
    return this.supervisionCycle.getAgents();
  }

  getAgentStats(): AgentStats {
    const agents = this.getAgents();
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
    this.supervisionCycle.setBackendUrl(url);
  }

  getBackendStatus(): boolean {
    return this.supervisionCycle.getBackendStatus();
  }

  getDynamicLoopInterval(): number {
    return this.supervisionCycle.getDynamicLoopInterval();
  }
}

export const multiAgentSupervisor = new MultiAgentSupervisorService();
export type { Agent, AgentStats } from '@/types/AgentTypes';
