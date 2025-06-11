if (request.method === 'POST' && url.pathname === '/run_agent') {
  try {
    const rawBody = await request.text();
    const logs: any = { received_raw: rawBody };

    let body;
    try {
      body = JSON.parse(rawBody);
      logs.parsed_body = body;
    } catch (err) {
      logs.json_error = err.message;
      return new Response(JSON.stringify({ success: false, error: "Invalid JSON", logs }), { status: 400, headers: corsHeaders });
    }

    const agent = (body.agent || '').toString().trim().toLowerCase();
    const input = body.input || {};
    const content = input.message || input.goal || input.prompt || 'Hello!';
    logs.agent = agent;

    if (!['openai', 'gpt', 'chatgpt'].includes(agent)) {
      return new Response(JSON.stringify({ success: false, error: "Unsupported agent", logs }), { status: 400, headers: corsHeaders });
    }

    if (!env.OPENAI_API_KEY) {
      logs.env_key = !!env.OPENAI_API_KEY;
      return new Response(JSON.stringify({ success: false, error: "Missing OpenAI key", logs }), { status: 503, headers: corsHeaders });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: input.model || 'gpt-4o',
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content }
        ],
        max_tokens: input.max_tokens || 1000,
        temperature: input.temperature || 0.7
      })
    });

    const data = await openaiRes.json();
    logs.openai_response = data;

    return new Response(JSON.stringify({
      success: true,
      agent,
      result: data.choices?.[0]?.message?.content || "⚠️ No reply from OpenAI",
      logs
    }), { headers: corsHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      logs: { err: err.message }
    }), { status: 500, headers: corsHeaders });
  }
}
