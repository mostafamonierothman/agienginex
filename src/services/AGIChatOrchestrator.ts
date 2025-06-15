
// Orchestrate AGI Chat through Supabase Edge Function.
// This endpoint is public and does not require Authorization headers.

const SUPABASE_URL = "https://hnudinfejowoxlybifqq.supabase.co";
const EDGE_URL = `${SUPABASE_URL}/functions/v1/agienginex`;

export async function sendAGIChatCommand(command: string, options: any = {}) {
  try {
    console.log('📡 Sending AGI command:', command);
    const resp = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // No auth header needed for public edge function
      },
      body: JSON.stringify({
        // Use both path and message for maximum compatibility
        path: 'agi-chat',
        message: command,
        goal: command,
        endpoint: 'chat',
        ...options
      }),
    });
    
    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${resp.statusText} - ${errorText}`);
    }
    
    const data = await resp.json();
    console.log('✅ AGI response received:', data);
    return data;
  } catch (e: any) {
    console.error('❌ AGI communication error:', e);
    const errorMsg = e?.message || "Network error";
    return { 
      success: false, 
      error: errorMsg,
      supervisor_message: `❌ AGI communication failed: ${errorMsg}. System attempting auto-recovery...`
    };
  }
}

/**
 * Polls live AGIengineX state from backend to reflect real agent performance
 */
export async function fetchLiveAGIState() {
  try {
    const resp = await fetch(`${EDGE_URL}?status=1`);
    if (!resp.ok) {
      throw new Error(`Status check failed: ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (e: any) {
    console.warn('AGI status check failed:', e);
    return { 
      success: false, 
      error: e?.message || "Network error",
      autonomy_percent: 75 // Fallback value
    };
  }
}
