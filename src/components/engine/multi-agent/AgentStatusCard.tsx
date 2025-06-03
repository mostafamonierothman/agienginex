
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Agent } from '@/services/MultiAgentSupervisor';

interface AgentStatusCardProps {
  agent: Agent;
}

const AgentStatusCard = ({ agent }: AgentStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'text-blue-400 border-blue-400';
      case 'executing': return 'text-green-400 border-green-400';
      case 'completed': return 'text-purple-400 border-purple-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking': return '🤔';
      case 'executing': return '⚡';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '😴';
    }
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-white font-medium flex items-center gap-2">
            {getStatusIcon(agent.status)} {agent.name}
            {agent.useBackend && (
              <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                BACKEND
              </Badge>
            )}
          </div>
          <div className="text-gray-400 text-sm">{agent.role}</div>
        </div>
        <Badge variant="outline" className={getStatusColor(agent.status)}>
          {agent.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Performance</span>
          <span className="text-white">{agent.performance.toFixed(0)}%</span>
        </div>
        <Progress value={agent.performance} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Autonomy Level</span>
          <span className="text-white">{agent.autonomyLevel.toFixed(0)}%</span>
        </div>
        <Progress value={agent.autonomyLevel} className="h-2" />
      </div>

      {agent.currentTask && (
        <div className="mt-3 p-2 bg-slate-600/50 rounded">
          <div className="text-gray-400 text-xs">Current Task:</div>
          <div className="text-white text-sm">{agent.currentTask}</div>
        </div>
      )}

      {agent.lastAction && (
        <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-700/30">
          <div className="text-gray-400 text-xs">Last Action:</div>
          <div className="text-green-400 text-sm">{agent.lastAction}</div>
        </div>
      )}
    </div>
  );
};

export default AgentStatusCard;
