
export async function processAGIChat(prompt: string, openAIApiKey: string, supabase: any) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are AGIengineX, a helpful, decisive AI business executive." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response!";
    
    // Log chat to agent_memory for replay/debug
    await supabase.from("agent_memory").insert({
      user_id: "chat_user",
      agent_name: "agi_engine_x",
      memory_key: "chat_message",
      memory_value: prompt,
      timestamp: new Date().toISOString(),
    });
    await supabase.from("agent_memory").insert({
      user_id: "agi_engine_x",
      agent_name: "agi_engine_x",
      memory_key: "chat_reply",
      memory_value: content,
      timestamp: new Date().toISOString(),
    });
    
    return content;
  } catch (err) {
    throw new Error(`OpenAI error: ${err?.message || String(err)}`);
  }
}

export async function generateCode(codePrompt: string, openAIApiKey: string, supabase: any) {
  try {
    const openAIMessages = [
      { role: "system", content: "You are an expert AI programming assistant. Output ONLY code, no explanation, no markdown wrapping." },
      { role: "user", content: codePrompt }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openAIMessages,
        max_tokens: 900,
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const code = data.choices?.[0]?.message?.content || "No code generated!";

    await supabase.from("agent_memory").insert({
      user_id: "chat_user",
      agent_name: "agi_engine_x",
      memory_key: "code_gen_prompt",
      memory_value: codePrompt,
      timestamp: new Date().toISOString(),
    });
    await supabase.from("agent_memory").insert({
      user_id: "agi_engine_x",
      agent_name: "agi_engine_x",
      memory_key: "code_generated",
      memory_value: code,
      timestamp: new Date().toISOString(),
    });

    return code;
  } catch (err) {
    throw new Error(`Code generation error: ${err?.message || String(err)}`);
  }
}
