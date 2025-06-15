
import { SupabaseAGIStateService } from '@/services/AGIStateService';

// State shape
let defaultState = {
  running: false,
  generation: 0,
  logs: [],
  memoryKeys: [],
  completedGoals: [],
  phase2: false,
};

export class AGIStateManagement {
  private state: any = { ...defaultState };
  private localState: Map<string, any> = new Map();

  // Get the current full state object
  getState(): any {
    return this.state;
  }

  // Set (merge) values into the state object
  setState(val: Partial<any>): void {
    this.state = { ...this.state, ...val };
  }

  // Restore state from persistent storage
  async restoreState(): Promise<void> {
    const saved = await this.loadState('unified_agi_state');
    if (saved) {
      this.state = { ...defaultState, ...saved };
    }
  }

  // Persist the state (either current, or an override)
  async persistState(val?: Partial<any>): Promise<void> {
    if (val) {
      this.state = { ...this.state, ...val };
    }
    try {
      await SupabaseAGIStateService.saveState('unified_agi_state', this.state);
      console.log(`🧠 Persistent memory set: AGI state updated`);
    } catch (err) {
      // Save to local cache as fallback
      this.localState.set('unified_agi_state', this.state);
      console.log(`🧠 Local memory set: AGI state updated`);
    }
  }

  // Load a state by key (for other use)
  async loadState(key: string): Promise<any> {
    try {
      // Supabase takes priority
      const supabaseState = await SupabaseAGIStateService.loadState(key);
      if (supabaseState) {
        this.localState.set(key, supabaseState);
        return supabaseState;
      }
    } catch (error) {
      console.error('[AGIStateManagement] Supabase loadState error:', error);
    }
    return this.localState.get(key) || null;
  }

  // Clear the persistent state storage & local state
  async clear(): Promise<void> {
    this.state = { ...defaultState };
    this.localState.set('unified_agi_state', this.state);
    // Optionally attempt to clear remote state too
    try {
      if (typeof SupabaseAGIStateService.deleteState === 'function') {
        await SupabaseAGIStateService.deleteState('unified_agi_state');
      }
    } catch (err) {
      // Fail silently if deleteState does not exist
    }
  }

  // Legacy: set/get local state for a key
  getLocalState(key: string): any {
    return this.localState.get(key) || null;
  }
  setLocalState(key: string, state: any): void {
    this.localState.set(key, state);
  }
}

export const agiStateManagement = new AGIStateManagement();

