
import React from 'react';

interface AGIV4FeatureStatusProps {
  activeAgentCount: number;
  openAIEnabled: boolean;
}

const AGIV4FeatureStatus = ({ activeAgentCount, openAIEnabled }: AGIV4FeatureStatusProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-gray-400">Agent Registry ({activeAgentCount})</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-gray-400">Vector Memory</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-gray-400">Learning Loop</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-gray-400">Multi-Agent Coordination</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 ${openAIEnabled ? 'bg-blue-400' : 'bg-gray-400'} rounded-full`}></div>
        <span className="text-gray-400">OpenAI Integration</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-gray-400">Autonomous Goals</span>
      </div>
    </div>
  );
};

export default AGIV4FeatureStatus;
