// server/api/agentRunner.ts

export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/agi") {
    return new Response(
      JSON.stringify({
        success: true,
        agent: "AGIengineX",
        message: "AGIaaS API is LIVE 🚀",
        timestamp: Date.now(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (url.pathname === "/next_move") {
    const nextMove = "Move: Execute strategic task.";
    return new Response(JSON.stringify({ next_move: nextMove }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Not Found", { status: 404 });
}
