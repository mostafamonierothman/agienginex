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

    console.log(`🗂️ Memory Compression running for user: ${userId}`);

    // Get memory entries count
    const { data: memoryEntries, count } = await supabaseClient
      .from('agent_memory')
      .select('id, timestamp', { count: 'exact' })
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    let compressionActions = [];
    let deletedCount = 0;

    // If we have more than 500 memory entries, compress old ones
    if ((count || 0) > 500) {
      const keepCount = 300; // Keep most recent 300
      const toDeleteCount = (count || 0) - keepCount;
      
      // Get oldest entries to delete
      const { data: oldEntries } = await supabaseClient
        .from('agent_memory')
        .select('id')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(toDeleteCount);

      if (oldEntries && oldEntries.length > 0) {
        const idsToDelete = oldEntries.map(entry => entry.id);
        
        const { error } = await supabaseClient
          .from('agent_memory')
          .delete()
          .in('id', idsToDelete);

        if (!error) {
          deletedCount = oldEntries.length;
          compressionActions.push(`Deleted ${deletedCount} old memory entries`);
        }
      }
    }

    // Clean up old supervisor queue entries (keep last 1000)
    const { data: queueEntries, count: queueCount } = await supabaseClient
      .from('supervisor_queue')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if ((queueCount || 0) > 1000) {
      const queueKeepCount = 500;
      const queueDeleteCount = (queueCount || 0) - queueKeepCount;
      
      const { data: oldQueueEntries } = await supabaseClient
        .from('supervisor_queue')
        .select('id')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })
        .limit(queueDeleteCount);

      if (oldQueueEntries && oldQueueEntries.length > 0) {
        const queueIdsToDelete = oldQueueEntries.map(entry => entry.id);
        
        const { error } = await supabaseClient
          .from('supervisor_queue')
          .delete()
          .in('id', queueIdsToDelete);

        if (!error) {
          compressionActions.push(`Cleaned ${oldQueueEntries.length} old queue entries`);
        }
      }
    }

    // Log compression activity
    await supabaseClient
      .from('supervisor_queue')
      .insert({
        user_id: userId,
        agent_name: 'memory_compression',
        action: 'memory_optimization',
        input: JSON.stringify({ 
          memory_entries_before: count,
          queue_entries_before: queueCount 
        }),
        status: 'completed',
        output: `Memory compression: ${compressionActions.join(', ')}`,
        timestamp: new Date().toISOString()
      });

    const compressionResult = {
      timestamp: new Date().toISOString(),
      actions_taken: compressionActions,
      memory_entries_cleaned: deletedCount,
      total_memory_entries: (count || 0) - deletedCount,
      compression_ratio: count ? (deletedCount / count * 100).toFixed(2) + '%' : '0%'
    };

    console.log(`🗂️ Memory Compression Complete:`, compressionResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: `🗂️ Memory Compression Complete - ${compressionActions.length} optimizations applied`,
        data: compressionResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Memory compression error:', error);
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
