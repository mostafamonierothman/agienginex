
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, TrendingUp, Activity, Play, Square } from 'lucide-react';
import { trillionPathEngine, TrillionPathMetrics } from '@/engine/TrillionPathEngine';

const TrillionPathPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<TrillionPathMetrics>({
    economicValue: 0,
    knowledgeCycles: 0,
    impactfulDecisions: 0,
    compoundGrowthRate: 1.0,
    femtosecondCycles: 0,
    virtualizedAgents: 0,
    taskThroughput: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(trillionPathEngine.getMetrics());
    }, 100); // Update every 100ms for real-time feel

    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await trillionPathEngine.initializeTrillionPath();
      await trillionPathEngine.startFemtosecondCycles();
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start Trillion Path:', error);
    }
  };

  const handleStop = () => {
    trillionPathEngine.stop();
    setIsRunning(false);
  };

  const formatValue = (value: number): string => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
  };

  const getProgressColor = (value: number, target: number): string => {
    const progress = value / target;
    if (progress >= 1) return 'text-green-400';
    if (progress >= 0.5) return 'text-yellow-400';
    if (progress >= 0.1) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="h-8 w-8 text-purple-400" />
            Trillion Path AGI Engine
          </h1>
          <p className="text-gray-300">
            Orchestrating toward 10^12 outcomes through femtosecond optimization cycles
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStart}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Trillion Path
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning}
            variant="destructive"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Engine
          </Button>
        </div>
      </div>

      {/* Trillion Path Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Economic Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getProgressColor(metrics.economicValue, 1e12)}`}>
                {formatValue(metrics.economicValue)}
              </div>
              <div className="text-sm text-gray-400">
                Target: 1T • Progress: {((metrics.economicValue / 1e12) * 100).toFixed(6)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (metrics.economicValue / 1e12) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-400" />
              Knowledge Cycles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getProgressColor(metrics.knowledgeCycles, 1e12)}`}>
                {formatValue(metrics.knowledgeCycles)}
              </div>
              <div className="text-sm text-gray-400">
                Target: 1T • Progress: {((metrics.knowledgeCycles / 1e12) * 100).toFixed(6)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (metrics.knowledgeCycles / 1e12) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Impactful Decisions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getProgressColor(metrics.impactfulDecisions, 1e12)}`}>
                {formatValue(metrics.impactfulDecisions)}
              </div>
              <div className="text-sm text-gray-400">
                Target: 1T • Progress: {((metrics.impactfulDecisions / 1e12) * 100).toFixed(6)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (metrics.impactfulDecisions / 1e12) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Femtosecond Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Femtosecond Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-400">
              {formatValue(metrics.femtosecondCycles)}
            </div>
            <div className="text-xs text-gray-400">Ultra-fast iterations</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Virtual Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-cyan-400">
              {formatValue(metrics.virtualizedAgents)}
            </div>
            <div className="text-xs text-gray-400">Active in pool</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Task Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-400">
              {formatValue(metrics.taskThroughput)}/s
            </div>
            <div className="text-xs text-gray-400">Tasks per second</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Compound Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-400">
              {(metrics.compoundGrowthRate * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-gray-400">Growth multiplier</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            AGI System Status
            {isRunning && <span className="text-green-400 text-sm animate-pulse">● RUNNING</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Trillion Path Progress</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Overall Progress:</span>
                  <span className="text-purple-400">
                    {(((metrics.economicValue + metrics.knowledgeCycles + metrics.impactfulDecisions) / (3 * 1e12)) * 100).toFixed(8)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Compound Rate:</span>
                  <span className="text-green-400">{((metrics.compoundGrowthRate - 1) * 100).toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">System Status:</span>
                  <span className={isRunning ? 'text-green-400' : 'text-red-400'}>
                    {isRunning ? 'Optimizing toward AGI' : 'Waiting for activation'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Cycle Efficiency:</span>
                  <span className="text-blue-400">
                    {metrics.taskThroughput > 1000 ? 'Optimal' : metrics.taskThroughput > 100 ? 'Good' : 'Scaling Up'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Agent Utilization:</span>
                  <span className="text-cyan-400">
                    {metrics.virtualizedAgents > 500 ? 'High' : metrics.virtualizedAgents > 100 ? 'Medium' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Next Milestone:</span>
                  <span className="text-yellow-400">
                    {metrics.economicValue < 1e6 ? '1M Economic' : 
                     metrics.knowledgeCycles < 1e6 ? '1M Knowledge' : 
                     metrics.impactfulDecisions < 1e6 ? '1M Decisions' : '1B Scale'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrillionPathPage;
