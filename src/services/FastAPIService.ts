
export interface NextMoveResponse {
  next_move: string;
}

export interface OpportunityResponse {
  opportunity: string;
}

export interface LoopIntervalResponse {
  dynamic_interval_sec: number;
}

class FastAPIService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  async getNextMove(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/next_move`);
      if (!response.ok) throw new Error('Failed to get next move');
      const data: NextMoveResponse = await response.json();
      return data.next_move;
    } catch (error) {
      console.error('FastAPI next_move error:', error);
      return 'Backend unavailable - using local agent intelligence';
    }
  }

  async getOpportunity(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/opportunity`);
      if (!response.ok) throw new Error('Failed to get opportunity');
      const data: OpportunityResponse = await response.json();
      return data.opportunity;
    } catch (error) {
      console.error('FastAPI opportunity error:', error);
      return 'Backend unavailable - using local opportunity detection';
    }
  }

  async getLoopInterval(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/loop_interval`);
      if (!response.ok) throw new Error('Failed to get loop interval');
      const data: LoopIntervalResponse = await response.json();
      return data.dynamic_interval_sec;
    } catch (error) {
      console.error('FastAPI loop_interval error:', error);
      return 3.0; // Default fallback
    }
  }

  async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const fastAPIService = new FastAPIService();
