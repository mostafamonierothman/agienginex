export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const { agent, input } = await request.json();
        const content = input?.message || input?.goal || 'Hello!';

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
          const output = data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI.";

          return new Response(JSON.stringify({
            success: true,
            agent: "OpenAI",
            result: output,
            input_processed: input,
            execution_time: Date.now(),
            timestamp: new Date().toISOString()
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        // If no agent matched
        return new Response(JSON.stringify({
          success: false,
          error: `❌ Unknown agent: "${agent}"`,
          input_processed: input,
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
