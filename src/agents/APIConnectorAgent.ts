
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class APIConnectorAgent {
  async callAPI(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any): Promise<any> {
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  async testPublicAPI(): Promise<any> {
    // Test with a free public API
    const apis = [
      'https://httpbin.org/json',
      'https://jsonplaceholder.typicode.com/posts/1',
      'https://api.github.com/zen'
    ];

    const randomAPI = apis[Math.floor(Math.random() * apis.length)];
    return await this.callAPI(randomAPI);
  }
}

export async function APIConnectorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  try {
    const apiAgent = new APIConnectorAgent();
    const result = await apiAgent.testPublicAPI();

    // Log to supervisor queue
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'api_connector_agent',
        agent_name: 'api_connector_agent',
        action: 'test_public_api',
        input: JSON.stringify({ action: 'test_random_api' }),
        status: 'completed',
        output: JSON.stringify(result).substring(0, 500)
      });

    return {
      success: true,
      message: `🔗 APIConnectorAgent tested public API → ${JSON.stringify(result).substring(0, 100)}...`,
      data: { result },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ APIConnectorAgent error: ${error.message}`
    };
  }
}
