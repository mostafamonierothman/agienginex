
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AgentStatsProps {
  agentCount: number;
  leadsCount: number;
}

const AgentStats = ({ agentCount, leadsCount }: AgentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <Card className="bg-slate-800/60 border-slate-600/50 shadow-xl backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-3">{agentCount}</div>
          <div className="text-gray-200 text-lg font-medium">AGI Agents Active & Learning</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/60 border-slate-600/50 shadow-xl backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <div className="text-5xl md:text-6xl font-bold text-green-400 mb-3">{leadsCount}</div>
          <div className="text-gray-200 text-lg font-medium">Total Leads Generated</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentStats;
