export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const rawBody = await request.text();

        let parsed: any;
        try {
          parsed = JSON.parse(rawBody);
        } catch {
          return new Response(JSON.stringify({
            role: "assistant",
            content: "❌ Error: Malformed JSON in request body.",
          }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        const { agent, input } = parsed;
        const content = input?.message || input?.goal || 'Hello!';

        let responseMessage = `✅ Agent "${agent}" received: "${content}"`;

        if (agent === 'OpenAI') {
          const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [{ role: "user", content }],
            }),
          });

          const data = await openaiResponse.json();
          responseMessage = data.choices?.[0]?.message?.content || "⚠️ No response from OpenAI.";
        }

        return new Response(JSON.stringify({
          role: "assistant",
          content: responseMessage,
        }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          role: "assistant",
          content: `❌ Internal Error: ${err.message}`,
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("🔧 AGIengineX worker is online.", {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });
  }
};
