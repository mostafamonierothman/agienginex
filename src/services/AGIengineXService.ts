import { supabase } from '@/integrations/supabase/client';

export interface AGIResponse {
  response: string;
  agent_used?: string;
  timestamp: string;
}

export interface AgentInfo {
  name: string;
  description: string;
  capabilities: string[];
}

export interface AGIGoal {
  id: string;
  goal_text: string;
  priority: number;
  status: string;
  progress_percentage: number;
}

class AGIengineXService {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    // The correct endpoint is ALWAYS the root, no subpaths!
    this.baseUrl = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex';
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`,
    };
  }

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      // Always GET to baseUrl for health
      const response = await fetch(this.baseUrl, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          connected: true,
          message: `✅ AGI Connected: ${data.message || 'AGIengineX operational'}`
        };
      } else if (response.status === 404) {
        return {
          connected: false,
          message: `❌ 404: Supabase Edge Function Not Found at ${this.baseUrl}. Please check your deployment or URL!`
        };
      } else {
        return {
          connected: false,
          message: `❌ Connection failed (${response.status}): Running in enhanced local mode`
        };
      }
    } catch (error) {
      return {
        connected: false,
        message: `❌ Connection error: Enhanced local AGI mode active`
      };
    }
  }

  async chat(message: string): Promise<AGIResponse> {
    try {
      // POST always to root; route by endpoint in body
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'chat', message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorPayload;
        try {
          errorPayload = JSON.parse(errorText);
        } catch {
          errorPayload = errorText;
        }
        const detailedError = typeof errorPayload === "string"
          ? errorPayload
          : (errorPayload?.error || errorPayload?.message || JSON.stringify(errorPayload));
        return {
          response: `❗️Chat API error (${response.status}): ${detailedError}`,
          agent_used: "system_error",
          timestamp: new Date().toISOString()
        };
      }
      const data = await response.json();
      return {
        response: data.response || data.message || 'AGI processed your message',
        agent_used: data.agent_used || 'agienginex',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        response: `💥 Unable to reach AGIengineX. Details: ${error.message || error}`,
        agent_used: 'local_agi_enhanced',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAvailableAgents(): Promise<AgentInfo[]> {
    try {
      // POST to root
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'agents' }),
      });
      if (!response.ok) throw new Error('Failed to get agents');
      const data = await response.json();
      return data.agents;
    } catch (error) {
      console.error('Get agents error:', error);
      return [
        {
          name: 'next_move_agent',
          description: 'Strategic Decision Making with Goal Context',
          capabilities: ['Strategic Planning', 'Business Analysis', 'Goal-Driven Decision Making']
        },
        {
          name: 'opportunity_agent',
          description: 'Market Opportunity Detection with Environment Awareness',
          capabilities: ['Market Analysis', 'Opportunity Detection', 'Revenue Optimization', 'Environment Adaptation']
        },
        {
          name: 'critic_agent',
          description: 'Self-Reflection and Performance Evaluation',
          capabilities: ['System Analysis', 'Performance Evaluation', 'Self-Improvement', 'Quality Assessment']
        }
      ];
    }
  }

  async getCurrentGoals(): Promise<AGIGoal[]> {
    try {
      // POST to root
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'goals' }),
      });
      if (!response.ok) throw new Error('Failed to get goals');
      const data = await response.json();
      return data.goals || [];
    } catch (error) {
      console.error('Get goals error:', error);
      return [];
    }
  }

  async createGoal(goalText: string, priority: number = 5): Promise<boolean> {
    try {
      // POST to root
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'goals_create', goal_text: goalText, priority }),
      });
      return response.ok;
    } catch (error) {
      console.error('Create goal error:', error);
      return false;
    }
  }

  async runAgentChain(chainName: string = 'standard_agi_loop'): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'chain', chain_name: chainName }),
      });
      if (!response.ok) throw new Error('Failed to run agent chain');
      return await response.json();
    } catch (error) {
      console.error('Agent chain error:', error);
      return { error: 'Agent chain execution failed' };
    }
  }

  async triggerWebhook(eventType: string, eventData: any): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'webhook', event_type: eventType, ...eventData }),
      });
      return response.ok;
    } catch (error) {
      console.error('Webhook trigger error:', error);
      return false;
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      // POST to root
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'status' }),
      });
      if (!response.ok) throw new Error('Status check failed');
      return await response.json();
    } catch (error) {
      console.error('Status check error:', error);
      return {
        status: 'local_mode',
        agi_loop_running: false,
        active_goals: 0,
        performance_score: 'N/A',
        agi_features: {
          autonomy: true,
          self_reflection: true,
          goal_driven: true,
          environment_adaptive: false,
          agent_chaining: false
        }
      };
    }
  }

  async startLoop(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'loop_start' }),
      });
      return response.ok;
    } catch (error) {
      console.error('Start loop error:', error);
      return false;
    }
  }

  async stopLoop(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ endpoint: 'loop_stop' }),
      });
      return response.ok;
    } catch (error) {
      console.error('Stop loop error:', error);
      return false;
    }
  }
}

export const agiEngineX = new AGIengineXService();
