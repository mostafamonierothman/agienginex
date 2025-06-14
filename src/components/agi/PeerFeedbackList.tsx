
import React from "react";

export interface PeerFeedback {
  agent: string;
  feedback: string;
  timestamp: string;
}

export function PeerFeedbackList({ feedbacks }: { feedbacks: PeerFeedback[] }) {
  if (!feedbacks || feedbacks.length === 0)
    return <span className="ml-2 text-gray-400">No peer feedback yet.</span>;
  return (
    <ul className="ml-5 mt-2 text-xs">
      {feedbacks.slice(-5).reverse().map((fb, idx) => (
        <li key={idx} className="mb-1">
          <span className="font-semibold text-cyan-300">{fb.agent}: </span>
          <span className="text-white">{fb.feedback}</span>
          <span className="ml-2 text-gray-500">{new Date(fb.timestamp).toLocaleTimeString()}</span>
        </li>
      ))}
    </ul>
  );
}
