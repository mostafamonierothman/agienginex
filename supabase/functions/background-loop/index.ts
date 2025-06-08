
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
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const userId = req.headers.get('X-User-ID') || 'demo_user';

    console.log('🔄 Background loop execution started for user:', userId);

    // Get active goals
    const { data: goals } = await supabase
      .from('agi_goals_enhanced')
      .select('goal_text')
      .eq('status', 'active')
      .order('priority', { ascending: false })
      .limit(1);

    const currentGoal = goals?.[0]?.goal_text || 'Autonomous system evolution';

    let nextMove = '';
    let reflection = '';

    if (openAIKey) {
      // Enhanced AI-powered background loop
      try {
        const nextMoveResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a Strategic AI Agent in an autonomous background loop. Generate the next strategic move based on current goals and system state.'
              },
              {
                role: 'user',
                content: `Current Goal: ${currentGoal}\n\nGenerate the next strategic move for autonomous system evolution:`
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          }),
        });

        const nextMoveData = await nextMoveResponse.json();
        nextMove = nextMoveData.choices[0].message.content;

        // Generate reflection
        const reflectionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a Critic AI Agent. Analyze and reflect on the strategic move just made.'
              },
              {
                role: 'user',
                content: `Strategic Move: ${nextMove}\n\nProvide critical analysis and reflection:`
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          }),
        });

        const reflectionData = await reflectionResponse.json();
        reflection = reflectionData.choices[0].message.content;

        console.log('🧠 OpenAI-enhanced background loop completed');
      } catch (openAIError) {
        console.error('OpenAI error, falling back to local mode:', openAIError);
        nextMove = `Auto-loop strategic move: ${currentGoal} - Focus on system optimization and goal achievement`;
        reflection = `Background loop reflection: Strategic move executed successfully. System continues autonomous evolution.`;
      }
    } else {
      // Local simulation mode
      nextMove = `Auto-loop strategic move: ${currentGoal} - Focus on system optimization and goal achievement`;
      reflection = `Background loop reflection: Strategic move executed successfully. System continues autonomous evolution.`;
      console.log('🤖 Local mode background loop completed');
    }

    // Log the background loop execution
    const { data, error } = await supabase.from('supervisor_queue').insert([
      {
        user_id: userId,
        agent_name: 'next_move_agent',
        action: 'background_loop',
        input: JSON.stringify({ goal: currentGoal }),
        status: 'completed',
        output: nextMove,
        timestamp: new Date().toISOString(),
      },
      {
        user_id: userId,
        agent_name: 'critic_agent',
        action: 'background_loop',
        input: JSON.stringify({ move: nextMove }),
        status: 'completed',
        output: reflection,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('✅ Background loop data logged successfully');

    return new Response(
      JSON.stringify({
        status: 'loop_completed',
        move: nextMove,
        reflection: reflection,
        goal: currentGoal,
        timestamp: new Date().toISOString(),
        openai_enhanced: !!openAIKey
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Background loop error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Background loop execution failed',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
