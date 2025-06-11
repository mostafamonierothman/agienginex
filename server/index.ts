export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const start = Date.now();

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        uptime: Date.now() - start,
        timestamp: new Date().toISOString()
      }), { headers: corsHeaders });
    }

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const rawBody = await request.text();
        let body;

        try {
          body = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({
            success: false,
            error: "Invalid JSON format",
            timestamp: new Date().toISOString()
          }), { status: 400, headers: corsHeaders });
        }

        const agentRaw = body.agent;
        const agent = typeof agentRaw === 'string' ? agentRaw.trim().toLowerCase() : '';

        const input = body.input || {};
        const content = input.message || input.goal || input.prompt || 'Hello!';

        // Check for OpenAI
        if (['openai', 'gpt', 'chatgpt'].includes(agent)) {
          const model = input.model || 'gpt-4o';
          const max_tokens = input.max_tokens || 1000;
          const temperature = input.temperature || 0.7;

          if (!env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({
              success: false,
              error: "OpenAI API key not configured",
              timestamp: new Date().toISOString()
            }), { status: 503, headers: corsHeaders });
          }

          const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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

          const data = await openaiRes.json();

          return new Response(JSON.stringify({
            success: true,
            agent,
            result: data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI",
            usage: data.usage,
            model,
            input_processed: input,
            execution_time: Date.now() - start,
            timestamp: new Date().toISOString()
          }), { headers: corsHeaders });
        }

        // ✅ FIXED LINE: Avoids 'undefined' in result
        return new Response(JSON.stringify({
          success: true,
          result: `Agent ${agent || 'unknown'} executed successfully`,
          input_processed: input,
          timestamp: new Date().toISOString()
        }), { headers: corsHeaders });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `Server error: ${err.message}`,
          timestamp: new Date().toISOString()
        }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({
      status: "AGIengineX API Ready",
      endpoints: {
        "POST /run_agent": "Execute AI tasks",
        "GET /health": "Health check"
      },
      timestamp: new Date().toISOString()
    }), { headers: corsHeaders });
  }
};
