
export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        const { agent, input } = await request.json();

        // Fallback if no message is included
        const content = input?.message || input?.goal || 'Hello!';
        
        return new Response(
          JSON.stringify({
            response: {
              role: 'assistant',
              content: `✅ Agent "${agent}" received input: "${content}"`,
            },
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            role: 'assistant',
            content: `❌ Failed to process input: ${err.message}`,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
