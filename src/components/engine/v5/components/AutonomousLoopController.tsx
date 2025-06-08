
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw, Activity, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AutonomousLoopControllerProps {
  onStartLoop: () => void;
  onStopLoop: () => void;
  onResetLoop: () => void;
  isRunning: boolean;
  cycles: number;
  loopSpeed: number;
}

const AutonomousLoopController = ({
  onStartLoop,
  onStopLoop,
  onResetLoop,
  isRunning,
  cycles,
  loopSpeed
}: AutonomousLoopControllerProps) => {
  const [totalAgents] = useState(19);

  const getStatusColor = () => {
    return isRunning ? 'bg-green-500' : 'bg-gray-500';
  };

  const getStatusText = () => {
    return isRunning ? 'AUTONOMOUS' : 'MANUAL';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg md:text-xl">
          <Activity className="h-5 w-5 text-purple-400" />
          Autonomous Loop Controller
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor()} text-white`}>
              {getStatusText()}
            </Badge>
            <span className="text-gray-300 text-sm">
              Cycle #{cycles}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onStartLoop}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="border-green-500/50 text-green-400 hover:bg-green-500/20 h-8 md:h-9"
            >
              <Play className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">Start</span>
            </Button>
            
            <Button
              onClick={onStopLoop}
              disabled={!isRunning}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20 h-8 md:h-9"
            >
              <Square className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">Stop</span>
            </Button>
            
            <Button
              onClick={onResetLoop}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 h-8 md:h-9"
            >
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-gray-400 text-xs">System Status</div>
            <div className="text-white font-semibold">
              {isRunning ? '🚀 Fully Autonomous' : '⏸️ Manual Control'}
            </div>
          </div>
          
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-gray-400 text-xs">Active Agents</div>
            <div className="text-white font-semibold">
              {totalAgents} Total Agents
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Loop Performance:</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="text-gray-300 border-gray-600">
              Speed: {loopSpeed}ms
            </Badge>
            <Badge variant="outline" className="text-gray-300 border-gray-600">
              Cycles: {cycles}
            </Badge>
            <Badge variant="outline" className="text-gray-300 border-gray-600">
              Uptime: {Math.floor(cycles * loopSpeed / 1000)}s
            </Badge>
          </div>
        </div>

        {isRunning && (
          <div className="text-center text-sm text-yellow-400 animate-pulse">
            <Brain className="h-4 w-4 inline mr-1" />
            AGI V5 System Running Autonomously...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutonomousLoopController;
