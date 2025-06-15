
export async function createGoal(goalData: any, supabase: any) {
  const { goal_text, priority, status } = goalData;
  const result = await supabase.from("agi_goals").insert({
    goal_text: goal_text,
    priority: typeof priority === "number" ? priority : 5,
    status: status || "active",
    progress_percentage: 0,
    created_at: new Date().toISOString(),
  }).select();
  
  if (result.error) throw result.error;
  return result.data;
}

export async function getGoals(supabase: any) {
  const { data, error } = await supabase.from("agi_goals").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
