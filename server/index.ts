export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const bodyText = await request.text(); // First, get the raw body
        let body;

        try {
          body = JSON.parse(bodyText); // Parse JSON from raw text
        } catch (e) {
          return new Response(JSON.stringify({
            success: false,
            error: "❌ Invalid JSON body",
            raw: bodyText,
            timestamp: new Date().toISOString()
          }), { status: 400 });
        }

        const agent = body.agent?.trim();
        const input = body.input || {};
        const content = input?.message || input?.goal || 'Hello!';

        // Show what agent was received
        if (agent?.toLowerCase() === 'openai') {
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
            input_processed: input,
            result: data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI",
            raw_response: data,
            timestamp: new Date().toISOString()
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        // 🚨 Agent did not match — log what was received
        return new Response(JSON.stringify({
          success: false,
          error: `❌ Unsupported agent or missing logic.`,
          received_agent: agent,
          known_agents: ["OpenAI"],
          input_processed: input,
          raw_body: bodyText,
          timestamp: new Date().toISOString()
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: `❌ Server error: ${err.message}`,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("🔧 AGIengineX is alive!", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};
