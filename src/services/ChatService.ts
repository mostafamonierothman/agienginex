
export async function sendChatToAgent(userMessage: string) {
  try {
    const response = await fetch('/run_agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_name: 'llm_executive_agent',
        input: {
          message: userMessage
        }
      })
    });

    const data = await response.json();

    console.log('[ChatService] Agent response:', data);

    return data;
  } catch (error) {
    console.error('[ChatService] Error sending chat to agent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
