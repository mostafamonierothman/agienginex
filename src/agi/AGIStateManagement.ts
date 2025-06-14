
import { PersistentMemory } from "@/core/PersistentMemory";
import { AGIState } from "./AGIState";

export class AGIStateManagement {
  private memory: PersistentMemory;
  private state: AGIState;

  constructor() {
    this.memory = new PersistentMemory();
    this.state = {
      running: false,
      currentGoal: null,
      completedGoals: [],
      memoryKeys: [],
      logs: [],
      generation: 0,
    };
  }

  getState() {
    return this.state;
  }

  setState(s: Partial<AGIState>) {
    this.state = { ...this.state, ...s };
  }

  async persistState(extra: Record<string, any> = {}) {
    await this.memory.set("unified_agi_state", { ...this.state, ...extra });
  }

  async restoreState() {
    const prev = await this.memory.get("unified_agi_state", null);
    if (prev) {
      this.state = { ...prev, logs: [], running: false };
    }
  }

  async clear() {
    await this.memory.clear();
    this.state = {
      running: false,
      currentGoal: null,
      completedGoals: [],
      memoryKeys: [],
      logs: [],
      generation: 0,
    };
  }
}
