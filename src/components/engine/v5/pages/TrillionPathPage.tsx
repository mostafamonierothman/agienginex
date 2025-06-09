import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, TrendingUp, Activity, Play, Square, Clock, DollarSign, Calendar } from 'lucide-react';
import { trillionPathEngine, TrillionPathMetrics } from '@/engine/TrillionPathEngine';
import { femtosecondSupervisor } from '@/engine/FemtosecondSupervisor';

const TrillionPathPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSupervisorRunning, setIsSupervisorRunning] = useState(false);
  const [metrics, setMetrics] = useState<TrillionPathMetrics>({
    economicValue: 1000000,
    knowledgeCycles: 0,
    impactfulDecisions: 0,
    compoundGrowthRate: 1.1,
    femtosecondCycles: 0,
    virtualizedAgents: 20,
    taskThroughput: 0,
    marketOpportunities: 5,
    revenueVelocity: 100000,
    customerAcquisitionRate: 50,
    executionSuccesses: 0,
    realRevenue: 0,
    activeConversions: 0,
    opportunityMultiplier: 1.0
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
      console.log('🚀 Auto-starting ACCELERATED continuous Trillion Path operation...');
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
      console.log('🔥 ACCELERATED Continuous Trillion Path operation initiated - AGGRESSIVE TIMELINE ACTIVATED!');
    } catch (error) {
      console.error('Failed to start accelerated operation:', error);
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

  const milestoneProgress = trillionPathEngine.getMilestoneProgress();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="h-8 w-8 text-purple-400" />
            Accelerated Trillion Path Engine
            {isSupervisorRunning && <Clock className="h-6 w-6 text-green-400 animate-pulse" />}
          </h1>
          <p className="text-gray-300">
            {isSupervisorRunning ? '🔥 AGGRESSIVE EXECUTION: $10K Day 1 → $1M Week 1 → $1T Year 1' : 'Ready for accelerated trillion-path execution'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartContinuous}
            disabled={isSupervisorRunning}
            className="bg-red-600 hover:bg-red-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start ACCELERATED Mode
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

      {/* Accelerated Timeline Status */}
      {isSupervisorRunning && (
        <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-red-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400 animate-pulse" />
              ACCELERATED EXECUTION MODE - Real Revenue Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Real Revenue</div>
                <div className="text-green-400 font-bold text-lg">${formatValue(metrics.realRevenue)}</div>
              </div>
              <div>
                <div className="text-gray-300">Growth Rate</div>
                <div className="text-red-400 font-bold">{((metrics.compoundGrowthRate - 1) * 100).toFixed(2)}% per cycle</div>
              </div>
              <div>
                <div className="text-gray-300">Execution Successes</div>
                <div className="text-yellow-400 font-bold">{metrics.executionSuccesses}</div>
              </div>
              <div>
                <div className="text-gray-300">Active Conversions</div>
                <div className="text-blue-400 font-bold">{metrics.activeConversions}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestone Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-400" />
              Day 1 Target: $10K
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">
                {milestoneProgress.day1.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-400">
                Current: ${formatValue(metrics.realRevenue)}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, milestoneProgress.day1)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-400" />
              Week 1 Target: $1M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">
                {milestoneProgress.week1.toFixed(4)}%
              </div>
              <div className="text-sm text-gray-400">
                Target: $1,000,000
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, milestoneProgress.week1)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              Month 1 Target: $100M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-400">
                {milestoneProgress.month1.toFixed(6)}%
              </div>
              <div className="text-sm text-gray-400">
                Target: $100,000,000
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, milestoneProgress.month1)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accelerated Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Accelerated Cycles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-400">
              {formatValue(metrics.femtosecondCycles)}
            </div>
            <div className="text-xs text-gray-400">25ms ultra-fast iterations</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Opportunity Multiplier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-400">
              {metrics.opportunityMultiplier.toFixed(2)}x
            </div>
            <div className="text-xs text-gray-400">Compound opportunity detection</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Execution Agent Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-cyan-400">
              {formatValue(metrics.virtualizedAgents)}
            </div>
            <div className="text-xs text-gray-400">Active execution agents</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Execution Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-400">
              {formatValue(metrics.taskThroughput)}/s
            </div>
            <div className="text-xs text-gray-400">Real business actions/sec</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Execution Status */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-400" />
            Accelerated AGI Execution Status
            {isSupervisorRunning && <span className="text-red-400 text-sm animate-pulse">● AGGRESSIVE EXECUTION</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-medium mb-2">Execution Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Revenue Velocity:</span>
                  <span className="text-green-400">${formatValue(metrics.revenueVelocity)}/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Customer Acquisition:</span>
                  <span className="text-blue-400">{metrics.customerAcquisitionRate}/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Market Opportunities:</span>
                  <span className="text-yellow-400">{metrics.marketOpportunities} active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Time to $1T:</span>
                  <span className="text-purple-400">{trillionPathEngine.getEstimatedTimeToTrillion()}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Accelerated Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Execution Mode:</span>
                  <span className={isSupervisorRunning ? 'text-red-400' : 'text-yellow-400'}>
                    {isSupervisorRunning ? 'AGGRESSIVE' : 'Manual Control'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Growth Rate:</span>
                  <span className="text-red-400">{((metrics.compoundGrowthRate - 1) * 100).toFixed(3)}%/cycle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Next Milestone:</span>
                  <span className="text-orange-400">
                    {metrics.realRevenue < 10000 ? '$10K Day 1' : 
                     metrics.realRevenue < 1000000 ? '$1M Week 1' : 
                     metrics.realRevenue < 100000000 ? '$100M Month 1' : '$1T Year 1'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Daily Projection:</span>
                  <span className="text-cyan-400">${formatValue(trillionPathEngine.getDailyRevenueProjection())}</span>
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
