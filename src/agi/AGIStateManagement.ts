
import { SupabaseAGIStateService } from '@/services/AGIStateService';

export class AGIStateManagement {
  private localState: Map<string, any> = new Map();

  async persistState(key: string, state: any): Promise<void> {
    try {
      // Save locally first
      this.localState.set(key, state);
      
      // Try to save to Supabase, but don't fail if it doesn't work
      await SupabaseAGIStateService.saveState(key, state);
      
      console.log(`🧠 Persistent memory set: ${key}`);
    } catch (error) {
      console.error('[AGIStateManagement] Supabase persistState error:', error);
      // Don't throw - we still have local state
      console.log(`🧠 Local memory set: ${key}`);
    }
  }

  async loadState(key: string): Promise<any> {
    try {
      // Try Supabase first
      const supabaseState = await SupabaseAGIStateService.loadState(key);
      if (supabaseState) {
        this.localState.set(key, supabaseState);
        return supabaseState;
      }
    } catch (error) {
      console.error('[AGIStateManagement] Supabase loadState error:', error);
    }

    // Fall back to local state
    return this.localState.get(key) || null;
  }

  getLocalState(key: string): any {
    return this.localState.get(key) || null;
  }

  setLocalState(key: string, state: any): void {
    this.localState.set(key, state);
  }
}

export const agiStateManagement = new AGIStateManagement();
