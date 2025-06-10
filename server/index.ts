export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const { agent, input } = await request.json();
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
          response: { role: "assistant", content: responseMessage }
        }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          role: "assistant",
          content: `❌ Error: ${err.message}`,
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("🔧 AGIengineX worker is online.", { status: 200 });
  }
};
