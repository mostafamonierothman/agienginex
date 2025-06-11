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
        timestamp: new Date().toISOString(),
        uptime: Date.now() - start
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
            error: "Invalid JSON payload",
            timestamp: new Date().toISOString()
          }), { status: 400, headers: corsHeaders });
        }

        const agentRaw = body.agent || '';
        const agent = agentRaw.toString().trim().toLowerCase();
        const input = body.input || {};
        const content = input.message || input.goal || input.prompt || 'Hello!';

        const supportedAgents = ['openai', 'gpt', 'chatgpt'];

        if (!supportedAgents.includes(agent)) {
          return new Response(JSON.stringify({
            success: false,
            error: "Unsupported or missing agent",
            received_agent: agentRaw,
            supported_agents: supportedAgents,
            timestamp: new Date().toISOString()
          }), { status: 400, headers: corsHeaders });
        }

        if (!env.OPENAI_API_KEY) {
          return new Response(JSON.stringify({
            success: false,
            error: "OpenAI API key not configured",
            timestamp: new Date().toISOString()
          }), { status: 503, headers: corsHeaders });
        }

        const model = input.model || 'gpt-4o';
        const max_tokens = input.max_tokens || 1000;
        const temperature = input.temperature || 0.7;

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
          model,
          result: data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI",
          usage: data.usage,
          input_processed: input,
          execution_time: Date.now() - start,
          timestamp: new Date().toISOString()
        }), { headers: corsHeaders });
      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `Internal server error: ${err.message}`,
          timestamp: new Date().toISOString()
        }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response(JSON.stringify({
      success: false,
      error: "Not Found",
      available_endpoints: ["/agi", "/next_move", "/run_agent"],
      timestamp: new Date().toISOString()
    }), { status: 404, headers: corsHeaders });
  }
};
