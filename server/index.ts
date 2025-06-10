import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/run_agent') {
      try {
        // Parse the incoming request body
        const { agent, input } = await request.json();

        // Fallback if no message or goal is provided
        const content = input?.message || input?.goal || 'Hello, AGI!';
        
        // Process the agent logic here
        let responseMessage = 'No agent logic defined.';

        // Placeholder agent handling (can be replaced with actual agent logic)
        if (agent === 'ChatProcessorAgent') {
          responseMessage = `✅ Agent "${agent}" received input: "${content}"`;
        }

        // If OpenAI interaction is required
        if (agent === 'OpenAI') {
          const chat = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content }],
          });
          responseMessage = chat.choices?.[0]?.message?.content || 'No response from OpenAI.';
        }

        // Return the response
        return new Response(
          JSON.stringify({
            response: {
              role: 'assistant',
              content: responseMessage,
            },
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (err: any) {
        // Handle errors gracefully
        return new Response(
          JSON.stringify({
            role: 'assistant',
            content: `❌ Failed to process input: ${err.message}`,
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Default fallback for non-POST requests
    return new Response('Not Found', { status: 404 });
  },
};
