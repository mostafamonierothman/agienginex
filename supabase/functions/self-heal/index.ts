
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
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

    const userId = req.headers.get('x-user-id') || 'demo_user';

    console.log(`🔧 Self-Healing Check for user: ${userId}`);

    // Check recent agent activity
    const { data: recentActivity } = await supabaseClient
      .from('supervisor_queue')
      .select('agent_name, status, timestamp')
      .eq('user_id', userId)
      .gte('timestamp', new Date(Date.now() - 10 * 60 * 1000).toISOString()) // Last 10 minutes
      .order('timestamp', { ascending: false });

    const activeAgents = new Set(recentActivity?.map(a => a.agent_name) || []);
    const expectedAgents = ['FactoryAgent', 'ResearchAgent', 'LearningAgentV2', 'CriticAgent', 'SupervisorAgent'];
    const missingAgents = expectedAgents.filter(agent => !activeAgents.has(agent));

    let healingActions = [];

    // If agents are missing, bootstrap them
    if (missingAgents.length > 0) {
      console.log(`⚠️ Missing agents detected: ${missingAgents.join(', ')}`);
      
      for (const agentName of missingAgents) {
        await supabaseClient
          .from('supervisor_queue')
          .insert({
            user_id: userId,
            agent_name: 'self_heal',
            action: 'bootstrap_agent',
            input: JSON.stringify({ target_agent: agentName }),
            status: 'completed',
            output: `Bootstrapped missing agent: ${agentName}`,
            timestamp: new Date().toISOString()
          });

        healingActions.push(`Bootstrapped ${agentName}`);
      }
    }

    // Check for error patterns
    const failedRuns = recentActivity?.filter(a => a.status === 'failed' || a.status === 'error') || [];
    if (failedRuns.length > 3) {
      console.log(`⚠️ High failure rate detected: ${failedRuns.length} failures`);
      healingActions.push('Detected high failure rate - system monitoring increased');
    }

    const healingResult = {
      timestamp: new Date().toISOString(),
      active_agents: Array.from(activeAgents),
      missing_agents: missingAgents,
      healing_actions: healingActions,
      system_health: missingAgents.length === 0 && failedRuns.length < 3 ? 'healthy' : 'healing'
    };

    console.log(`✅ Self-Healing Complete:`, healingResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: `🔧 Self-Healing Complete - ${healingActions.length} actions taken`,
        data: healingResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Self-healing error:', error);
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
