
import React from "react";

export function WorldAwarenessList({ worldState }: { worldState: any[] }) {
  if (!worldState?.length) return null;
  return (
    <div className="mb-4">
      <div className="font-bold text-cyan-400 mb-1">🌐 World Awareness:</div>
      <ul className="list-disc ml-6 text-cyan-200 text-xs">
        {worldState.map((mem: any, i: number) => (
          <li key={mem.id || i}>
            <span className="font-semibold">{mem.content}</span>
            <span className="ml-2 text-gray-500">
              {mem.metadata?.timestamp ? new Date(mem.metadata.timestamp).toLocaleString() : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
