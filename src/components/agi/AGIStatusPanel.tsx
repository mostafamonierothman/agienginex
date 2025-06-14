
import React from "react";
import { VectorMemoryStats } from "@/components/agi/VectorMemoryStats";
import { PeerFeedbackList } from "@/components/agi/PeerFeedbackList";
import { VectorMemoryRecallList } from "@/components/agi/VectorMemoryRecallList";

export const AGIStatusPanel = ({
  state,
  vectorStats
}: {
  state: any;
  vectorStats: { shortTerm: number; longTerm: number; episodic: number };
}) => (
  <>
    <div className="mb-2">
      <span className="text-blue-400 font-semibold">Vector Memory ("Brain"):</span>
      <VectorMemoryStats stats={vectorStats} />
    </div>
    <div className="mb-4">
      <span className="text-blue-300 font-bold">Latest Recalled Memories for Current Goal:</span>
      <VectorMemoryRecallList memories={state.lastRecalledVectorMemories ?? []} />
    </div>
    <div className="mb-4">
      <span className="text-blue-300 font-bold">Recent Peer Feedback:</span>
      <PeerFeedbackList feedbacks={state.recentCollaborationFeedback ?? []} />
    </div>
    <div className="mb-4">
      <span className="font-bold text-green-400">Status:</span>{" "}
      {state.running ? "AGI is running" : "Stopped"}
    </div>
    <div className="mb-4">
      <span className="text-cyan-400">Current Goal:</span>{" "}
      {state.currentGoal ? (
        <span className="text-white">{state.currentGoal}</span>
      ) : (
        <span className="text-gray-400">None (waiting for next cycle)</span>
      )}
    </div>
    <div className="mb-4">
      <span className="text-yellow-400">Memory Keys: {state.memoryKeys.length}</span>
    </div>
    <div>
      <span className="font-bold text-blue-400">Latest Logs:</span>
      <ul className="list-disc ml-6 text-gray-300 text-xs">
        {state.logs.slice(0, 10).map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  </>
);
