
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tractor, Play, Square, Activity, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { parallelFarm } from '@/loops/ParallelFarm';

const ParallelFarmController = () => {
  const [farmStatus, setFarmStatus] = useState({ isRunning: false, cycleCount: 0 });
  const [loading, setLoading] = useState(false);

  const startFarm = async () => {
    try {
      setLoading(true);
      await parallelFarm.startFarm();
      
      toast({
        title: "🚜 Parallel Farm Started",
        description: "Agents are now running in parallel for maximum efficiency",
      });
    } catch (error) {
      console.error('Failed to start parallel farm:', error);
      toast({
        title: "Error",
        description: "Failed to start parallel farm",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stopFarm = () => {
    parallelFarm.stopFarm();
    
    toast({
      title: "⏹️ Parallel Farm Stopped",
      description: "All parallel agent execution has been halted",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFarmStatus(parallelFarm.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tractor className="w-5 h-5 text-green-400" />
          Parallel Agent Farm
        </CardTitle>
        <CardDescription className="text-gray-400">
          Run multiple agents in parallel for maximum performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Status:</span>
              <Badge 
                variant={farmStatus.isRunning ? "default" : "secondary"}
                className={farmStatus.isRunning ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}
              >
                {farmStatus.isRunning ? "Running" : "Stopped"}
              </Badge>
            </div>
            
            {farmStatus.isRunning && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Cycles:</span>
                <span className="text-white font-mono">{farmStatus.cycleCount}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!farmStatus.isRunning ? (
              <Button 
                onClick={startFarm} 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {loading ? 'Starting...' : 'Start Farm'}
              </Button>
            ) : (
              <Button 
                onClick={stopFarm}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Farm
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Execution Mode</span>
            </div>
            <p className="text-white font-semibold">Parallel Processing</p>
            <p className="text-xs text-gray-400 mt-1">All agents run simultaneously</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Performance</span>
            </div>
            <p className="text-white font-semibold">High Throughput</p>
            <p className="text-xs text-gray-400 mt-1">6 agents per cycle</p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tractor className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Scaling</span>
            </div>
            <p className="text-white font-semibold">Enterprise Ready</p>
            <p className="text-xs text-gray-400 mt-1">Adaptive intervals</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Parallel Agents:</h4>
          <div className="flex flex-wrap gap-2">
            {['SupervisorAgent', 'ResearchAgent', 'LearningAgentV2', 'FactoryAgent', 'CriticAgent', 'LLMAgent'].map((agent) => (
              <Badge 
                key={agent} 
                variant="secondary" 
                className={`bg-blue-500/20 text-blue-400 ${farmStatus.isRunning ? 'animate-pulse' : ''}`}
              >
                {agent}
              </Badge>
            ))}
          </div>
        </div>

        {farmStatus.isRunning && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Farm is actively processing...</span>
            </div>
            <p className="text-xs text-green-300 mt-1">
              All agents are running in parallel for maximum efficiency
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParallelFarmController;
