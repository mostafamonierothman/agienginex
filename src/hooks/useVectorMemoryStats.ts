
import { useState, useEffect, useCallback } from "react";
import { vectorMemoryService } from "@/services/VectorMemoryService";

// Define the expected vector memory stats shape
export interface VectorStats {
  shortTerm: number;
  episodic: number;
  longTerm: number;
  total: number;
}

// By default, only longTerm and total are used but we provide the full shape for compatibility
export function useVectorMemoryStats(agentId: string): VectorStats {
  const [stats, setStats] = useState<VectorStats>({
    shortTerm: 0,
    episodic: 0,
    longTerm: 0,
    total: 0,
  });

  const fetchStats = useCallback(async () => {
    const supabaseStats = await vectorMemoryService.getMemoryStats(agentId);
    // Since we don't store short/episodic separately, only provide longTerm/total
    setStats({
      shortTerm: 0,
      episodic: 0,
      longTerm: supabaseStats.total ?? 0,
      total: supabaseStats.total ?? 0,
    });
  }, [agentId]);

  useEffect(() => {
    fetchStats();
    // Optionally, set an interval if you want regular syncs
    // const interval = setInterval(fetchStats, 8000);
    // return () => clearInterval(interval);
  }, [fetchStats]);

  return stats;
}
