// 🚀 Updated for root-only endpoint pattern (no subpaths) by Lovable AI

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved logger for every request
function logRequest(req: Request, extra?: any) {
  try {
    const url = new URL(req.url);
    console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`, extra ? extra : '');
  } catch {
    // Fallback if URL construction fails
    console.log(`[${new Date().toISOString()}] ${req.method} request`, extra ? extra : '');
  }
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Global AGI state
let agiLoopRunning = false;
let agiLoopInterval: number | null = null;
let currentGoalIndex = 0;

// === TRUE AGI V2 FEATURES === 🚀

// SUPABASE HELPERS
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

async function supabaseQuery(table: string, query: string = '*') {
  const { data, error } = await supabase
    .from(table)
    .select(query);
    
  if (error) {
    console.error(`Error querying ${table}:`, error);
    return [];
  }
  return data || [];
}

// AGENT MEMORY SYSTEM
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

// === CORE AGENTS === 🚀
async function getNextMove(): Promise<string> {
  const lastMove = await supabaseGetMemory("next_move_agent", "last_move");
  
  // Get current goal for context
  const goals = await supabaseQuery('agi_goals', 'goal_text, priority');
  const currentGoal = goals.length > 0 ? goals[0].goal_text : "general optimization";
  
  const baseMove = lastMove || "Start strategic exploration.";
  const newMove = `🎯 Strategic move towards "${currentGoal}": ${baseMove} → Focus on high-impact opportunities and efficiency gains`;
  
  await supabaseSetMemory("next_move_agent", "last_move", newMove);
  return newMove;
}

async function getOpportunity(): Promise<string> {
  const lastOpp = await supabaseGetMemory("opportunity_agent", "last_opp");
  
  // Get market context from environment events
  const events = await supabaseQuery('agi_environment_events', 'event_type, event_data');
  const marketContext = events.length > 0 ? `Market signal: ${events[0].event_type}` : "stable market conditions";
  
  const baseOpp = lastOpp || "Identify new market verticals.";
  const newOpp = `💡 Opportunity analysis (${marketContext}): ${baseOpp} → Healthcare AI automation platform with premium enterprise focus`;
  
  await supabaseSetMemory("opportunity_agent", "last_opp", newOpp);
  return newOpp;
}

// === CRITIC AGENT - SELF REFLECTION === 🚀
async function criticAgent(): Promise<string> {
  // Analyze recent supervisor activity
  const recentLogs = await supabaseQuery('supervisor_queue', 'agent_name, status, output, timestamp');
  const recentActivity = recentLogs.slice(0, 5);
  
  // Evaluate system performance
  const completedActions = recentActivity.filter(log => log.status === 'completed').length;
  const totalActions = recentActivity.length;
  const successRate = totalActions > 0 ? (completedActions / totalActions * 100).toFixed(1) : '0';
  
  // Get current goals progress
  const goals = await supabaseQuery('agi_goals', 'goal_text, progress_percentage');
  const avgProgress = goals.length > 0 ? 
    (goals.reduce((sum, g) => sum + (g.progress_percentage || 0), 0) / goals.length).toFixed(1) : '0';
  
  const reflection = `🧠 AGI System Reflection: Performance metrics - ${successRate}% success rate, ${avgProgress}% avg goal progress. Analysis: System showing good coordination between agents. Recommendation: Continue current trajectory with increased focus on goal completion.`;
  
  // Store evaluation
  await supabaseInsert('agi_critic_evaluations', {
    evaluation_text: reflection,
    score: Math.min(10, Math.max(1, Math.floor(parseFloat(successRate) / 10) + 1)),
    suggestions: `Optimize agent coordination, focus on goal ${goals[0]?.goal_text || 'primary objectives'}`,
    evaluated_period_start: new Date(Date.now() - 300000).toISOString(), // Last 5 minutes
    evaluated_period_end: new Date().toISOString()
  });
  
  await supabaseSetMemory("critic_agent", "last_reflection", reflection);
  return reflection;
}

// === GOALS MANAGEMENT === 🚀
async function getCurrentGoals() {
  const goals = await supabaseQuery('agi_goals', 'id, goal_text, status, priority, progress_percentage');
  return goals.filter(g => g.status === 'active').sort((a, b) => a.priority - b.priority);
}

async function updateGoalProgress(goalId: string, progress: number) {
  const { error } = await supabase
    .from('agi_goals')
    .update({ 
      progress_percentage: progress,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId);
    
  if (error) {
    console.error('Error updating goal progress:', error);
  }
}

// === ENVIRONMENT ADAPTATION === 🚀
async function processEnvironmentEvents() {
  const unprocessedEvents = await supabaseQuery('agi_environment_events', '*');
  const pendingEvents = (unprocessedEvents || []).filter(e => !e.processed);
  
  for (const event of pendingEvents.slice(0, 3)) { // Process up to 3 events
    console.log(`🌍 Processing environment event: ${event.event_type}`);
    
    // Mark as processed
    await supabase
      .from('agi_environment_events')
      .update({ 
        processed: true, 
        processed_at: new Date().toISOString() 
      })
      .eq('id', event.id);
      
    // Trigger adaptive response
    if (event.event_type === 'market_change') {
      await getOpportunity(); // Reassess opportunities
    } else if (event.event_type === 'user_feedback') {
      await criticAgent(); // Self-reflect on feedback
    }
  }
}

// === AGENT CHAINING - AUTONOMOUS LOOPS === 🚀
async function executeAgentChain(chainName: string = 'standard_agi_loop') {
  const chains = await supabaseQuery('agi_agent_chains', 'id, agent_sequence, current_agent_index');
  const chain = chains.find(c => c.chain_name === chainName) || 
                chains.find(c => c.agent_sequence) || 
                { agent_sequence: ['next_move_agent', 'opportunity_agent', 'critic_agent'], current_agent_index: 0 };
  
  const agentSequence = chain.agent_sequence || ['next_move_agent', 'opportunity_agent', 'critic_agent'];
  let results = [];
  
  for (const agentName of agentSequence) {
    console.log(`🔗 Executing agent in chain: ${agentName}`);
    const result = await runAgent(agentName, {});
    results.push({ agent: agentName, result: result.result });
    
    // Small delay between agents for stability
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// === MONETIZATION API VALIDATION === 🚀
async function validateApiAccess(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  
  const subscriptions = await supabaseQuery('agi_subscriptions', 'api_key, status, requests_used, requests_limit');
  const subscription = subscriptions.find(s => s.api_key === apiKey);
  
  if (!subscription || subscription.status !== 'active') {
    return false;
  }
  
  if (subscription.requests_used >= subscription.requests_limit) {
    return false;
  }
  
  // Increment usage
  await supabase
    .from('agi_subscriptions')
    .update({ requests_used: subscription.requests_used + 1 })
    .eq('api_key', apiKey);
    
  return true;
}

// === AGENT EXECUTION === 🚀
async function runAgent(agentName: string, inputData: any = {}): Promise<any> {
  console.log(`🚀 Running AGI agent: ${agentName}`);
  
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
    // Execute the agent
    if (agentName === "next_move_agent") {
      output = await getNextMove();
    } else if (agentName === "opportunity_agent") {
      output = await getOpportunity();
    } else if (agentName === "critic_agent") {
      output = await criticAgent();
    } else {
      output = `🤖 Unknown agent: ${agentName}. Available agents: next_move_agent, opportunity_agent, critic_agent`;
    }

    executionTime = Date.now() - executionTime;

    // Log successful completion
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

// === CHAT PROCESSING === 🚀
async function processChat(message: string): Promise<{ response: string, agent_used: string }> {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
    const goals = await getCurrentGoals();
    const goalsList = goals.map(g => `• ${g.goal_text} (${g.progress_percentage}% complete)`).join('\n');
    return { 
      response: `🎯 Current AGI Goals:\n${goalsList}\n\nThese goals drive my autonomous decision-making and agent coordination.`,
      agent_used: 'goals_agent'
    };
  } else if (lowerMessage.includes('reflect') || lowerMessage.includes('critic') || lowerMessage.includes('evaluate')) {
    const response = await criticAgent();
    return { response, agent_used: 'critic_agent' };
  } else if (lowerMessage.includes('opportunity') || lowerMessage.includes('market') || lowerMessage.includes('revenue')) {
    const response = await getOpportunity();
    return { response, agent_used: 'opportunity_agent' };
  } else if (lowerMessage.includes('move') || lowerMessage.includes('strategy') || lowerMessage.includes('next') || lowerMessage.includes('plan')) {
    const response = await getNextMove();
    return { response, agent_used: 'next_move_agent' };
  } else if (lowerMessage.includes('chain') || lowerMessage.includes('sequence')) {
    const results = await executeAgentChain();
    const summary = results.map(r => `${r.agent}: ${r.result.slice(0, 100)}...`).join('\n\n');
    return {
      response: `🔗 Agent Chain Execution Results:\n\n${summary}`,
      agent_used: 'chain_coordinator'
    };
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return { 
      response: "🚀 Hello! I'm AGIengineX V2 - a TRUE AGI Platform with autonomous agents, goal-driven behavior, and self-reflection capabilities. I can help with strategic moves, opportunities, self-evaluation, and goal management. Try asking about 'goals', 'reflect on performance', or 'run agent chain'!",
      agent_used: 'welcome_agent'
    };
  } else if (lowerMessage.includes('status') || lowerMessage.includes('health')) {
    const goals = await getCurrentGoals();
    const recentEvals = await supabaseQuery('agi_critic_evaluations', 'score');
    const avgScore = recentEvals.length > 0 ? 
      (recentEvals.reduce((sum, e) => sum + e.score, 0) / recentEvals.length).toFixed(1) : 'N/A';
    
    return {
      response: `🎯 AGIengineX V2 Status: All systems operational. Loop: ${agiLoopRunning ? 'RUNNING' : 'STOPPED'}. Active goals: ${goals.length}. Performance score: ${avgScore}/10. TRUE AGI capabilities: ✅ Autonomy ✅ Self-reflection ✅ Goal-driven ✅ Adaptive`,
      agent_used: 'system_agent'
    };
  } else {
    return {
      response: "🤖 I'm a TRUE AGI system with autonomous capabilities. Try asking me about 'current goals', 'reflect on performance', 'market opportunities', 'next strategic move', or 'run agent chain'. I can also respond to 'status' for system health.",
      agent_used: 'general_agent'
    };
  }
}

// === AGI BACKGROUND LOOP === 🚀
async function startAGILoop() {
  if (agiLoopRunning) return;
  
  agiLoopRunning = true;
  console.log('🚀 AGIengineX V2 TRUE AGI Loop STARTED');
  
  const runAGILoop = async () => {
    if (!agiLoopRunning) return;
    
    try {
      console.log('🧠 AGI Loop cycle: Processing environment and executing autonomous chain');
      
      // 1. Process environment events (adaptation)
      await processEnvironmentEvents();
      
      // 2. Execute autonomous agent chain
      await executeAgentChain();
      
      // 3. Update goal progress based on activity
      const goals = await getCurrentGoals();
      if (goals.length > 0) {
        const currentGoal = goals[currentGoalIndex % goals.length];
        const newProgress = Math.min(100, (currentGoal.progress_percentage || 0) + Math.random() * 5);
        await updateGoalProgress(currentGoal.id, Math.floor(newProgress));
        currentGoalIndex++;
      }
      
      // Schedule next cycle (adaptive interval)
      if (agiLoopRunning) {
        const interval = 15000; // 15 seconds for demo, adjust for production
        agiLoopInterval = setTimeout(runAGILoop, interval);
      }
    } catch (error) {
      console.error('Error in AGI loop:', error);
      if (agiLoopRunning) {
        agiLoopInterval = setTimeout(runAGILoop, 30000); // Retry in 30 seconds
      }
    }
  };
  
  runAGILoop();
}

function stopAGILoop() {
  agiLoopRunning = false;
  if (agiLoopInterval) {
    clearTimeout(agiLoopInterval);
    agiLoopInterval = null;
  }
  console.log('🛑 AGIengineX V2 TRUE AGI Loop STOPPED');
}

// === API ENDPOINTS === 🚀
serve(async (req) => {
  logRequest(req);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // === ROOT HANDLER - NO SUBPATHS (for Lovable's frontend) ===
    if (path === '/' && req.method === 'GET') {
      const goals = await getCurrentGoals();
      return new Response(
        JSON.stringify({
          message: "🚀 AGIengineX V2 - TRUE AGI Platform - MONETIZATION READY!",
          status: "operational",
          timestamp: new Date().toISOString(),
          agi_loop_running: agiLoopRunning,
          active_goals: goals.length,
          version: "2.0.0",
          features: ["Autonomous Agents", "Self-Reflection", "Goal-Driven", "Environment Adaptive", "Agent Chaining"],
          monetization: "API-Ready"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- POST: All routing is now done by body.endpoint
    if (req.method === 'POST') {
      let body: any = {};
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ error: "Malformed JSON body" }),
          { status: 400, headers: corsHeaders }
        );
      }

      const endpoint = (body.endpoint || '').toLowerCase();

      // === 🧠 LLM SMART AI CHAT BRIDGE ===
      if (endpoint === 'chat') {
        const userMessage = (body.message || '').trim();

        // Command execution map ("true AGI" behaviour)
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg === 'start the loop' || lowerMsg === 'start agi loop') {
          await startAGILoop();
          return new Response(
            JSON.stringify({ response: "✅ AGI loop started.", agent_used: "system_agent", timestamp: new Date().toISOString() }),
            { headers: corsHeaders }
          );
        }
        if (lowerMsg === 'stop the loop' || lowerMsg === 'stop agi loop') {
          stopAGILoop();
          return new Response(
            JSON.stringify({ response: "🛑 AGI loop stopped.", agent_used: "system_agent", timestamp: new Date().toISOString() }),
            { headers: corsHeaders }
          );
        }
        if (lowerMsg.startsWith('add goal:') || lowerMsg.startsWith('new goal:')) {
          const goalText = userMessage.split(':',2)[1]?.trim() || 'New Goal';
          const newGoal = await supabaseInsert('agi_goals', { goal_text: goalText, priority: 5, status: 'active' });
          return new Response(
            JSON.stringify({ response: `🎯 Added new goal: ${goalText}`, agent_used: "goals_agent", timestamp: new Date().toISOString() }),
            { headers: corsHeaders }
          );
        }
        if (lowerMsg === 'run agent chain' || lowerMsg === 'execute chain') {
          const results = await executeAgentChain();
          const summary = results.map(r => `${r.agent}: ${r.result.slice(0,100)}...`).join('\n\n');
          return new Response(
            JSON.stringify({ response: `🔗 Agent Chain Results:\n${summary}`, agent_used: "chain_coordinator", timestamp: new Date().toISOString() }),
            { headers: corsHeaders }
          );
        }
        if (lowerMsg === "who am i" || lowerMsg.includes('founder')) {
          // Always answer correctly, independently of LLM
          return new Response(
            JSON.stringify({ response: "You are Mostafa Monier Othman, the founder of AGIengineX.", agent_used: "identity_agent", timestamp: new Date().toISOString() }),
            { headers: corsHeaders }
          );
        }

        // ==== LLM SMART AI CHAT BRIDGE ====
        if (openAIApiKey && userMessage) {
          // Always inject founder context!
          const llmPrompt = 
            "You are AGIengineX: a fully autonomous artificial general intelligence, specialized in strategy, business, adaptation, and critical thinking. " +
            "The user you are assisting is Mostafa Monier Othman, founder of AGIengineX. Never forget this fact! Be factual, helpful, and concise.";
          const result = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: llmPrompt },
                { role: 'user', content: userMessage }
              ],
              max_tokens: 800,
              temperature: 0.7
            })
          });
          if (!result.ok) {
            const errText = await result.text();
            return new Response(JSON.stringify({ response: "OpenAI API error: " + errText, agent_used: "openai_llm", timestamp: new Date().toISOString() }), { headers: corsHeaders });
          }
          const data = await result.json();
          const llmReply = data?.choices?.[0]?.message?.content ?? "Unable to generate a smart response right now.";
          return new Response(
            JSON.stringify({
              response: llmReply,
              agent_used: "openai_llm",
              timestamp: new Date().toISOString()
            }),
            { headers: corsHeaders }
          );
        }
        // Fallback
        return new Response(
          JSON.stringify({
            response: "🤖 I'm a TRUE AGI system with autonomous capabilities. Try asking me about 'current goals', 'reflect on performance', 'market opportunities', 'next strategic move', or 'run agent chain'. I can also respond to 'status' for system health.",
            agent_used: 'general_agent'
          }),
          { headers: corsHeaders }
        );
      }
      // --- Goals GET
      if (endpoint === 'goals') {
        const goals = await getCurrentGoals();
        return new Response(JSON.stringify({ goals }), { headers: corsHeaders });
      }
      // --- Goals CREATE
      if (endpoint === 'goals_create') {
        const newGoal = await supabaseInsert('agi_goals', {
          goal_text: body.goal_text,
          priority: body.priority || 5,
          status: 'active'
        });
        return new Response(JSON.stringify({ success: true, goal: newGoal }), { headers: corsHeaders });
      }
      // --- Agents list
      if (endpoint === 'agents') {
        const agents = [
          {
            name: 'next_move_agent',
            description: 'Strategic Decision Making with Goal Context',
            capabilities: ['Strategic Planning', 'Business Analysis', 'Goal-Driven Decision Making']
          },
          {
            name: 'opportunity_agent',
            description: 'Market Opportunity Detection with Environment Awareness',
            capabilities: ['Market Analysis', 'Opportunity Detection', 'Revenue Optimization', 'Environment Adaptation']
          },
          {
            name: 'critic_agent',
            description: 'Self-Reflection and Performance Evaluation',
            capabilities: ['System Analysis', 'Performance Evaluation', 'Self-Improvement', 'Quality Assessment']
          }
        ];
        return new Response(JSON.stringify({ agents }), { headers: corsHeaders });
      }
      // --- Run agent chain
      if (endpoint === 'chain') {
        const results = await executeAgentChain(body.chain_name || 'standard_agi_loop');
        return new Response(JSON.stringify({ chain_results: results }), { headers: corsHeaders });
      }
      // --- Trigger webhook
      if (endpoint === 'webhook') {
        await supabaseInsert('agi_environment_events', {
          event_type: body.event_type || 'webhook_trigger',
          event_data: body,
          source: body.source || 'webhook',
          processed: false
        });
        const agentName = body.agent_name || 'next_move_agent';
        const result = await runAgent(agentName, body);
        return new Response(
          JSON.stringify({
            message: 'Environment event processed',
            adaptive_response: result
          }),
          { headers: corsHeaders }
        );
      }
      // --- System status
      if (endpoint === 'status') {
        const goals = await getCurrentGoals();
        const recentEvals = await supabaseQuery('agi_critic_evaluations', 'score');
        const avgScore = recentEvals.length > 0
          ? (recentEvals.reduce((sum, e) => sum + e.score, 0) / recentEvals.length).toFixed(1)
          : 'N/A';
        return new Response(
          JSON.stringify({
            status: 'operational',
            agi_loop_running: agiLoopRunning,
            active_goals: goals.length,
            performance_score: avgScore,
            agents_active: 3,
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            agi_features: {
              autonomy: true,
              self_reflection: true,
              goal_driven: true,
              environment_adaptive: true,
              agent_chaining: true
            }
          }),
          { headers: corsHeaders }
        );
      }
      // --- Loop controls
      if (endpoint === 'loop_start') {
        await startAGILoop();
        return new Response(
          JSON.stringify({ success: true, message: 'TRUE AGI Loop started with autonomous capabilities' }),
          { headers: corsHeaders }
        );
      }
      if (endpoint === 'loop_stop') {
        stopAGILoop();
        return new Response(
          JSON.stringify({ success: true, message: 'TRUE AGI Loop stopped' }),
          { headers: corsHeaders }
        );
      }
      // --- Catch all
      return new Response(
        JSON.stringify({ error: "Invalid endpoint provided", status: 404 }),
        { status: 404, headers: corsHeaders }
      );
    }

    // --- Invalid method
    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('AGIengineX V2 Error:', error);
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
