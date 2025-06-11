export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const rawBody = await request.text(); // Get raw body for debugging
        let body;

        try {
          body = JSON.parse(rawBody); // Try to parse
        } catch (jsonErr) {
          return new Response(JSON.stringify({
            success: false,
            error: "❌ Invalid JSON format",
            raw_body: rawBody,
            timestamp: new Date().toISOString()
          }), { status: 400 });
        }

        const agent = body.agent?.trim();
        const input = body.input || {};
        const content = input?.message || input?.goal || 'Hello!';

        if (agent && agent.toLowerCase() === "openai") {
          const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [{ role: "user", content }]
            })
          });

          const data = await openaiRes.json();

          return new Response(JSON.stringify({
            success: true,
            agent: "OpenAI",
            result: data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI",
            input_processed: input,
            raw_openai_response: data,
            execution_time: Date.now(),
            timestamp: new Date().toISOString()
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          success: false,
          error: `❌ Agent not supported or not matched`,
          received_agent: agent,
          expected: "OpenAI",
          raw_body: rawBody,
          input_processed: input,
          timestamp: new Date().toISOString()
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `❌ Internal server error: ${err.message}`,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("🔧 AGIengineX is running", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
