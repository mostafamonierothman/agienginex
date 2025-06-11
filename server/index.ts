export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const start = Date.now();

    // CORS headers (used throughout)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        uptime_ms: Date.now() - start,
        timestamp: new Date().toISOString()
      }), { headers: corsHeaders });
    }

    // Main AI Agent endpoint
    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const rawBody = await request.text();
        let body;

        try {
          body = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({
            success: false,
            error: "❌ Invalid JSON format",
            timestamp: new Date().toISOString()
          }), { status: 400, headers: corsHeaders });
        }

        const agentRaw = body.agent;
        const agent = typeof agentRaw === 'string' ? agentRaw.trim().toLowerCase() : '';
        const input = body.input || {};
        const content = input?.message || input?.goal || input?.prompt || 'Hello!';

        // Debug info
        const debug = {
          agent_received: agentRaw,
          agent_normalized: agent,
          input_fields: Object.keys(input),
          content_preview: content.slice(0, 50),
          has_api_key: !!env.OPENAI_API_KEY
        };

        if (agent === 'openai' || agent === 'gpt' || agent === 'chatgpt') {
          const model = input.model || 'gpt-4o';
          const max_tokens = input.max_tokens || 1000;
          const temperature = input.temperature || 0.7;

          if (!env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({
              success: false,
              error: "❌ Missing OpenAI API key",
              timestamp: new Date().toISOString()
            }), { status: 503, headers: corsHeaders });
          }

          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content }
              ],
              max_tokens,
              temperature
            })
          });

          const data = await response.json();

          return new Response(JSON.stringify({
            success: true,
            agent: "openai",
            model,
            result: data.choices?.[0]?.message?.content || "⚠️ No reply",
            usage: data.usage,
            input_processed: input,
            debug,
            execution_time: Date.now() - start,
            timestamp: new Date().toISOString()
          }), { headers: corsHeaders });
        }

        // Unknown agent
        return new Response(JSON.stringify({
          success: false,
          error: "❌ Unsupported agent",
          received_agent: agentRaw,
          supported_agents: ["openai", "gpt", "chatgpt"],
          timestamp: new Date().toISOString()
        }), { status: 400, headers: corsHeaders });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `❌ Server error: ${err.message}`,
          timestamp: new Date().toISOString()
        }), { status: 500, headers: corsHeaders });
      }
    }

    // Default response
    return new Response(JSON.stringify({
      status: "AGIengineX API",
      version: "1.0.0",
      available_endpoints: {
        "POST /run_agent": "Run AI agent with input",
        "GET /health": "Check worker status"
      },
      timestamp: new Date().toISOString()
    }), { headers: corsHeaders });
  }
};
