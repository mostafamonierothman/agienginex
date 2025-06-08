
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class BrowserAgent {
  async browse(url: string): Promise<string> {
    try {
      // Use a CORS proxy for web scraping (browser limitation workaround)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('No content retrieved');
      }

      // Extract text content (basic parsing)
      const textContent = data.contents
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return textContent.substring(0, 2000); // Limit to 2000 characters
    } catch (error) {
      return `Error browsing ${url}: ${error.message}`;
    }
  }

  async searchWeb(query: string): Promise<string> {
    try {
      // Simple DuckDuckGo search (no API key required)
      const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const content = await this.browse(searchUrl);
      return `Search results for "${query}": ${content.substring(0, 1000)}`;
    } catch (error) {
      return `Search failed: ${error.message}`;
    }
  }
}

export async function BrowserAgentRunner(context: AgentContext): Promise<AgentResponse> {
  try {
    const browserAgent = new BrowserAgent();
    const queries = [
      'latest AI developments 2024',
      'AGI research breakthroughs',
      'autonomous systems trends'
    ];
    
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const result = await browserAgent.searchWeb(randomQuery);

    // Log to supervisor queue
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'browser_agent',
        agent_name: 'browser_agent',
        action: 'web_search',
        input: JSON.stringify({ query: randomQuery }),
        status: 'completed',
        output: result
      });

    return {
      success: true,
      message: `🌐 BrowserAgent searched: "${randomQuery}" → ${result.substring(0, 200)}...`,
      data: { query: randomQuery, result },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ BrowserAgent error: ${error.message}`
    };
  }
}
