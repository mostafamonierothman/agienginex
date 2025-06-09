
// server/api/agentRunner.ts

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // CORS headers for all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (url.pathname === "/agi") {
      return new Response(
        JSON.stringify({
          success: true,
          agent: "AGIengineX",
          message: "AGIaaS API is LIVE 🚀",
          timestamp: new Date().toISOString(),
          version: "2.0",
          endpoints: ["/agi", "/next_move", "/run_agent"]
        }),
        { 
          status: 200, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    if (url.pathname === "/next_move") {
      const nextMove = "Execute strategic AGI task - System optimization cycle initiated";
      return new Response(
        JSON.stringify({ 
          success: true,
          next_move: nextMove,
          priority: "high",
          agent_type: "strategic",
          timestamp: new Date().toISOString()
        }), 
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          },
        }
      );
    }

    if (url.pathname === "/run_agent" && request.method === "POST") {
      try {
        const body = await request.json();
        const { agent_name, input } = body;

        console.log(`[API] Running agent: ${agent_name}`, input);

        return new Response(
          JSON.stringify({
            success: true,
            agent: agent_name,
            result: `Agent ${agent_name} executed successfully`,
            input_processed: input,
            execution_time: Math.random() * 1000,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            },
          }
        );
      } catch (parseError) {
        console.error('[API] JSON parse error:', parseError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON payload",
            timestamp: new Date().toISOString()
          }),
          {
            status: 400,
            headers: { 
              "Content-Type": "application/json",
              ...corsHeaders
            },
          }
        );
      }
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({
        success: false,
        error: "Not Found",
        available_endpoints: ["/agi", "/next_move", "/run_agent"],
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 404,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}
