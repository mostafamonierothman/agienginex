
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("🚀 Auto-Startup Triggered → Initializing AGI System...");

    // Log startup event
    await supabaseClient
      .from('supervisor_queue')
      .insert({
        user_id: 'system',
        agent_name: 'auto_startup',
        action: 'system_initialization',
        input: JSON.stringify({ trigger: 'auto_startup' }),
        status: 'completed',
        output: 'Auto-startup sequence initiated',
        timestamp: new Date().toISOString()
      });

    // Check if core agents are registered
    const { data: agents } = await supabaseClient
      .from('supervisor_queue')
      .select('agent_name')
      .limit(1);

    const systemStatus = {
      startup_time: new Date().toISOString(),
      agents_initialized: agents?.length || 0,
      status: 'ready'
    };

    console.log("✅ Auto-Startup Complete:", systemStatus);

    return new Response(
      JSON.stringify({
        success: true,
        message: "✅ Auto-Startup Complete - AGI System Ready",
        data: systemStatus
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Auto-startup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
