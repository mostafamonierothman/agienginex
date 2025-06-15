import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { MedicalTourismLeadFactoryRunner } from './MedicalTourismLeadFactory';
import { ExecutionAgentRunner } from './ExecutionAgent';
import { ReflectionAgentRunner } from './ReflectionAgent';

interface AutonomyCondition {
  id: string;
  condition: string;
  action: string;
  priority: number;
  lastTriggered?: string;
  cooldownMinutes: number;
}

export class AutonomyTriggerAgent {
  private conditions: AutonomyCondition[] = [
    {
      id: 'low_leads_trigger',
      condition: 'leads_generated_last_hour < 5',
      action: 'deploy_lead_generation',
      priority: 9,
      cooldownMinutes: 60
    },
    {
      id: 'no_activity_trigger',
      condition: 'no_system_activity_last_30_minutes',
      action: 'activate_execution_agents',
      priority: 7,
      cooldownMinutes: 30
    },
    {
      id: 'performance_drop_trigger',
      condition: 'success_rate < 60%',
      action: 'run_reflection_and_optimization',
      priority: 8,
      cooldownMinutes: 120
    },
    {
      id: 'goal_stagnation_trigger',
      condition: 'no_revenue_growth_last_4_hours',
      action: 'emergency_acceleration',
      priority: 10,
      cooldownMinutes: 240
    }
  ];

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🤖 AutonomyTriggerAgent: Checking autonomous trigger conditions...');

      const triggeredConditions = await this.evaluateConditions();
      const actionsToExecute = this.prioritizeActions(triggeredConditions);

      if (actionsToExecute.length === 0) {
        return {
          success: true,
          message: '🤖 All autonomous conditions normal - no triggers activated',
          data: { conditionsChecked: this.conditions.length, triggered: 0 },
          timestamp: new Date().toISOString()
        };
      }

      // Execute autonomous actions
      const results = [];
      for (const action of actionsToExecute) {
        const result = await this.executeAutonomousAction(action);
        results.push(result);
        
        // Update last triggered time
        const condition = this.conditions.find(c => c.id === action.id);
        if (condition) {
          condition.lastTriggered = new Date().toISOString();
        }
      }

      await this.logAutonomousActions(actionsToExecute, results);

      return {
        success: true,
        message: `🤖 Autonomous actions executed: ${actionsToExecute.length} triggers activated`,
        data: { 
          triggeredConditions: actionsToExecute.length,
          actions: results,
          nextAgent: results.length > 0 ? 'ContinueAutonomousExecution' : null
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ AutonomyTriggerAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async evaluateConditions(): Promise<AutonomyCondition[]> {
    const triggered = [];

    for (const condition of this.conditions) {
      // Check cooldown
      if (this.isInCooldown(condition)) continue;

      const shouldTrigger = await this.checkCondition(condition);
      if (shouldTrigger) {
        triggered.push(condition);
      }
    }

    return triggered;
  }

  private isInCooldown(condition: AutonomyCondition): boolean {
    if (!condition.lastTriggered) return false;
    
    const lastTrigger = new Date(condition.lastTriggered);
    const cooldownEnd = new Date(lastTrigger.getTime() + condition.cooldownMinutes * 60 * 1000);
    
    return new Date() < cooldownEnd;
  }

  private async checkCondition(condition: AutonomyCondition): Promise<boolean> {
    const now = new Date();
    
    switch (condition.id) {
      case 'low_leads_trigger':
        return await this.checkLowLeads();
      
      case 'no_activity_trigger':
        return await this.checkNoActivity();
      
      case 'performance_drop_trigger':
        return await this.checkPerformanceDrop();
      
      case 'goal_stagnation_trigger':
        return await this.checkGoalStagnation();
      
      default:
        return false;
    }
  }

  private async checkLowLeads(): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id')
      .gte('created_at', oneHourAgo.toISOString());

    return (recentLeads?.length || 0) < 5;
  }

  private async checkNoActivity(): Promise<boolean> {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const { data: recentActivity } = await supabase
      .from('supervisor_queue')
      .select('id')
      .gte('timestamp', thirtyMinutesAgo.toISOString());

    return (recentActivity?.length || 0) === 0;
  }

  private async checkPerformanceDrop(): Promise<boolean> {
    const { data: recentActivity } = await supabase
      .from('supervisor_queue')
      .select('status')
      .order('timestamp', { ascending: false })
      .limit(20);

    if (!recentActivity || recentActivity.length < 10) return false;

    // Guard for record shape and null
    const successful = recentActivity.filter(a => a && typeof a === "object" && (a as any).status === 'completed');
    const successRate = successful.length / recentActivity.length;
    return successRate < 0.6;
  }

  private async checkGoalStagnation(): Promise<boolean> {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id')
      .gte('created_at', fourHoursAgo.toISOString());

    return (recentLeads?.length || 0) === 0;
  }

  private prioritizeActions(conditions: AutonomyCondition[]): AutonomyCondition[] {
    return conditions.sort((a, b) => b.priority - a.priority);
  }

  private async executeAutonomousAction(condition: AutonomyCondition): Promise<any> {
    const context: AgentContext = {
      input: { 
        autonomousTrigger: true, 
        triggeredBy: condition.id,
        priority: condition.priority 
      },
      user_id: 'autonomy_trigger_agent'
    };

    switch (condition.action) {
      case 'deploy_lead_generation':
        await sendChatUpdate('🚨 AUTONOMOUS: Deploying emergency lead generation squad');
        return await MedicalTourismLeadFactoryRunner(context);
      
      case 'activate_execution_agents':
        await sendChatUpdate('🚨 AUTONOMOUS: Activating execution agents due to inactivity');
        return await ExecutionAgentRunner(context);
      
      case 'run_reflection_and_optimization':
        await sendChatUpdate('🚨 AUTONOMOUS: Running system reflection and optimization');
        return await ReflectionAgentRunner(context);
      
      case 'emergency_acceleration':
        await sendChatUpdate('🚨 AUTONOMOUS: Emergency acceleration protocol activated');
        return await this.emergencyAcceleration(context);
      
      default:
        return { success: false, message: `Unknown autonomous action: ${condition.action}` };
    }
  }

  private async emergencyAcceleration(context: AgentContext): Promise<any> {
    // Deploy multiple systems simultaneously
    const results = await Promise.all([
      MedicalTourismLeadFactoryRunner(context),
      ExecutionAgentRunner(context),
      ReflectionAgentRunner(context)
    ]);

    return {
      success: true,
      message: 'Emergency acceleration complete - all systems activated',
      data: { parallelExecutions: results.length }
    };
  }

  private async logAutonomousActions(actions: AutonomyCondition[], results: any[]) {
    for (let i = 0; i < actions.length; i++) {
      await supabase
        .from('supervisor_queue')
        .insert([{
          user_id: 'autonomy_trigger_agent',
          agent_name: 'autonomy_trigger_agent',
          action: 'autonomous_trigger',
          input: JSON.stringify({ condition: actions[i] }),
          status: results[i]?.success ? 'completed' : 'failed',
          output: JSON.stringify(results[i])
        } as TablesInsert<'supervisor_queue'>]);
    }
  }
}

export async function AutonomyTriggerAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new AutonomyTriggerAgent();
  return await agent.runner(context);
}
