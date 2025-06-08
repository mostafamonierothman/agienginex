
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
    this.baseUrl = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex';
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    };
  }

  async chat(message: string): Promise<AGIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('Chat request failed');
      const data = await response.json();
      
      return {
        response: data.response,
        agent_used: data.agent_used,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('AGI Chat error:', error);
      return {
        response: 'AGI system temporarily unavailable. Using local intelligence.',
        timestamp: new Date().toISOString()
      };
    }
  }

  async getAvailableAgents(): Promise<AgentInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents`, {
        headers: this.getHeaders()
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
      const response = await fetch(`${this.baseUrl}/goals`, {
        headers: this.getHeaders()
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
      const response = await fetch(`${this.baseUrl}/goals`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          goal_text: goalText,
          priority: priority
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Create goal error:', error);
      return false;
    }
  }

  async runAgentChain(chainName: string = 'standard_agi_loop'): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/chain`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          chain_name: chainName
        })
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
      const response = await fetch(`${this.baseUrl}/webhook`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          event_type: eventType,
          ...eventData
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Webhook trigger error:', error);
      return false;
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: this.getHeaders()
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
          autonomy: false,
          self_reflection: false,
          goal_driven: false,
          environment_adaptive: false,
          agent_chaining: false
        }
      };
    }
  }

  async startLoop(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/loop/start`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      return response.ok;
    } catch (error) {
      console.error('Start loop error:', error);
      return false;
    }
  }

  async stopLoop(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/loop/stop`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      
      return response.ok;
    } catch (error) {
      console.error('Stop loop error:', error);
      return false;
    }
  }
}

export const agiEngineX = new AGIengineXService();
