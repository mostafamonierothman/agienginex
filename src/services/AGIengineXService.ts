
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
      console.log('🚀 AGIengineX: Sending chat message:', message);
      
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message }),
      });
      
      console.log('📡 AGIengineX: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ AGIengineX: Request failed:', errorText);
        throw new Error(`AGI request failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ AGIengineX: Success response:', data);
      
      return {
        response: data.response || data.message || 'AGI processed your message',
        agent_used: data.agent_used || 'agienginex',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('💥 AGIengineX: Chat error:', error);
      
      // Fallback to local AGI simulation
      const fallbackResponse = this.generateLocalAGIResponse(message);
      
      return {
        response: `🤖 AGI Local Mode: ${fallbackResponse}`,
        agent_used: 'local_agi',
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateLocalAGIResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm AGIengineX - your advanced AI assistant with autonomous capabilities. I can help with strategic planning, opportunities, and self-reflection.";
    } else if (lowerMessage.includes('status') || lowerMessage.includes('health')) {
      return "🎯 AGI Status: All systems operational. Features: ✅ Autonomy ✅ Self-reflection ✅ Goal-driven ✅ Adaptive learning";
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
      return "🎯 I can help you set and track goals. My autonomous agents work continuously to achieve objectives through strategic planning and opportunity detection.";
    } else if (lowerMessage.includes('opportunity') || lowerMessage.includes('market')) {
      return "💡 Opportunity Analysis: I detect market opportunities through continuous research and environmental monitoring. Current focus: AI automation platforms with enterprise potential.";
    } else if (lowerMessage.includes('reflect') || lowerMessage.includes('evaluate')) {
      return "🧠 Self-Reflection: I continuously evaluate my performance, learn from interactions, and adapt my strategies. Current performance: Operating at optimal efficiency.";
    } else {
      return `I understand you're asking about: "${message}". As an AGI system, I can help with strategic planning, opportunity detection, goal management, and self-reflection. What specific area would you like to explore?`;
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

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      console.log('🔍 Testing AGI connection...');
      const response = await fetch(this.baseUrl, {
        headers: this.getHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          connected: true,
          message: `✅ AGI Connected: ${data.message || 'AGIengineX operational'}`
        };
      } else {
        return {
          connected: false,
          message: `❌ Connection failed: ${response.status}`
        };
      }
    } catch (error) {
      return {
        connected: false,
        message: `❌ Connection error: ${error.message}`
      };
    }
  }
}

export const agiEngineX = new AGIengineXService();
