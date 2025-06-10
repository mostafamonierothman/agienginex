import OpenAI from 'openai';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    if (request.method === 'POST' && new URL(request.url).pathname === '/chat') {
      try {
        const { message } = await request.json();

        const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

        const chat = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]
        });

        const reply = chat.choices?.[0]?.message?.content || 'No reply.';
        return new Response(JSON.stringify({ role: 'assistant', content: reply }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (e: any) {
        return new Response(JSON.stringify({ role: 'assistant', content: '❌ Error: ' + e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
