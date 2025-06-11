export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const body = await request.json();
        const { agent, input } = body || {};

        if (!agent) {
          throw new Error("Agent is not specified in the request.");
        }

        const content = input?.message || input?.goal || 'Hello!';
        let responseMessage = '';

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

          if (data?.choices?.[0]?.message?.content) {
            responseMessage = data.choices[0].message.content;
          } else if (data?.error) {
            throw new Error(`OpenAI API returned: ${JSON.stringify(data.error, null, 2)}`);
          } else {
            responseMessage = "⚠️ No response from OpenAI.";
          }

        } else {
          throw new Error(`Agent "${agent}" is not implemented.`);
        }

        return new Response(JSON.stringify({
          success: true,
          agent,
          result: responseMessage,
          input_processed: input,
          execution_time: Math.random() * 1000,
          timestamp: new Date().toISOString()
        }), {
          headers: { "Content-Type": "application/json" }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({
          success: false,
          error: err.message || "Unknown error occurred",
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("🧠 AGIengineX worker is online and waiting for POST requests to /run_agent.", {
      status: 200,
    });
  }
};
