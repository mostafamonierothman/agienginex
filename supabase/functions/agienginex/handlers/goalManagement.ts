
export function insertAGIGoal(goal: string, priority: number) {
  return {
    id: Date.now().toString(),
    goal_text: goal,
    priority: priority ?? 5,
  };
}

export function getAGIGoals() {
  return [
    { id: "1", goal_text: "Increase lead generation by 20%", priority: 5, status: "active", progress_percentage: 35 },
    { id: "2", goal_text: "Optimize conversion rates", priority: 4, status: "active", progress_percentage: 50 }
  ];
}
