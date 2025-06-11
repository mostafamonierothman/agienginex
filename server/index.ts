export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const body = await request.json();
        const agent = body.agent;
        const input = body.input || {};
        const content = input.message || input.goal || 'Hello!';

        if (agent === 'OpenAI') {
          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [{ role: 'user', content }]
            })
          });

          const data = await openaiResponse.json();
          const responseContent = data.choices?.[0]?.message?.content || '⚠️ No response from OpenAI.';

          return new Response(JSON.stringify({
            success: true,
            agent: 'OpenAI',
            result: responseContent,
            input_processed: input,
            execution_time: Date.now(),
            timestamp: new Date().toISOString()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // fallback
        return new Response(JSON.stringify({
          success: false,
          error: `Unknown agent: ${agent}`,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `Exception: ${err.message}`,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        });
      }
    }

    return new Response('🔧 AGIengineX worker is online.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
