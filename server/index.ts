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

  // Debugging fallback
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    return new Response(JSON.stringify({
      role: "assistant",
      content: `❌ OpenAI Error Response: ${JSON.stringify(data, null, 2)}`
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }

  responseMessage = data.choices[0].message.content;
}
