export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === 'POST' && pathname === '/run_agent') {
      try {
        const { message } = await request.json();

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a helpful AGI assistant.' },
              { role: 'user', content: message }
            ]
          }),
        });

        const data = await openaiResponse.json();
        const content = data.choices?.[0]?.message?.content || 'No response received from OpenAI.';

        return new Response(
          JSON.stringify({ role: 'assistant', content }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ role: 'assistant', content: '⚠️ Error occurred in AGIengineX worker.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('🧠 AGIengineX is running.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};
