
// Orchestrate AGI Chat through Supabase Edge Function.
// This endpoint is public and does not require Authorization headers.

const SUPABASE_URL = "https://hnudinfejowoxlybifqq.supabase.co";
const EDGE_URL = `${SUPABASE_URL}/functions/v1/agienginex`;

export async function sendAGIChatCommand(command: string, options: any = {}) {
  try {
    const resp = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // No auth header needed for public edge function
      },
      body: JSON.stringify({
        // Use endpoint argument for backend
        endpoint: options.endpoint || 'chat',
        message: command,
        ...options
      }),
    });
    const data = await resp.json();
    return data;
  } catch (e: any) {
    return { success: false, error: e?.message || "Network error" };
  }
}

/**
 * Polls live AGIengineX state from backend to reflect real agent performance
 */
export async function fetchLiveAGIState() {
  try {
    const resp = await fetch(`${EDGE_URL}?status=1`);
    const data = await resp.json();
    return data;
  } catch (e: any) {
    return { success: false, error: e?.message || "Network error" };
  }
}

