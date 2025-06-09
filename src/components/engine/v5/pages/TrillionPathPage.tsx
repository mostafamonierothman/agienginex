import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, TrendingUp, Activity, Play, Square, Clock } from 'lucide-react';
import { trillionPathEngine, TrillionPathMetrics } from '@/engine/TrillionPathEngine';
import { femtosecondSupervisor } from '@/engine/FemtosecondSupervisor';

const TrillionPathPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSupervisorRunning, setIsSupervisorRunning] = useState(false);
  const [metrics, setMetrics] = useState<TrillionPathMetrics>({
    economicValue: 1000000,
    knowledgeCycles: 0,
    impactfulDecisions: 0,
    compoundGrowthRate: 1.025,
    femtosecondCycles: 0,
    virtualizedAgents: 10,
    taskThroughput: 0,
    marketOpportunities: 3,
    revenueVelocity: 50000,
    customerAcquisitionRate: 15
  });
  const [supervisorStatus, setSupervisorStatus] = useState({
    isRunning: false,
    cycleCount: 0,
    performanceMetrics: {
      avgCycleTime: 0,
      successRate: 100,
      errorCount: 0,
      optimizationCount: 0
    }
  });

  useEffect(() => {
    // Auto-start continuous operation on component mount
    const autoStart = localStorage.getItem('trillion_path_continuous') !== 'false';
    if (autoStart) {
      console.log('🚀 Auto-starting continuous Trillion Path operation...');
      handleStartContinuous();
    }

    const interval = setInterval(() => {
      setMetrics(trillionPathEngine.getMetrics());
      setSupervisorStatus(femtosecondSupervisor.getStatus());
      setIsRunning(trillionPathEngine.isRunning());
      setIsSupervisorRunning(trillionPathEngine.isContinuousMode());
    }, 50); // Real-time updates every 50ms

    return () => clearInterval(interval);
  }, []);

  // Keep system running even if browser tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isSupervisorRunning) {
        console.log('💡 Tab hidden but maintaining 24/7 operation...');
      } else if (!document.hidden && isSupervisorRunning) {
        console.log('👁️ Tab visible - 24/7 operation continues...');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSupervisorRunning]);

  const handleStart = async () => {
    try {
      await trillionPathEngine.initializeTrillionPath();
      await trillionPathEngine.startFemtosecondCycles();
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start Trillion Path:', error);
    }
  };

  const handleStartContinuous = async () => {
    try {
      await trillionPathEngine.initializeTrillionPath();
      await trillionPathEngine.startFemtosecondCycles();
      await femtosecondSupervisor.startFemtosecondSupervision();
      setIsRunning(true);
      setIsSupervisorRunning(true);
      localStorage.setItem('trillion_path_continuous', 'true');
      console.log('🌟 Continuous Trillion Path operation initiated - will not stop until all goals achieved!');
    } catch (error) {
      console.error('Failed to start continuous operation:', error);
    }
  };

  const handleStop = () => {
    trillionPathEngine.stop();
    femtosecondSupervisor.stop();
    setIsRunning(false);
    setIsSupervisorRunning(false);
    localStorage.setItem('trillion_path_continuous', 'false');
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

  const getTimeToGoal = (currentValue: number, targetValue: number, growthRate: number): string => {
    if (currentValue === 0 || growthRate <= 1) return 'Calculating...';
    const cyclesNeeded = Math.log(targetValue / currentValue) / Math.log(growthRate);
    const hoursNeeded = cyclesNeeded * (supervisorStatus.performanceMetrics.avgCycleTime / 1000) / 3600;
    
    if (hoursNeeded < 24) return `${hoursNeeded.toFixed(1)} hours`;
    if (hoursNeeded < 24 * 365) return `${(hoursNeeded / 24).toFixed(1)} days`;
    return `${(hoursNeeded / (24 * 365)).toFixed(1)} years`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="h-8 w-8 text-purple-400" />
            Trillion Path AGI Engine
            {isSupervisorRunning && <Clock className="h-6 w-6 text-green-400 animate-pulse" />}
          </h1>
          <p className="text-gray-300">
            {isSupervisorRunning ? '🔄 Running continuously until ALL trillion-scale goals achieved' : 'Ready for continuous trillion-path optimization'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartContinuous}
            disabled={isSupervisorRunning}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Continuous Mode
          </Button>
          <Button
            onClick={handleStart}
            disabled={isRunning}
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Engine Only
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning && !isSupervisorRunning}
            variant="destructive"
          >
            <Square className="h-4 w-4 mr-2" />
            Emergency Stop
          </Button>
        </div>
      </div>

      {/* Continuous Operation Status */}
      {isSupervisorRunning && (
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400 animate-pulse" />
              Continuous Operation Active - Will Not Stop Until Goals Achieved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Economic Progress</div>
                <div className="text-green-400 font-bold">{((metrics.economicValue / 1e12) * 100).toFixed(8)}%</div>
              </div>
              <div>
                <div className="text-gray-300">Knowledge Progress</div>
                <div className="text-blue-400 font-bold">{((metrics.knowledgeCycles / 1e12) * 100).toFixed(8)}%</div>
              </div>
              <div>
                <div className="text-gray-300">Decision Progress</div>
                <div className="text-yellow-400 font-bold">{((metrics.impactfulDecisions / 1e12) * 100).toFixed(8)}%</div>
              </div>
              <div>
                <div className="text-gray-300">Real Growth Rate</div>
                <div className="text-purple-400 font-bold">{((metrics.compoundGrowthRate - 1) * 100).toFixed(4)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Trillion Path Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Real Economic Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getProgressColor(metrics.economicValue, 1e12)}`}>
                {formatValue(metrics.economicValue)}
              </div>
              <div className="text-sm text-gray-400">
                Target: 1T • Progress: {((metrics.economicValue / 1e12) * 100).toFixed(8)}%
              </div>
              <div className="text-xs text-gray-500">
                Real ETA: {getTimeToGoal(metrics.economicValue, 1e12, metrics.compoundGrowthRate)}
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
              <div className="text-xs text-gray-500">
                ETA: {getTimeToGoal(metrics.knowledgeCycles, 1e12, metrics.compoundGrowthRate)}
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
              <div className="text-xs text-gray-500">
                ETA: {getTimeToGoal(metrics.impactfulDecisions, 1e12, metrics.compoundGrowthRate)}
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

      {/* Real-time Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Real Femtosecond Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-400">
              {formatValue(metrics.femtosecondCycles)}
            </div>
            <div className="text-xs text-gray-400">Live ultra-fast iterations</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Active Virtual Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-cyan-400">
              {formatValue(metrics.virtualizedAgents)}
            </div>
            <div className="text-xs text-gray-400">Real agents working</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Real Task Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-400">
              {formatValue(metrics.taskThroughput)}/s
            </div>
            <div className="text-xs text-gray-400">Live tasks per second</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Market Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-400">
              {metrics.marketOpportunities}
            </div>
            <div className="text-xs text-gray-400">Real opportunities found</div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            AGI System Status
            {isSupervisorRunning && <span className="text-green-400 text-sm animate-pulse">● 24/7 OPERATION</span>}
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
                  <span className="text-gray-300">Operation Mode:</span>
                  <span className={isSupervisorRunning ? 'text-green-400' : 'text-yellow-400'}>
                    {isSupervisorRunning ? '24/7 Continuous' : 'Manual Control'}
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
