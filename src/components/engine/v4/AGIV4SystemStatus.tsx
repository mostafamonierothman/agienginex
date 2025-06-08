
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AGIV4SystemStatusProps {
  isV4Active: boolean;
  openAIEnabled: boolean;
  systemHealth: number;
  activeAgentCount: number;
}

const AGIV4SystemStatus = ({ 
  isV4Active, 
  openAIEnabled, 
  systemHealth, 
  activeAgentCount 
}: AGIV4SystemStatusProps) => {
  return (
    <div className="flex items-center gap-4 mt-2">
      <Badge 
        variant="outline" 
        className={isV4Active ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}
      >
        {isV4Active ? '🟢 V4 ACTIVE' : '🔴 V4 OFFLINE'}
      </Badge>
      <Badge 
        variant="outline" 
        className={openAIEnabled ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-gray-400'}
      >
        {openAIEnabled ? '🧠 OPENAI ENHANCED' : '🤖 LOCAL MODE'}
      </Badge>
      <Badge variant="outline" className="text-blue-400 border-blue-400">
        Health: {systemHealth.toFixed(0)}%
      </Badge>
      <Badge variant="outline" className="text-yellow-400 border-yellow-400">
        Agents: {activeAgentCount}
      </Badge>
    </div>
  );
};

export default AGIV4SystemStatus;
