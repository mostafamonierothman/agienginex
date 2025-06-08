
export interface NextMoveResponse {
  next_move: string;
}

export interface OpportunityResponse {
  opportunity: string;
}

export interface LoopIntervalResponse {
  dynamic_interval_sec: number;
}

export interface RunAgentRequest {
  agent_name: string;
  input?: string | null;
}

export interface RunAgentResponse {
  result: string;
  agent_name: string;
  execution_time?: number;
  status: string;
}

class FastAPIService {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string = 'https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex') {
    this.baseUrl = baseUrl;
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU';
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authToken}`
    };
  }

  async getNextMove(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/next_move`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to get next move');
      const data: NextMoveResponse = await response.json();
      console.log('🚀 AGIengineX next_move response:', data);
      return data.next_move;
    } catch (error) {
      console.error('❌ AGIengineX next_move error:', error);
      return 'Backend unavailable - using local agent intelligence';
    }
  }

  async getOpportunity(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/opportunity`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to get opportunity');
      const data: OpportunityResponse = await response.json();
      console.log('🚀 AGIengineX opportunity response:', data);
      return data.opportunity;
    } catch (error) {
      console.error('❌ AGIengineX opportunity error:', error);
      return 'Backend unavailable - using local opportunity detection';
    }
  }

  async getLoopInterval(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/loop_interval`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to get loop interval');
      const data: LoopIntervalResponse = await response.json();
      console.log('🚀 AGIengineX loop_interval response:', data);
      return data.dynamic_interval_sec;
    } catch (error) {
      console.error('❌ AGIengineX loop_interval error:', error);
      return 3.0; // Default fallback
    }
  }

  async runAgent(agentName: string, inputData: string | null = null): Promise<RunAgentResponse> {
    try {
      console.log(`🚀 AGIengineX: Running agent ${agentName} with input:`, inputData);
      
      const response = await fetch(`${this.baseUrl}/run_agent`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          agent_name: agentName,
          input: inputData,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to run agent');
      const data: RunAgentResponse = await response.json();
      console.log('🚀 AGIengineX run_agent response:', data);
      return data;
    } catch (error) {
      console.error('❌ AGIengineX run_agent error:', error);
      return {
        result: 'Backend unavailable - agent execution failed',
        agent_name: agentName,
        status: 'error'
      };
    }
  }

  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        headers: this.getHeaders()
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const fastAPIService = new FastAPIService();
