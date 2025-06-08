
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

    console.log(`🏆 Promotion Engine running for user: ${userId}`);

    // Get recent agent performance data
    const { data: agentActivity } = await supabaseClient
      .from('supervisor_queue')
      .select('agent_name, status, timestamp')
      .eq('user_id', userId)
      .gte('timestamp', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .order('timestamp', { ascending: false });

    // Calculate agent performance scores
    const agentStats = new Map();
    agentActivity?.forEach(activity => {
      const agent = activity.agent_name;
      if (!agentStats.has(agent)) {
        agentStats.set(agent, { runs: 0, successes: 0, failures: 0 });
      }
      const stats = agentStats.get(agent);
      stats.runs++;
      if (activity.status === 'completed') {
        stats.successes++;
      } else if (activity.status === 'failed' || activity.status === 'error') {
        stats.failures++;
      }
    });

    // Calculate performance scores and promote top performers
    const performanceRanking = Array.from(agentStats.entries())
      .map(([agent, stats]) => ({
        agent,
        score: stats.runs > 0 ? (stats.successes / stats.runs) * 100 : 0,
        runs: stats.runs,
        successes: stats.successes
      }))
      .sort((a, b) => b.score - a.score);

    const topPerformers = performanceRanking.slice(0, 3);
    const promotedAgents = [];

    // Store promotion data
    for (const performer of topPerformers) {
      await supabaseClient
        .from('agent_memory')
        .insert({
          user_id: userId,
          agent_name: performer.agent,
          memory_key: 'promotion_score',
          memory_value: performer.score.toString(),
          timestamp: new Date().toISOString()
        });

      promotedAgents.push({
        agent: performer.agent,
        score: performer.score,
        rank: promotedAgents.length + 1
      });
    }

    // Log promotion results
    await supabaseClient
      .from('supervisor_queue')
      .insert({
        user_id: userId,
        agent_name: 'promotion_engine',
        action: 'agent_promotion',
        input: JSON.stringify({ evaluated_agents: performanceRanking.length }),
        status: 'completed',
        output: `Promoted ${promotedAgents.length} top performing agents`,
        timestamp: new Date().toISOString()
      });

    console.log(`🏆 Promotion Engine Complete - Top performers:`, promotedAgents);

    return new Response(
      JSON.stringify({
        success: true,
        message: `🏆 Promotion Engine Complete - ${promotedAgents.length} agents promoted`,
        data: {
          top_performers: promotedAgents,
          total_evaluated: performanceRanking.length,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Promotion engine error:', error);
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
