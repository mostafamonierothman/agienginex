
import React from "react";
import { Lightbulb, TrendingUp } from "lucide-react";

export function NextBestDecisionPanel({ decision }: { decision: string }) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-900/30 to-yellow-700/10 rounded border border-yellow-600 flex items-start gap-4">
      <div>
        <Lightbulb className="text-yellow-400 w-7 h-7 mt-1" />
      </div>
      <div>
        <div className="font-bold text-yellow-300 mb-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Next Strategic Move for Trillion-Dollar Growth
        </div>
        <div className="text-yellow-100 text-sm leading-relaxed">{decision}</div>
      </div>
    </div>
  );
}
