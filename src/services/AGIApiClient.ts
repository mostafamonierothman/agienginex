
import { supabase } from '@/integrations/supabase/client';

export interface AgentInstallRequest {
  agent_name: string;
  agent_type: string;
  endpoint?: string;
}

export interface RunAgentRequest {
  agent_name: string;
  input: any;
}

export class AGIApiClient {
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1';
    this.apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU';
  }

  private getHeaders(userId: string = 'demo_user') {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'X-User-ID': userId,
      'Content-Type': 'application/json',
    };
  }

  async callFunction(
    functionName: string,
    method: 'GET' | 'POST' = 'GET',
    userId: string = 'demo_user',
    body?: any
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/${functionName}`, {
        method,
        headers: this.getHeaders(userId),
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`AGI API Error (${functionName}):`, error);
      throw error;
    }
  }

  // Core AGI V4 Functions
  async runAgent(request: RunAgentRequest, userId?: string) {
    return this.callFunction('agi-v4-core/run_agent', 'POST', userId, request);
  }

  async listAgents(userId?: string) {
    return this.callFunction('agi-v4-core/list_agents', 'GET', userId);
  }

  async learningLoop(userId?: string) {
    return this.callFunction('agi-v4-core/learning_loop', 'POST', userId);
  }

  async getReplay(userId?: string) {
    return this.callFunction('agi-v4-core/replay', 'GET', userId);
  }

  async triggerWebhook(agentName: string, input: any = {}, userId?: string) {
    return this.callFunction('agi-v4-core/webhook', 'POST', userId, {
      agent_name: agentName,
      input,
    });
  }

  // Agent Marketplace Functions
  async installAgent(request: AgentInstallRequest, userId?: string) {
    return this.callFunction('install-agent', 'POST', userId, request);
  }

  async uninstallAgent(agentName: string, userId?: string) {
    return this.callFunction('uninstall-agent', 'POST', userId, {
      agent_name: agentName,
    });
  }

  // Background Loop
  async triggerBackgroundLoop(userId?: string) {
    return this.callFunction('background-loop', 'POST', userId);
  }

  // Status and Health
  async getSystemStatus(userId?: string) {
    return this.callFunction('agi-v4-core', 'GET', userId);
  }
}

export const agiApiClient = new AGIApiClient();
