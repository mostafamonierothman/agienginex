
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AGIState } from '@/hooks/useAGIEngine';

interface AGIStatusProps {
  isRunning: boolean;
  agiState: AGIState;
}

const AGIStatus = ({ isRunning, agiState }: AGIStatusProps) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <Badge variant="outline" className={isRunning ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
        {isRunning ? '🟢 AUTONOMOUS' : '🔴 PAUSED'}
      </Badge>
      {agiState.isThinking && (
        <Badge variant="outline" className="text-blue-400 border-blue-400 animate-pulse">
          🧠 THINKING...
        </Badge>
      )}
      <div className="text-xs md:text-sm text-gray-400">
        Cycles: {agiState.cycles} | Learning Rate: {agiState.learningRate.toFixed(2)}x
      </div>
    </div>
  );
};

export default AGIStatus;
