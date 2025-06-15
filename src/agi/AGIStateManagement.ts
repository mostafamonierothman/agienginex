
import { PersistentMemory } from "@/core/PersistentMemory";
import { AGIState } from "./AGIState";
import { SupabaseAGIStateService } from "@/services/SupabaseAGIStateService";

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
    // Persist state to Supabase as primary source
    try {
      const stateToSave = { ...this.state, ...extra };
      await SupabaseAGIStateService.saveState('unified_agi_state', stateToSave);
    } catch (e) {
      console.error("[AGIStateManagement] Supabase persistState error:", e);
    }
    // Also persist locally for resilience
    const stateToSave = { ...this.state, ...extra };
    await this.memory.set("unified_agi_state", stateToSave);
  }

  async restoreState() {
    // Try to load from Supabase first
    const remote = await SupabaseAGIStateService.loadState('unified_agi_state');
    if (remote) {
      this.state = { ...this.state, ...remote };
    } else {
      // fallback local
      const prev = await this.memory.get("unified_agi_state", null);
      if (prev) this.state = { ...this.state, ...prev, logs: [], running: false };
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
    // Erase from Supabase as well (optional; here we just reset)
    await SupabaseAGIStateService.saveState('unified_agi_state', this.state);
  }
}
