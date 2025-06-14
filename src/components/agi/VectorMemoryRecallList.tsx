
import React from "react";

export function VectorMemoryRecallList({
  memories
}: {
  memories: { memory_value?: string; [key: string]: any }[];
}) {
  if (!memories || memories.length === 0)
    return (
      <span className="ml-2 text-gray-400">No relevant memories found for this goal.</span>
    );
  return (
    <ul className="ml-5 mt-2 text-xs">
      {memories.map((mem, i) => (
        <li key={i} className="mb-1">
          <span className="text-white">
            {mem.memory_value ? mem.memory_value : typeof mem === "string" ? mem : JSON.stringify(mem)}
          </span>
          {mem.timestamp && (
            <span className="ml-2 text-gray-500">
              {new Date(mem.timestamp).toLocaleTimeString()}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
