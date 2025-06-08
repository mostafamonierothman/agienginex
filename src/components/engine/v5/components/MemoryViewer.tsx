
import React from 'react';

interface MemoryViewerProps {
  memory: Record<string, string>;
}

const MemoryViewer = ({ memory }: MemoryViewerProps) => {
  return (
    <div className="space-y-3">
      {Object.entries(memory).map(([key, value], index) => (
        <div key={index} className="p-3 bg-slate-700/50 rounded border border-slate-600/30">
          <div className="text-sm font-semibold text-purple-400 mb-1">
            {key.replace(/_/g, ' ').toUpperCase()}
          </div>
          <div className="text-sm text-gray-300">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default MemoryViewer;
