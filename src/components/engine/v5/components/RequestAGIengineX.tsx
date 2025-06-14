
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AGI_ORCHESTRATE_FN = "orchestrate_agi"; // Edge function name

export default function RequestAGIengineX({ onResult }: { onResult?: (result: any) => void }) {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    toast({
      title: "AGIengineX Request Initiated",
      description: "Launching full AGI orchestration..."
    });
    try {
      // Call the edge function to kick off full AGI orchestration
      const resp = await fetch(`/functions/${AGI_ORCHESTRATE_FN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: "request_full_agi" }),
      });

      if (!resp.ok) throw new Error("Failed to invoke AGIengineX orchestration.");
      const result = await resp.json();
      onResult?.(result);
      toast({
        title: "AGIengineX Complete",
        description: result?.message || "AGI orchestration completed.",
        variant: result?.success ? "default" : "destructive"
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to start AGIengineX",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Button
      disabled={loading}
      className="bg-gradient-to-r from-purple-900 to-cyan-700 text-white flex items-center gap-2 px-6"
      onClick={handleRequest}
    >
      <Zap className="w-4 h-4" />
      {loading ? "Requesting AGIengineX..." : "Request AGIengineX"}
    </Button>
  );
}
