
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw } from 'lucide-react';

interface Agent {
  name: string;
  type: string;
  status: string;
  performance: number;
  description: string;
}

interface AGIV4AgentGridProps {
  agents: Agent[];
  loading: boolean;
  fetchAgents: () => void;
}

const AGIV4AgentGrid = ({ agents, loading, fetchAgents }: AGIV4AgentGridProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-500 text-white border-emerald-500';
      case 'active': return 'bg-blue-500 text-white border-blue-500';
      case 'error': return 'bg-red-500 text-white border-red-500';
      default: return 'bg-slate-500 text-white border-slate-500';
    }
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'Core': return 'text-cyan-400 border-cyan-400';
      case 'Research': return 'text-blue-400 border-blue-400';
      case 'Learning': return 'text-green-400 border-green-400';
      case 'Factory': return 'text-yellow-400 border-yellow-400';
      case 'Critic': return 'text-red-400 border-red-400';
      case 'LLM': return 'text-purple-400 border-purple-400';
      case 'Coordination': return 'text-orange-400 border-orange-400';
      case 'Memory': return 'text-pink-400 border-pink-400';
      case 'Strategic': return 'text-indigo-400 border-indigo-400';
      case 'Opportunity': return 'text-teal-400 border-teal-400';
      case 'Evolution': return 'text-violet-400 border-violet-400';
      case 'Collaboration': return 'text-rose-400 border-rose-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">All Agents ({agents.length})</h3>
        <Button
          onClick={fetchAgents}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-slate-500 text-slate-200 hover:bg-slate-700 hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent, index) => (
          <div key={index} className="bg-slate-700/60 p-4 rounded-lg border border-slate-500/40 hover:bg-slate-700/80 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium text-sm truncate">{agent.name}</span>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(agent.status)} text-xs font-medium`}
              >
                {agent.status.toUpperCase()}
              </Badge>
            </div>
            
            <div className="mb-2">
              <Badge 
                variant="outline" 
                className={`${getAgentTypeColor(agent.type)} text-xs font-medium mb-2`}
              >
                {agent.type}
              </Badge>
            </div>
            
            <div className="text-xs text-slate-300 mb-3">{agent.description}</div>
            
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Progress value={agent.performance} className="h-2" />
              </div>
              <span className="text-xs text-slate-200 font-medium">{agent.performance}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AGIV4AgentGrid;
