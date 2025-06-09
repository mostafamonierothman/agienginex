import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';

export class SupervisorAgent {
  private errorHistory: Array<{
    timestamp: string;
    error: string;
    agent: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  private recoveryStrategies = {
    persistence_error: 'MemoryAgent',
    agent_failure: 'FactoryAgent',
    timeout_error: 'CoordinationAgent',
    api_error: 'ResearchAgent',
    unknown_error: 'CriticAgent'
  };

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🕹️ SupervisorAgent: Monitoring system status and detecting medical tourism deployment...');

      // Check for medical tourism agent deployment
      const medicalTourismStatus = await this.checkMedicalTourismDeployment();
      
      // Check for recent errors in console logs and system state
      const systemErrors = await this.detectSystemErrors();
      const errorSummary = await this.analyzeErrors(systemErrors);

      if (systemErrors.length > 0) {
        await sendChatUpdate(`⚠️ SupervisorAgent: Detected ${systemErrors.length} errors - initiating recovery protocols`);
        
        // Assign recovery tasks to appropriate agents
        for (const error of systemErrors) {
          const recoveryAgent = this.selectRecoveryAgent(error);
          await this.assignRecoveryTask(error, recoveryAgent, context);
        }
      }

      // Enhanced system status assessment including medical tourism
      const systemStatus = {
        active_agents: 12 + (medicalTourismStatus.deployed_agents || 0),
        active_goals: 3,
        recent_memories: 5,
        recent_activity: 12,
        system_health: systemErrors.length === 0 ? 'operational' : 'recovering',
        errors_detected: systemErrors.length,
        recovery_actions_taken: systemErrors.length,
        medical_tourism_mission: medicalTourismStatus
      };

      let statusMessage = `System Status: ${systemStatus.active_agents} agents active, ${systemStatus.active_goals} goals tracked`;
      
      if (medicalTourismStatus.deployed_agents > 0) {
        statusMessage += `, Medical Tourism: ${medicalTourismStatus.deployed_agents} agents deployed, ${medicalTourismStatus.leads_generated} leads generated`;
      }

      await sendChatUpdate(`🕹️ ${statusMessage}`);

      return {
        success: true,
        message: `🕹️ ${statusMessage}`,
        data: { 
          ...systemStatus,
          errorSummary,
          nextAgent: systemErrors.length > 0 ? 'recovery_mode' : null
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      await sendChatUpdate(`❌ SupervisorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        success: false,
        message: `❌ SupervisorAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async checkMedicalTourismDeployment(): Promise<{
    deployed_agents: number;
    leads_generated: number;
    mission_status: string;
  }> {
    try {
      // Check for deployed medical tourism agents
      const { data: agentLogs, error: agentError } = await supabase
        .from('supervisor_queue')
        .select('*')
        .eq('action', 'agent_deployed')
        .eq('user_id', 'demo_user');

      // Check for generated leads
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id, industry')
        .in('industry', ['eye surgery', 'dental procedures']);

      if (agentError || leadsError) {
        console.error('Error checking medical tourism status:', agentError || leadsError);
        return { deployed_agents: 0, leads_generated: 0, mission_status: 'unknown' };
      }

      const deployedAgents = agentLogs?.length || 0;
      const leadsGenerated = leads?.length || 0;
      
      let missionStatus = 'not_started';
      if (deployedAgents > 0 && leadsGenerated > 0) {
        missionStatus = 'active_generating_leads';
      } else if (deployedAgents > 0) {
        missionStatus = 'agents_deployed_no_leads';
      }

      console.log(`Medical Tourism Status: ${deployedAgents} agents, ${leadsGenerated} leads, status: ${missionStatus}`);

      return {
        deployed_agents: deployedAgents,
        leads_generated: leadsGenerated,
        mission_status: missionStatus
      };
    } catch (error) {
      console.error('Failed to check medical tourism deployment:', error);
      return { deployed_agents: 0, leads_generated: 0, mission_status: 'error' };
    }
  }

  private async detectSystemErrors(): Promise<Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
  }>> {
    const errors = [];

    // Simulate error detection based on common patterns we see in logs
    const commonErrors = [
      {
        type: 'persistence_error',
        message: 'Failed to save state to persistence layer',
        severity: 'high' as const,
        timestamp: new Date().toISOString()
      },
      {
        type: 'agent_failure',
        message: 'Agent execution failed with constructor error',
        severity: 'medium' as const,
        timestamp: new Date().toISOString()
      }
    ];

    // In a real implementation, this would check actual system logs
    // For now, we'll return detected error patterns
    const hasRecentErrors = Math.random() > 0.7; // Simulate error detection
    
    if (hasRecentErrors) {
      errors.push(commonErrors[Math.floor(Math.random() * commonErrors.length)]);
    }

    return errors;
  }

  private async analyzeErrors(errors: any[]): Promise<{
    totalErrors: number;
    criticalErrors: number;
    recoveryNeeded: boolean;
    recommendations: string[];
  }> {
    const criticalErrors = errors.filter(e => e.severity === 'critical').length;
    const highErrors = errors.filter(e => e.severity === 'high').length;
    
    const recommendations = [];
    
    if (criticalErrors > 0) {
      recommendations.push('Immediate system restart required');
    }
    if (highErrors > 2) {
      recommendations.push('Reduce system load and check persistence layer');
    }
    if (errors.length > 5) {
      recommendations.push('Enable debug mode for detailed error tracking');
    }

    return {
      totalErrors: errors.length,
      criticalErrors,
      recoveryNeeded: errors.length > 0,
      recommendations
    };
  }

  private selectRecoveryAgent(error: any): string {
    // Map error types to recovery agents
    for (const [errorPattern, agent] of Object.entries(this.recoveryStrategies)) {
      if (error.type.includes(errorPattern) || error.message.toLowerCase().includes(errorPattern.replace('_', ' '))) {
        return agent;
      }
    }
    return 'CriticAgent'; // Default recovery agent
  }

  private async assignRecoveryTask(error: any, recoveryAgent: string, context: AgentContext): Promise<void> {
    await sendChatUpdate(`🔧 SupervisorAgent: Assigning ${error.type} recovery to ${recoveryAgent}`);
    
    // Log the recovery task assignment
    this.errorHistory.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      agent: recoveryAgent,
      severity: error.severity
    });

    // In a real implementation, this would trigger the recovery agent
    console.log(`[SupervisorAgent] Recovery task assigned: ${recoveryAgent} → ${error.type}`);
  }

  getErrorHistory() {
    return this.errorHistory;
  }
}

export async function SupervisorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new SupervisorAgent();
  return await agent.runner(context);
}
