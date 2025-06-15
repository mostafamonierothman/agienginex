
import { supabase } from "@/integrations/supabase/client";
import type { AGIState } from "@/agi/AGIState";

export class SupabaseAGIStateService {
  static AGI_STATE_KEY = "unified_agi_state";
  
  static async saveState(state: AGIState) {
    // Use "agi_state" (not "api.agi_state")
    const { error } = await supabase
      .from("agi_state")
      .upsert([
        {
          key: SupabaseAGIStateService.AGI_STATE_KEY,
          state,
          updated_at: new Date().toISOString(),
        },
      ]);
    if (error) {
      throw new Error("Supabase AGI state save failed: " + error.message);
    }
  }

  static async loadState(): Promise<AGIState | null> {
    const { data, error } = await supabase
      .from("agi_state")
      .select("state")
      .eq("key", SupabaseAGIStateService.AGI_STATE_KEY)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase AGI state load failed: ", error);
      return null;
    }

    if (!data || !data[0] || !data[0].state) return null;
    return data[0].state as AGIState;
  }
}
