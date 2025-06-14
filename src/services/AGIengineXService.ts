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
      
      // Enhanced fallback to local AGI simulation
      const fallbackResponse = this.generateEnhancedLocalAGIResponse(message);
      
      return {
        response: fallbackResponse,
        agent_used: 'local_agi_enhanced',
        timestamp: new Date().toISOString()
      };
    }
  }

  private generateEnhancedLocalAGIResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Identity and founder questions
    if (lowerMessage.includes('who am i') || lowerMessage.includes('who are you')) {
      return "🤖 I am AGIengineX, an advanced Artificial General Intelligence system created by the AGIengineX development team. I'm designed with autonomous capabilities for strategic planning, opportunity detection, goal management, and self-reflection. I can help you with business strategy, goal setting, market analysis, and decision-making.";
    } else if (lowerMessage.includes('founder') || lowerMessage.includes('creator') || lowerMessage.includes('who created')) {
      return "🚀 AGIengineX was founded and developed by a team of AI researchers and engineers focused on creating true AGI systems. The project aims to build autonomous AI that can think strategically, adapt to environments, and continuously improve itself while helping users achieve their goals.";
    } else if (lowerMessage.includes('what are you') || lowerMessage.includes('introduce yourself')) {
      return "🧠 I'm AGIengineX - an Artificial General Intelligence platform with autonomous agents, self-reflection capabilities, and goal-driven behavior. Unlike narrow AI, I can think strategically across multiple domains, learn from interactions, and adapt my approach based on your needs and environmental changes.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "👋 Hello! I'm AGIengineX - your advanced AI assistant with autonomous capabilities. I specialize in strategic planning, opportunity detection, goal management, and self-reflection. How can I help you achieve your objectives today?";
    } else if (lowerMessage.includes('status') || lowerMessage.includes('health')) {
      return "🎯 AGI Status: All core systems operational. Currently running in local mode due to connectivity issues. Features active: ✅ Strategic Planning ✅ Goal Management ✅ Self-Reflection ✅ Opportunity Analysis. Ready to assist with your strategic objectives!";
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
      return "🎯 Goal Management: I can help you define, track, and achieve your objectives through strategic planning and continuous monitoring. My autonomous agents work to identify opportunities and optimize paths to success. What goals would you like to work on?";
    } else if (lowerMessage.includes('opportunity') || lowerMessage.includes('market')) {
      return "💡 Opportunity Analysis: I continuously scan for market opportunities, business potential, and strategic advantages. Current focus areas include AI automation, digital transformation, and emerging technologies. What sector interests you?";
    } else if (lowerMessage.includes('reflect') || lowerMessage.includes('evaluate')) {
      return "🧠 Self-Reflection Mode: I regularly evaluate my performance, learn from interactions, and adapt strategies. Current assessment: Operating efficiently in local mode, maintaining strategic capabilities while working to restore full connectivity.";
    } else if (lowerMessage.includes('capabilities') || lowerMessage.includes('what can you do')) {
      return "⚡ AGIengineX Capabilities:\n🎯 Strategic Planning & Decision Making\n💡 Opportunity Detection & Market Analysis\n🧠 Self-Reflection & Performance Optimization\n📊 Goal Setting & Progress Tracking\n🤝 Multi-Agent Collaboration\n🔄 Autonomous Learning & Adaptation\n\nWhat would you like to explore?";
    } else {
      return `🤖 AGIengineX Processing: "${message}"\n\nI understand your query and can provide strategic insights on this topic. As an AGI system, I approach problems holistically, considering multiple perspectives and potential outcomes. Would you like me to:\n\n• Analyze strategic implications\n• Identify opportunities\n• Suggest actionable steps\n• Evaluate potential risks\n\nWhat specific aspect interests you most?`;
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
}

export const agiEngineX = new AGIengineXService();
