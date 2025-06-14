
import React from "react";

export const AGILessonsPanel = ({ state }: { state: any }) => (
  <>
    <div className="mb-4">
      <span className="font-bold text-purple-300">Completed Goals:</span>
      <ul className="list-disc ml-6 text-gray-200 text-xs">
        {state.completedGoals.slice(0, 5).map((g: any, i: number) => (
          <li key={i}>
            <span className="font-semibold">{g.goal}</span>
            <span className="ml-1 text-gray-400">({g.result.slice(0, 50)}...)</span>
            <span className="ml-2 text-gray-500 text-xs">{g.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mb-4">
      <span className="font-bold text-pink-400">Lessons Learned ({(state.lessonsLearned?.length || 0)}):</span>
      <ul className="list-decimal ml-6 text-pink-200 text-xs">
        {state.lessonsLearned && state.lessonsLearned.slice(0, 5).map((lesson: string, i: number) => (
          <li key={i}>{lesson}</li>
        ))}
      </ul>
    </div>
  </>
);
