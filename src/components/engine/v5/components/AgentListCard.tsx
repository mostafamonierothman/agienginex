
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause } from 'lucide-react';

interface AgentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
}

interface AgentListCardProps {
  agent: AgentInfo;
  isRunning: boolean;
  onRun: (agentName: string) => Promise<void>;
}

const AgentListCard = ({ agent, isRunning, onRun }: AgentListCardProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600/20">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="font-medium text-white">{agent.name}</span>
          <Badge variant="outline" className="text-xs">
            {agent.version}
          </Badge>
        </div>
        <p className="text-sm text-gray-300">{agent.description}</p>
      </div>
      <Button
        size="sm"
        onClick={() => onRun(agent.name)}
        disabled={isRunning}
        className="ml-4"
      >
        {isRunning ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Run
          </>
        )}
      </Button>
    </div>
  );
};

export default AgentListCard;
