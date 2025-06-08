
import React from 'react';
import { Activity, Zap } from 'lucide-react';

interface AGIV4SystemMessagesProps {
  systemRunning: boolean;
  parallelRunning: boolean;
  agentCount: number;
}

const AGIV4SystemMessages = ({ systemRunning, parallelRunning, agentCount }: AGIV4SystemMessagesProps) => {
  return (
    <>
      {systemRunning && (
        <div className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-300">
            <Activity className="h-5 w-5 animate-pulse" />
            <span className="font-medium text-base">AGI V4 System Running Autonomously</span>
          </div>
          <p className="text-slate-200 text-sm mt-2">
            All {agentCount} agents are executing in autonomous mode. The system will continuously run and evolve.
          </p>
        </div>
      )}
      
      {parallelRunning && (
        <div className="bg-violet-900/30 border border-violet-500/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-violet-300">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="font-medium text-base">Parallel Farm Active</span>
          </div>
          <p className="text-slate-200 text-sm mt-2">
            {agentCount} agents are running in parallel farm mode for maximum efficiency and throughput.
          </p>
        </div>
      )}
    </>
  );
};

export default AGIV4SystemMessages;
