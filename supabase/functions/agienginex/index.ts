
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// === SUPABASE HELPERS === 🚀
async function supabaseInsert(table: string, data: any) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();
  
  if (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
  return result;
}

async function supabaseGetMemory(agentName: string, key: string) {
  const { data, error } = await supabase
    .from('agent_memory')
    .select('memory_value')
    .eq('agent_name', agentName)
    .eq('memory_key', key)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error getting memory:', error);
    return null;
  }
  
  return data && data.length > 0 ? data[0].memory_value : null;
}

async function supabaseSetMemory(agentName: string, key: string, value: string) {
  const data = {
    agent_name: agentName,
    memory_key: key,
    memory_value: value,
    timestamp: new Date().toISOString()
  };
  
  return await supabaseInsert('agent_memory', data);
}

// === AGENTS === 🚀
async function getNextMove(): Promise<string> {
  const lastMove = await supabaseGetMemory("next_move_agent", "last_move");
  const baseMove = lastMove || "Start exploration.";
  const newMove = `Next strategic move after: ${baseMove} → Focus on high-value opportunities`;
  
  await supabaseSetMemory("next_move_agent", "last_move", newMove);
  return newMove;
}

async function getOpportunity(): Promise<string> {
  const lastOpp = await supabaseGetMemory("opportunity_agent", "last_opp");
  const baseOpp = lastOpp || "Identify new market.";
  const newOpp = `Opportunity after: ${baseOpp} → Healthcare AI automation platform`;
  
  await supabaseSetMemory("opportunity_agent", "last_opp", newOpp);
  return newOpp;
}

async function getLoopInterval(): Promise<number> {
  // Dynamic interval based on system load - can be made more sophisticated
  const baseInterval = 3.0;
  const currentTime = new Date().getHours();
  
  // Faster during business hours, slower at night
  if (currentTime >= 9 && currentTime <= 17) {
    return baseInterval * 0.8; // 2.4 seconds during business hours
  }
  return baseInterval * 1.2; // 3.6 seconds during off hours
}

// === SUPERVISOR === 🚀
async function runAgent(agentName: string, inputData: any = {}): Promise<any> {
  console.log(`🚀 Running agent: ${agentName}`);
  
  // Log the request
  await supabaseInsert('supervisor_queue', {
    agent_name: agentName,
    action: 'run',
    input: JSON.stringify(inputData),
    status: 'started',
    timestamp: new Date().toISOString()
  });

  let output: string;
  let executionTime = Date.now();

  try {
    // Run the agent
    if (agentName === "next_move_agent") {
      output = await getNextMove();
    } else if (agentName === "opportunity_agent") {
      output = await getOpportunity();
    } else {
      output = `Unknown agent: ${agentName}`;
    }

    executionTime = Date.now() - executionTime;

    // Log the successful completion
    await supabaseInsert('supervisor_queue', {
      agent_name: agentName,
      action: 'run',
      input: JSON.stringify(inputData),
      status: 'completed',
      output: output,
      timestamp: new Date().toISOString()
    });

    return {
      result: output,
      agent_name: agentName,
      execution_time: executionTime,
      status: 'success'
    };

  } catch (error) {
    console.error(`Error running agent ${agentName}:`, error);
    
    // Log the error
    await supabaseInsert('supervisor_queue', {
      agent_name: agentName,
      action: 'run',
      input: JSON.stringify(inputData),
      status: 'error',
      output: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    });

    return {
      result: `Error running agent: ${error.message}`,
      agent_name: agentName,
      execution_time: Date.now() - executionTime,
      status: 'error'
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // === API ROUTES === 🚀
    if (path === '/' && req.method === 'GET') {
      return new Response(
        JSON.stringify({ 
          message: "🚀 AGIengineX with Supabase is LIVE!", 
          status: "OK",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/next_move' && req.method === 'GET') {
      const result = await getNextMove();
      return new Response(
        JSON.stringify({ next_move: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/opportunity' && req.method === 'GET') {
      const result = await getOpportunity();
      return new Response(
        JSON.stringify({ opportunity: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/loop_interval' && req.method === 'GET') {
      const interval = await getLoopInterval();
      return new Response(
        JSON.stringify({ dynamic_interval_sec: interval }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (path === '/run_agent' && req.method === 'POST') {
      const data = await req.json();
      const agentName = data.agent_name;
      const inputData = data.input || {};
      
      const result = await runAgent(agentName, inputData);
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('AGIengineX Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
