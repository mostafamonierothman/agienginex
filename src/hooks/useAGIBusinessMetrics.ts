
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Business metrics definition
export type BusinessMetrics = {
  revenue: number;
  deals: number;
  leads: number;
  velocity: number;
};

const DEFAULT: BusinessMetrics = {
  revenue: 0,
  deals: 0,
  leads: 0,
  velocity: 0,
};

// Main hook: persist/read metrics from Supabase
export function useAGIBusinessMetrics(key: string = "agi_metrics") {
  const [metrics, setMetrics] = useState<BusinessMetrics>(DEFAULT);
  const [loading, setLoading] = useState(true);

  // Load real metrics
  const loadMetrics = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("agi_state")
      .select("state")
      .eq("key", key)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0 && data[0].state) {
      setMetrics({
        revenue: data[0].state.revenue ?? 0,
        deals: data[0].state.deals ?? 0,
        leads: data[0].state.leads ?? 0,
        velocity: data[0].state.velocity ?? 0,
      });
    }
    setLoading(false);
  }, [key]);

  // Save real metrics
  const saveMetrics = useCallback(
    async (newMetrics: BusinessMetrics) => {
      setMetrics(newMetrics);
      await supabase.from("agi_state").upsert(
        [
          {
            key,
            state: newMetrics,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "key" }
      );
    },
    [key]
  );

  useEffect(() => {
    loadMetrics();
    // Optionally, set up polling or Supabase subscriptions for real updates
  }, [loadMetrics]);

  return {
    metrics,
    setMetrics: saveMetrics,
    loading,
    reload: loadMetrics,
  };
}
