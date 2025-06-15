
import React from "react";
import { VectorMemoryStats } from "./VectorMemoryStats";

export function VectorMemoryPanel({
  stats,
  total,
}: {
  stats: { shortTerm: number; episodic: number; longTerm: number };
  total: number;
}) {
  return (
    <div>
      <VectorMemoryStats stats={stats} />
      <div className="text-xs text-blue-200 mb-2">
        Vector Memories Stored: <b>{total}</b>
      </div>
    </div>
  );
}
