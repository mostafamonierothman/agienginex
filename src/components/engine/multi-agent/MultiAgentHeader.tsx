
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MultiAgentHeaderProps {
  isActive: boolean;
  backendConnected: boolean;
  onStartSupervision: () => void;
  onStopSupervision: () => void;
}

const MultiAgentHeader = ({ 
  isActive, 
  backendConnected, 
  onStartSupervision, 
  onStopSupervision 
}: MultiAgentHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-white flex items-center gap-2">
              🤖 Multi-Agent Supervisor V2 Hybrid
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              Autonomous agents with FastAPI backend integration & vector memory
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={backendConnected ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}>
              {backendConnected ? '🔗 BACKEND' : '💻 LOCAL'}
            </Badge>
            <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
              {isActive ? '🟢 SUPERVISING' : '🔴 INACTIVE'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {isActive ? (
            <Button onClick={onStopSupervision} variant="destructive" className="w-full sm:w-auto">
              Stop Supervision
            </Button>
          ) : (
            <Button onClick={onStartSupervision} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              Start Supervision V2
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default MultiAgentHeader;
