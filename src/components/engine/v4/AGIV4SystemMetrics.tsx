
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Brain, Clock, Zap } from 'lucide-react';

interface AGIV4SystemMetricsProps {
  systemRunning: boolean;
  agentCount: number;
  totalCycles: number;
  systemHealth: number;
}

const AGIV4SystemMetrics = ({ 
  systemRunning, 
  agentCount, 
  totalCycles, 
  systemHealth 
}: AGIV4SystemMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <span className="text-slate-200 text-sm font-medium">System Status</span>
        </div>
        <Badge className={systemRunning ? 'bg-emerald-500 text-white text-sm px-3 py-1' : 'bg-red-500 text-white text-sm px-3 py-1'}>
          {systemRunning ? 'AUTONOMOUS' : 'MANUAL'}
        </Badge>
      </div>
      
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <span className="text-slate-200 text-sm font-medium">Active Agents</span>
        </div>
        <span className="text-white font-bold text-2xl">{agentCount}</span>
      </div>
      
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-amber-400" />
          <span className="text-slate-200 text-sm font-medium">Total Cycles</span>
        </div>
        <span className="text-white font-bold text-2xl">{totalCycles}</span>
      </div>
      
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-violet-400" />
          <span className="text-slate-200 text-sm font-medium">System Health</span>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={systemHealth} className="flex-1 h-3" />
          <span className="text-white text-sm font-medium">{systemHealth.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AGIV4SystemMetrics;
