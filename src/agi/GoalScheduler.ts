
type ScheduledGoal = {
  goal: string;
  priority: number;
  addedAt: number;
};

export class GoalScheduler {
  private queue: ScheduledGoal[] = [];

  addGoal(goal: string, priority: number = 1) {
    this.queue.push({ goal, priority, addedAt: Date.now() });
    this.queue.sort((a, b) => b.priority - a.priority || a.addedAt - b.addedAt);
  }

  nextGoal(): string | null {
    return this.queue.length ? this.queue[0].goal : null;
  }

  popNextGoal(): string | null {
    if (!this.queue.length) return null;
    return this.queue.shift()!.goal;
  }

  reprioritize(goal: string, newPriority: number) {
    const idx = this.queue.findIndex(g => g.goal === goal);
    if (idx !== -1) {
      this.queue[idx].priority = newPriority;
      this.queue.sort((a, b) => b.priority - a.priority || a.addedAt - b.addedAt);
    }
  }

  getQueue() {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
  }
}
