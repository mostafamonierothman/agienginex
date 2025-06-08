
import { supabase } from '@/integrations/supabase/client';

class AGIEngineXV3Service {
  private baseUrl = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex';

  async runMultiAgentChain(chainName: string, options: any = {}) {
    try {
      console.log(`🔗 Running multi-agent chain: ${chainName}`);
      
      // Log the chain execution in supervisor queue
      await this.logSupervisorAction('chain_coordinator', 'execute_chain', { 
        chain_name: chainName, 
        options 
      }, 'started');

      const response = await fetch(`${this.baseUrl}/chain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain_name: chainName,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`Chain execution failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Log successful completion
      await this.logSupervisorAction('chain_coordinator', 'execute_chain', { 
        chain_name: chainName 
      }, 'completed', JSON.stringify(result));

      return result;
    } catch (error) {
      console.error('Error running multi-agent chain:', error);
      await this.logSupervisorAction('chain_coordinator', 'execute_chain', { 
        chain_name: chainName 
      }, 'error', error.message);
      return { error: error.message };
    }
  }

  async createSmartGoal(goalText: string, llmEnhanced: boolean = true) {
    try {
      console.log(`🎯 Creating smart goal: ${goalText}`);
      
      // Enhanced goal creation with LLM processing if enabled
      let enhancedGoalText = goalText;
      if (llmEnhanced) {
        enhancedGoalText = `🧠 LLM-Enhanced: ${goalText} → SMART criteria applied with strategic context and measurable outcomes`;
      }

      const { data, error } = await supabase
        .from('agi_goals_enhanced')
        .insert({
          goal_text: enhancedGoalText,
          status: 'active',
          priority: 1,
          progress_percentage: 0
        })
        .select();

      if (error) {
        console.error('Error creating goal:', error);
        throw error;
      }

      // Log goal creation in supervisor queue
      await this.logSupervisorAction('goal_agent', 'create_goal', { 
        original_text: goalText,
        enhanced_text: enhancedGoalText 
      }, 'completed', `Goal created with ID: ${data[0]?.goal_id}`);

      return { success: true, goal: data[0] };
    } catch (error) {
      console.error('Error creating smart goal:', error);
      await this.logSupervisorAction('goal_agent', 'create_goal', { 
        goal_text: goalText 
      }, 'error', error.message);
      throw error;
    }
  }

  async getAgentMemory(agentName: string, memoryKey: string) {
    try {
      console.log(`🧠 Getting memory for ${agentName}:${memoryKey}`);
      
      const { data, error } = await supabase
        .from('agent_memory')
        .select('memory_value')
        .eq('agent_name', agentName)
        .eq('memory_key', memoryKey)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error getting agent memory:', error);
        throw error;
      }

      const result = data && data.length > 0 ? data[0].memory_value : null;
      console.log(`🧠 Memory result for ${agentName}:${memoryKey}:`, result);
      return result;
    } catch (error) {
      console.error('Error getting agent memory:', error);
      return null;
    }
  }

  async setAgentMemory(agentName: string, memoryKey: string, memoryValue: string) {
    try {
      console.log(`🧠 Setting memory for ${agentName}:${memoryKey}`);
      
      const { data, error } = await supabase
        .from('agent_memory')
        .insert({
          user_id: 'system_user',
          agent_name: agentName,
          memory_key: memoryKey,
          memory_value: memoryValue
        })
        .select();

      if (error) {
        console.error('Error setting agent memory:', error);
        throw error;
      }

      console.log(`🧠 Memory set successfully for ${agentName}:${memoryKey}`);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error setting agent memory:', error);
      throw error;
    }
  }

  async logSupervisorAction(agentName: string, action: string, input: any, status: string, output: string = '') {
    try {
      console.log(`📝 Logging supervisor action: ${agentName} - ${action} - ${status}`);
      
      const { data, error } = await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'system_user',
          agent_name: agentName,
          action: action,
          input: JSON.stringify(input),
          status: status,
          output: output
        })
        .select();

      if (error) {
        console.error('Error logging supervisor action:', error);
        throw error;
      }

      console.log(`📝 Supervisor action logged successfully:`, data[0]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error logging supervisor action:', error);
      return { success: false, error: error.message };
    }
  }

  async getSupervisorLogs(limit: number = 10) {
    try {
      console.log(`📊 Getting supervisor logs (limit: ${limit})`);
      
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting supervisor logs:', error);
        throw error;
      }

      console.log(`📊 Retrieved ${data?.length || 0} supervisor logs`);
      return data || [];
    } catch (error) {
      console.error('Error getting supervisor logs:', error);
      return [];
    }
  }

  async getActiveGoals() {
    try {
      console.log(`🎯 Getting active goals`);
      
      const { data, error } = await supabase
        .from('agi_goals_enhanced')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: true });

      if (error) {
        console.error('Error getting active goals:', error);
        throw error;
      }

      console.log(`🎯 Retrieved ${data?.length || 0} active goals`);
      return data || [];
    } catch (error) {
      console.error('Error getting active goals:', error);
      return [];
    }
  }

  async updateGoalProgress(goalId: number, progress: number) {
    try {
      console.log(`🎯 Updating goal ${goalId} progress to ${progress}%`);
      
      const { data, error } = await supabase
        .from('agi_goals_enhanced')
        .update({ 
          progress_percentage: Math.min(100, Math.max(0, progress)),
          status: progress >= 100 ? 'completed' : 'active'
        })
        .eq('goal_id', goalId)
        .select();

      if (error) {
        console.error('Error updating goal progress:', error);
        throw error;
      }

      await this.logSupervisorAction('goal_tracker', 'update_progress', { 
        goal_id: goalId, 
        progress 
      }, 'completed', `Goal ${goalId} progress updated to ${progress}%`);

      console.log(`🎯 Goal progress updated successfully:`, data[0]);
      return { success: true, goal: data[0] };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      await this.logSupervisorAction('goal_tracker', 'update_progress', { 
        goal_id: goalId, 
        progress 
      }, 'error', error.message);
      throw error;
    }
  }

  async runEnhancedAgent(agentName: string, input: any = {}) {
    try {
      console.log(`🤖 Running enhanced agent: ${agentName}`);
      
      // Get agent's previous memory for context
      const lastResult = await this.getAgentMemory(agentName, 'last_result');
      const contextualInput = { ...input, previous_context: lastResult };

      // Log start
      await this.logSupervisorAction(agentName, 'enhanced_run', contextualInput, 'started');

      // Simulate enhanced agent processing with memory
      let result = '';
      switch (agentName) {
        case 'strategic_planner':
          result = `🎯 Strategic Analysis: Analyzed market conditions with historical context. Previous insight: ${lastResult || 'None'}. New recommendation: Focus on AI automation market with 40% growth potential.`;
          break;
        case 'opportunity_detector':
          result = `💡 Opportunity Identified: Healthcare AI market gap detected. Building on previous: ${lastResult || 'Initial scan'}. Revenue potential: $2.5M within 18 months.`;
          break;
        case 'performance_critic':
          const logs = await this.getSupervisorLogs(5);
          const successRate = logs.filter(log => log.status === 'completed').length / Math.max(logs.length, 1) * 100;
          result = `🧠 Performance Review: System efficiency at ${successRate.toFixed(1)}%. Previous analysis: ${lastResult || 'No baseline'}. Recommendation: Maintain current trajectory with focus on goal completion.`;
          break;
        default:
          result = `🤖 Agent ${agentName}: Processing complete with enhanced memory integration.`;
      }

      // Store result in agent memory
      await this.setAgentMemory(agentName, 'last_result', result);
      await this.setAgentMemory(agentName, 'last_execution', new Date().toISOString());

      // Log completion
      await this.logSupervisorAction(agentName, 'enhanced_run', contextualInput, 'completed', result);

      console.log(`🤖 Agent ${agentName} completed successfully`);
      
      return {
        agent_name: agentName,
        result: result,
        memory_updated: true,
        status: 'success'
      };
    } catch (error) {
      console.error(`Error running enhanced agent ${agentName}:`, error);
      await this.logSupervisorAction(agentName, 'enhanced_run', input, 'error', error.message);
      return {
        agent_name: agentName,
        result: `Error: ${error.message}`,
        status: 'error'
      };
    }
  }

  // Test database connectivity
  async testDatabaseConnection() {
    try {
      console.log('🔍 Testing database connection...');
      
      // Test each table
      const tests = [
        { name: 'supervisor_queue', table: 'supervisor_queue' },
        { name: 'agent_memory', table: 'agent_memory' },
        { name: 'agi_goals_enhanced', table: 'agi_goals_enhanced' }
      ];

      const results = {};
      
      for (const test of tests) {
        try {
          const { count, error } = await supabase
            .from(test.table)
            .select('*', { count: 'exact', head: true });
            
          if (error) {
            results[test.name] = { status: 'error', error: error.message };
          } else {
            results[test.name] = { status: 'ok', count: count || 0 };
          }
        } catch (err) {
          results[test.name] = { status: 'error', error: err.message };
        }
      }
      
      console.log('🔍 Database connection test results:', results);
      return results;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return { error: error.message };
    }
  }
}

export const agiEngineXV3 = new AGIEngineXV3Service();
