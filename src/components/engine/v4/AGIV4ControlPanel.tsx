
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Activity, Zap } from 'lucide-react';

interface AGIV4ControlPanelProps {
  agentCount: number;
  loading: boolean;
  systemRunning: boolean;
  parallelRunning: boolean;
  runAllAgents: () => void;
  startAutonomousSystem: () => void;
  startParallelFarm: () => void;
  stopAutonomousSystem: () => void;
}

const AGIV4ControlPanel = ({
  agentCount,
  loading,
  systemRunning,
  parallelRunning,
  runAllAgents,
  startAutonomousSystem,
  startParallelFarm,
  stopAutonomousSystem
}: AGIV4ControlPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <Button
        onClick={runAllAgents}
        disabled={loading}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3"
      >
        <Zap className="h-4 w-4 mr-2" />
        Run All {agentCount} Agents
      </Button>
      
      <Button
        onClick={startAutonomousSystem}
        disabled={systemRunning || loading}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium py-3"
      >
        <Play className="h-4 w-4 mr-2" />
        Start Autonomous
      </Button>
      
      <Button
        onClick={startParallelFarm}
        disabled={parallelRunning || loading}
        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-3"
      >
        <Activity className="h-4 w-4 mr-2" />
        Start Parallel Farm
      </Button>
      
      <Button
        onClick={stopAutonomousSystem}
        disabled={!systemRunning && !parallelRunning}
        variant="destructive"
        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-medium py-3"
      >
        <Square className="h-4 w-4 mr-2" />
        Stop All
      </Button>
    </div>
  );
};

export default AGIV4ControlPanel;
