
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'POST' && new URL(request.url).pathname === '/chat') {
      const { message } = await request.json();

      const chat = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }]
      });

      return new Response(
        JSON.stringify({ role: 'assistant', content: chat.choices?.[0]?.message?.content || 'No reply.' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not found', { status: 404 });
  }
};
