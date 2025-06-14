
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const AGI_STATUS_POLL_INTERVAL = 3500;

export default function AGIStatusPanel() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stopped = false;
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const resp = await fetch("/functions/agi_status_panel", { method: "POST" });
        if (!resp.ok) throw new Error("Status function failed.");
        const result = await resp.json();
        if (!stopped) setStatus(result);
      } catch {
        if (!stopped) setStatus(null);
      }
      setLoading(false);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, AGI_STATUS_POLL_INTERVAL);
    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className="bg-gradient-to-r from-cyan-950/60 to-purple-900/90 border-cyan-600/40 min-h-[160px] mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-200">
          <BarChart className="w-5 h-5" /> AGIengineX Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-cyan-300">Loading AGI status...</div>}
        {!loading && status && (
          <div>
            <div className="flex flex-wrap gap-2 items-center mb-1">
              <Badge className="bg-cyan-800 text-cyan-200">Phase</Badge>
              <span className="font-semibold text-white">{status.phase || "Unknown"}</span>
              <Badge className="bg-purple-800 text-purple-200 ml-2">Readiness</Badge>
              <span className="text-cyan-300">{status.readiness ? `${status.readiness}%` : "N/A"}</span>
            </div>
            <div className="text-xs text-cyan-300 mb-1">Agents: {status.activeAgents}, Intelligence: {status.intelligenceLevel || "?"}%</div>
            <div className="text-xs text-purple-300">{status.statusSummary || status.message || "Full AGI orchestration live."}</div>
            <div className="text-xs text-gray-400 mt-2">Last updated: {status.timestamp ? new Date(status.timestamp).toLocaleTimeString() : "--"}</div>
          </div>
        )}
        {!loading && !status && <span className="text-red-400">No status available.</span>}
      </CardContent>
    </Card>
  );
}
