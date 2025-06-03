
import React from 'react';

interface AgentStatsGridProps {
  stats: {
    totalAgents: number;
    activeAgents: number;
    avgPerformance: number;
    avgAutonomy: number;
  };
  loopInterval: number;
}

const AgentStatsGrid = ({ stats, loopInterval }: AgentStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-slate-700/50 p-3 rounded">
        <div className="text-gray-400 text-sm">Total Agents</div>
        <div className="text-white font-bold text-lg">{stats.totalAgents}</div>
      </div>
      <div className="bg-slate-700/50 p-3 rounded">
        <div className="text-gray-400 text-sm">Active Agents</div>
        <div className="text-green-400 font-bold text-lg">{stats.activeAgents}</div>
      </div>
      <div className="bg-slate-700/50 p-3 rounded">
        <div className="text-gray-400 text-sm">Avg Performance</div>
        <div className="text-blue-400 font-bold text-lg">{stats.avgPerformance.toFixed(0)}%</div>
      </div>
      <div className="bg-slate-700/50 p-3 rounded">
        <div className="text-gray-400 text-sm">Avg Autonomy</div>
        <div className="text-purple-400 font-bold text-lg">{stats.avgAutonomy.toFixed(0)}%</div>
      </div>
      <div className="bg-slate-700/50 p-3 rounded">
        <div className="text-gray-400 text-sm">Loop Interval</div>
        <div className="text-yellow-400 font-bold text-lg">{(loopInterval/1000).toFixed(1)}s</div>
      </div>
    </div>
  );
};

export default AgentStatsGrid;
