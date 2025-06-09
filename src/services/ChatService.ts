
export async function sendChatToAgent(userMessage: string) {
  try {
    console.log('[ChatService] Sending message to agent:', userMessage);
    
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

    // Check if response is OK before parsing JSON
    if (!response.ok) {
      console.error('[ChatService] HTTP error:', response.status, response.statusText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    // Check content type
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[ChatService] Non-JSON response:', text.substring(0, 200));
      return {
        success: false,
        error: 'Server returned non-JSON response'
      };
    }

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
