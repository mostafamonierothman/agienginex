
import React from "react";

export function VectorMemoryStats({
  stats,
}: {
  stats: { shortTerm: number; longTerm: number; episodic: number };
}) {
  return (
    <div className="ml-4 mt-1 flex flex-col gap-1 text-xs text-blue-200">
      <div>
        Short-Term: <span className="font-mono">{stats.shortTerm}</span>
      </div>
      <div>
        Episodic: <span className="font-mono">{stats.episodic}</span>
      </div>
      <div>
        Long-Term: <span className="font-mono">{stats.longTerm}</span>
      </div>
    </div>
  );
}
