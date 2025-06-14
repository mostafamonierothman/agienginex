
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface AgentSystemOverviewProps {
  systemStats: any;
  totalAgents: number;
}

const AgentSystemOverview = ({ systemStats, totalAgents }: AgentSystemOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-400" />
          Agent Registry System
          <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-400">
            {systemStats?.version || 'V9'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">{systemStats?.totalAgents || totalAgents}</div>
            <div className="text-sm text-gray-300">Total Agents</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-400">{systemStats?.agoAgents || 0}</div>
            <div className="text-sm text-gray-300">AGO Agents</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-400">{systemStats?.coreAgents || 0}</div>
            <div className="text-sm text-gray-300">Core Agents</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-400">{systemStats?.emergencyAgents || 0}</div>
            <div className="text-sm text-gray-300">Emergency Agents</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentSystemOverview;
