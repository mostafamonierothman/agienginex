
import React from "react";

export function SelfReflectionHistory({ reflections }: { reflections: string[] }) {
  if (!reflections?.length) return null;
  return (
    <div className="mb-4">
      <span className="font-bold text-lime-300">Recent Self-Reflection:</span>
      <ul className="list-decimal ml-6 text-lime-200 text-xs">
        {reflections.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
