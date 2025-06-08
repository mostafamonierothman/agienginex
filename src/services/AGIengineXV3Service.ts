
import { supabase } from '@/integrations/supabase/client';

export interface AGIV3Response {
  response: string;
  agent_used?: string;
  user_id?: string;
  session_id?: string;
  timestamp: string;
  tokens_used?: number;
}

export interface UserSession {
  user_id: string;
  session_id: string;
  api_key?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  tokens_remaining: number;
}

export interface AGIReplayEntry {
  id: string;
  user_id: string;
  session_id: string;
  agent_name: string;
  input: any;
  output: string;
  timestamp: string;
  execution_time_ms: number;
}

export interface LLMConfig {
  provider: 'openai' | 'claude' | 'ollama';
  model: string;
  api_key?: string;
  endpoint?: string;
}

class AGIengineXV3Service {
  private baseUrl: string;
  private authToken: string;
  private currentUser: UserSession | null = null;

  constructor() {
    this.baseUrl = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex';
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU';
  }

  private getHeaders(userId?: string, apiKey?: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`,
      'X-User-ID': userId || 'demo_user',
      'X-API-Key': apiKey || '',
      'X-Session-ID': this.generateSessionId()
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // === MULTI-USER AUTHENTICATION === 🚀
  async authenticateUser(apiKey: string): Promise<UserSession | null> {
    try {
      const response = await fetch(`${this.baseUrl}/authenticate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ api_key: apiKey }),
      });
      
      if (!response.ok) return null;
      
      const userData = await response.json();
      this.currentUser = userData;
      return userData;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // === LLM-POWERED CHAT === 🚀
  async chatWithLLM(message: string, llmConfig?: LLMConfig): Promise<AGIV3Response> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/chat-llm`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message,
          llm_config: llmConfig || { provider: 'openai', model: 'gpt-4o-mini' }
        }),
      });
      
      if (!response.ok) throw new Error('LLM chat request failed');
      const data = await response.json();
      
      return {
        response: data.response,
        agent_used: data.agent_used,
        user_id: this.currentUser?.user_id,
        session_id: this.generateSessionId(),
        timestamp: new Date().toISOString(),
        tokens_used: data.tokens_used || 0
      };
    } catch (error) {
      console.error('LLM Chat error:', error);
      return {
        response: 'LLM system temporarily unavailable. Using local intelligence.',
        timestamp: new Date().toISOString()
      };
    }
  }

  // === ENHANCED AGENT EXECUTION === 🚀
  async runAgentV3(agentName: string, inputData: any = {}, userId?: string): Promise<AGIV3Response> {
    try {
      const headers = this.getHeaders(userId || this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/run_agent_v3`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agent_name: agentName,
          input: inputData,
          session_id: this.generateSessionId()
        }),
      });
      
      if (!response.ok) throw new Error('Agent execution failed');
      const data = await response.json();
      
      return {
        response: data.result,
        agent_used: agentName,
        user_id: userId || this.currentUser?.user_id,
        session_id: data.session_id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Agent V3 error:', error);
      return {
        response: 'Agent execution failed. System temporarily unavailable.',
        timestamp: new Date().toISOString()
      };
    }
  }

  // === REPLAY & AUDIT SYSTEM === 🚀
  async getReplayHistory(userId?: string, limit: number = 50): Promise<AGIReplayEntry[]> {
    try {
      const headers = this.getHeaders(userId || this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/replay?limit=${limit}`, {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to get replay history');
      const data = await response.json();
      
      return data.replay_entries || [];
    } catch (error) {
      console.error('Replay history error:', error);
      return [];
    }
  }

  async getSessionAnalytics(sessionId: string): Promise<any> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/analytics/${sessionId}`, {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to get session analytics');
      return await response.json();
    } catch (error) {
      console.error('Session analytics error:', error);
      return { error: 'Analytics unavailable' };
    }
  }

  // === BILLING & SUBSCRIPTION === 🚀
  async getUserBilling(userId?: string): Promise<any> {
    try {
      const headers = this.getHeaders(userId || this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/billing`, {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to get billing info');
      return await response.json();
    } catch (error) {
      console.error('Billing error:', error);
      return {
        subscription_tier: 'free',
        tokens_remaining: 0,
        billing_status: 'error'
      };
    }
  }

  async upgradeSubscription(tier: 'pro' | 'enterprise'): Promise<string | null> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/upgrade`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tier }),
      });
      
      if (!response.ok) throw new Error('Failed to upgrade subscription');
      const data = await response.json();
      
      return data.checkout_url; // Stripe checkout URL
    } catch (error) {
      console.error('Upgrade error:', error);
      return null;
    }
  }

  // === ADVANCED GOAL MANAGEMENT === 🚀
  async createSmartGoal(goalText: string, llmEnhanced: boolean = true): Promise<boolean> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/goals/smart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          goal_text: goalText,
          llm_enhanced: llmEnhanced,
          user_id: this.currentUser?.user_id
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Smart goal creation error:', error);
      return false;
    }
  }

  async getGoalProgress(userId?: string): Promise<any[]> {
    try {
      const headers = this.getHeaders(userId || this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/goals/progress`, {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to get goal progress');
      const data = await response.json();
      
      return data.goals || [];
    } catch (error) {
      console.error('Goal progress error:', error);
      return [];
    }
  }

  // === ENTERPRISE FEATURES === 🚀
  async runMultiAgentChain(chainName: string, config: any = {}): Promise<any> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/enterprise/chain`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          chain_name: chainName,
          config,
          user_id: this.currentUser?.user_id
        })
      });
      
      if (!response.ok) throw new Error('Multi-agent chain failed');
      return await response.json();
    } catch (error) {
      console.error('Enterprise chain error:', error);
      return { error: 'Chain execution failed' };
    }
  }

  async getSystemHealthV3(): Promise<any> {
    try {
      const headers = this.getHeaders(this.currentUser?.user_id);
      
      const response = await fetch(`${this.baseUrl}/health/v3`, {
        headers
      });
      
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'degraded',
        version: 'v3',
        user_authenticated: !!this.currentUser,
        features_available: ['basic_agents', 'local_memory']
      };
    }
  }

  // === UTILITY METHODS === 🚀
  getCurrentUser(): UserSession | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getTokensRemaining(): number {
    return this.currentUser?.tokens_remaining || 0;
  }

  getSubscriptionTier(): string {
    return this.currentUser?.subscription_tier || 'free';
  }
}

export const agiEngineXV3 = new AGIengineXV3Service();
