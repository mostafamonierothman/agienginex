
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const userId = req.headers.get('X-User-ID') || 'demo_user';
    const body = await req.json();

    console.log('Installing agent:', body);

    // Insert agent into registry
    const { data, error } = await supabase
      .from('supervisor_queue')
      .insert({
        user_id: userId,
        agent_name: body.agent_name,
        action: 'agent_install',
        input: JSON.stringify({
          agent_type: body.agent_type,
          endpoint: body.endpoint || null,
        }),
        status: 'completed',
        output: `Agent ${body.agent_name} installed successfully`,
      });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Agent installed successfully:', body.agent_name);

    return new Response(
      JSON.stringify({ 
        status: 'agent_installed', 
        agent_name: body.agent_name,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Install agent error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to install agent',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
