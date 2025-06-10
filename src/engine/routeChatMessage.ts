
export async function routeChatMessage(message: string) {
  try {
    const response = await fetch('https://agienginex-production.mostafamonier13.workers.dev/run_agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent: 'OpenAI',
        input: {
          message,
        },
      }),
    });

    if (!response.ok) {
      console.error('❌ Failed to contact AGIengineX backend:', response.statusText);
      return {
        role: 'assistant',
        content: `⚠️ Backend error: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (data?.response?.content) {
      return {
        role: 'assistant',
        content: data.response.content,
      };
    }

    return {
      role: 'assistant',
      content: '⚠️ No valid response from AGIengineX.',
    };
  } catch (error) {
    console.error('❌ Exception in routeChatMessage:', error);
    return {
      role: 'assistant',
      content: '❌ Error connecting to AGIengineX. Please try again later.',
    };
  }
}
