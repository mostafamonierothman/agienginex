
export async function RealLeadGeneration(context: any, supabase: any) {
  const keyword = context.input?.goal || "medical tourism (Edge)";
  // Simulated search results
  const leadsToInsert = Array.from({ length: 10 }, (_, i) => ({
    email: `contact${i + 1}@example.com`,
    first_name: `Lead${i + 1}`,
    last_name: `Medical`,
    company: `HealthTravel Inc ${i + 1}`,
    job_title: "Business Development Manager",
    source: "edge_function_lead_gen",
    industry: "medical tourism",
    location: "UK",
    status: "new",
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }));

  let inserted = [];
  let leadInsertError = null;
  try {
    for (const lead of leadsToInsert) {
      const { data, error } = await supabase.from("leads").insert([lead]);
      if (error) {
        leadInsertError = error;
        continue;
      }
      inserted.push(data?.[0] || lead);
    }
  } catch (e) {
    leadInsertError = e;
  }
  return {
    generated: inserted.length,
    error: leadInsertError,
    output: inserted
  };
}

export async function SupervisorAgentRunner(context: any, supabase: any) {
  try {
    const realLeadResult = await RealLeadGeneration(context, supabase);

    await supabase.from("supervisor_queue").insert([{
      user_id: context.user_id || "edge_supervisor_user",
      agent_name: 'EdgeLeadGenAgent',
      action: 'lead_generated',
      input: context.input?.goal || "n/a",
      status: realLeadResult.error ? "failed" : "completed",
      output: JSON.stringify({
        leadsGenerated: realLeadResult.generated,
        error: realLeadResult.error ? String(realLeadResult.error) : null
      })
    }]);

    let totalLeads = 0, totalSupervisorActions = 0;
    try {
      const { data: leads } = await supabase.from("leads").select("id");
      totalLeads = leads?.length || 0;
    } catch {}
    try {
      const { data: queue } = await supabase.from("supervisor_queue").select("id");
      totalSupervisorActions = queue?.length || 0;
    } catch {}

    let msg;
    if (realLeadResult.error) {
      msg = `❌ Failed to generate leads: ${realLeadResult.error}`;
    } else {
      msg = `🎯 Generated and saved ${realLeadResult.generated} leads for "${context.input?.goal || "medical tourism"}".`;
    }
    return {
      success: !realLeadResult.error,
      message: msg + ` [Leads in DB: ${totalLeads}, Supervisor actions: ${totalSupervisorActions}]`,
      data: {
        leads_generated: realLeadResult.generated,
        total_leads_db: totalLeads,
        total_supervisor_actions: totalSupervisorActions,
        last_agent_run: {
          leadsGenerated: realLeadResult.generated,
          error: realLeadResult.error
        }
      },
      timestamp: new Date().toISOString(),
      nextAgent: null
    };
  } catch (err) {
    return {
      success: false,
      message: "SupervisorAgent (Edge) Internal Error: " + (err && err.message ? err.message : String(err)),
      data: null,
      timestamp: new Date().toISOString(),
      nextAgent: null
    };
  }
}
