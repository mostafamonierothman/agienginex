import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (request.method === 'POST' && pathname === '/chat') {
      try {
        const { message } = await request.json();

        const chat = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [{ role: 'user', content: message }]
        });

        const content = chat.choices?.[0]?.message?.content || 'No reply.';
        return new Response(JSON.stringify({ role: 'assistant', content }), {
          headers: { 'Content-Type': 'application/json' },
        });

      } catch (err: any) {
        return new Response(
          JSON.stringify({ role: 'assistant', content: `❌ Error: ${err.message}` }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
