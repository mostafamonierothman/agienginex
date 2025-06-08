import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw, Activity } from 'lucide-react';
import { autonomousLoop } from '@/loops/AutonomousLoop';

const AutonomousLoopController = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [status, setStatus] = useState('stopped');

  useEffect(() => {
    const statusInterval = setInterval(() => {
      const loopStatus = autonomousLoop.getStatus();
      setIsRunning(loopStatus.isRunning);
      setCycleCount(loopStatus.cycleCount);
      setStatus(loopStatus.isRunning ? 'running' : 'stopped');
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  const handleStart = async () => {
    try {
      await autonomousLoop.start();
      setStatus('starting');
    } catch (error) {
      console.error('Failed to start autonomous loop:', error);
    }
  };

  const handleStop = () => {
    autonomousLoop.stop();
    setStatus('stopping');
  };

  const handleReset = () => {
    autonomousLoop.stop();
    setCycleCount(0);
    setStatus('stopped');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'stopping': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running': return 'AUTONOMOUS';
      case 'starting': return 'STARTING';
      case 'stopping': return 'STOPPING';
      default: return 'STOPPED';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5" />
          Autonomous Loop Controller
        </CardTitle>
        <CardDescription className="text-gray-300">
          Master control for the AGI V4 autonomous agent system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor()} text-white`}>
              {getStatusText()}
            </Badge>
            <span className="text-gray-300">
              Cycle #{cycleCount}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleStart}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="border-green-500/50 text-green-400 hover:bg-green-500/20"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
            
            <Button
              onClick={handleStop}
              disabled={!isRunning}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
            
            <Button
              onClick={handleReset}
              disabled={isRunning}
              variant="outline"
              size="sm"
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-gray-400">System Status</div>
            <div className="text-white font-semibold">
              {isRunning ? '🚀 Fully Autonomous' : '⏸️ Manual Control'}
            </div>
          </div>
          
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-gray-400">Active Agents</div>
            <div className="text-white font-semibold">
              12 Core Agents
            </div>
          </div>
        </div>

        <div className="bg-black/30 p-3 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">All 12 Agent Execution Order:</div>
          <div className="flex flex-wrap gap-1 text-xs">
            {['Supervisor', 'Coordination', 'Strategic', 'Research', 'Opportunity', 'Learning', 'Memory', 'LLM', 'Evolution', 'Collaboration', 'Factory', 'Critic'].map((agent, index) => (
              <Badge key={agent} variant="outline" className="text-gray-300 border-gray-600">
                {index + 1}. {agent}
              </Badge>
            ))}
          </div>
        </div>

        {isRunning && (
          <div className="text-center text-sm text-yellow-400 animate-pulse">
            🤖 AGI V4 System Running Autonomously with all 12 agents...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutonomousLoopController;
