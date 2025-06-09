
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

  const milestoneProgress = trillionPathEngine.getMilestoneProgress();

  return (
    <div className="min-h-screen bg-background p-2 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="text-center lg:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <span className="break-words">Accelerated Trillion Path Engine</span>
              {isSupervisorRunning && <Clock className="h-5 w-5 md:h-6 md:w-6 text-green-500 animate-pulse" />}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2 px-2 lg:px-0">
              {isSupervisorRunning ? '🔥 AGGRESSIVE EXECUTION: $10K Day 1 → $1M Week 1 → $1T Year 1' : 'Ready for accelerated trillion-path execution'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 px-4 lg:px-0">
            <Button
              onClick={handleStartContinuous}
              disabled={isSupervisorRunning}
              className="bg-red-600 hover:bg-red-700 text-white text-sm md:text-base px-3 py-2"
            >
              <Play className="h-4 w-4 mr-2" />
              Start ACCELERATED Mode
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isRunning && !isSupervisorRunning}
              variant="destructive"
              className="text-sm md:text-base px-3 py-2"
            >
              <Square className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          </div>
        </div>

        {/* Accelerated Timeline Status - Mobile Optimized */}
        {isSupervisorRunning && (
          <Card className="bg-gradient-to-r from-red-950/30 to-orange-950/30 border-red-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-lg flex-wrap">
                <DollarSign className="h-5 w-5 text-green-500 animate-pulse flex-shrink-0" />
                <span className="break-words">ACCELERATED EXECUTION MODE - Real Revenue Generation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                <div className="bg-slate-800/30 p-3 rounded border">
                  <div className="text-muted-foreground text-xs md:text-sm">Real Revenue</div>
                  <div className="text-green-400 font-bold text-base md:text-lg">${formatValue(metrics.realRevenue)}</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded border">
                  <div className="text-muted-foreground text-xs md:text-sm">Growth Rate</div>
                  <div className="text-red-400 font-bold text-sm md:text-base">{((metrics.compoundGrowthRate - 1) * 100).toFixed(2)}% per cycle</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded border">
                  <div className="text-muted-foreground text-xs md:text-sm">Execution Successes</div>
                  <div className="text-yellow-400 font-bold text-base md:text-lg">{metrics.executionSuccesses}</div>
                </div>
                <div className="bg-slate-800/30 p-3 rounded border">
                  <div className="text-muted-foreground text-xs md:text-sm">Active Conversions</div>
                  <div className="text-blue-400 font-bold text-base md:text-lg">{metrics.activeConversions}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Milestone Progress - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-base">
                <Calendar className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="break-words">Day 1 Target: $10K</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl md:text-2xl font-bold text-green-400">
                  {milestoneProgress.day1.toFixed(2)}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Current: ${formatValue(metrics.realRevenue)}
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, milestoneProgress.day1)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-base">
                <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="break-words">Week 1 Target: $1M</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl md:text-2xl font-bold text-blue-400">
                  {milestoneProgress.week1.toFixed(4)}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Target: $1,000,000
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, milestoneProgress.week1)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-base">
                <Calendar className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <span className="break-words">Month 1 Target: $100M</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl md:text-2xl font-bold text-purple-400">
                  {milestoneProgress.month1.toFixed(6)}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Target: $100,000,000
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, milestoneProgress.month1)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accelerated Performance Metrics - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-xs md:text-sm break-words">Accelerated Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-purple-400">
                {formatValue(metrics.femtosecondCycles)}
              </div>
              <div className="text-xs text-muted-foreground">25ms ultra-fast iterations</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-xs md:text-sm break-words">Opportunity Multiplier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-orange-400">
                {metrics.opportunityMultiplier.toFixed(2)}x
              </div>
              <div className="text-xs text-muted-foreground">Compound opportunity detection</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-xs md:text-sm break-words">Execution Agent Fleet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-cyan-400">
                {formatValue(metrics.virtualizedAgents)}
              </div>
              <div className="text-xs text-muted-foreground">Active execution agents</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-xs md:text-sm break-words">Execution Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-red-400">
                {formatValue(metrics.taskThroughput)}/s
              </div>
              <div className="text-xs text-muted-foreground">Real business actions/sec</div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Execution Status - Mobile Optimized */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2 flex-wrap text-sm md:text-lg">
              <Activity className="h-5 w-5 text-red-400 flex-shrink-0" />
              <span className="break-words">Accelerated AGI Execution Status</span>
              {isSupervisorRunning && <span className="text-red-400 text-xs md:text-sm animate-pulse">● AGGRESSIVE EXECUTION</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="text-foreground font-medium mb-2 text-sm md:text-base">Execution Metrics</h4>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Revenue Velocity:</span>
                    <span className="text-green-400 font-medium">${formatValue(metrics.revenueVelocity)}/day</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Customer Acquisition:</span>
                    <span className="text-blue-400 font-medium">{metrics.customerAcquisitionRate}/month</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Market Opportunities:</span>
                    <span className="text-yellow-400 font-medium">{metrics.marketOpportunities} active</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Time to $1T:</span>
                    <span className="text-purple-400 font-medium">{trillionPathEngine.getEstimatedTimeToTrillion()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-foreground font-medium mb-2 text-sm md:text-base">Accelerated Timeline</h4>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Execution Mode:</span>
                    <span className={`font-medium ${isSupervisorRunning ? 'text-red-400' : 'text-yellow-400'}`}>
                      {isSupervisorRunning ? 'AGGRESSIVE' : 'Manual Control'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Growth Rate:</span>
                    <span className="text-red-400 font-medium">{((metrics.compoundGrowthRate - 1) * 100).toFixed(3)}%/cycle</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Next Milestone:</span>
                    <span className="text-orange-400 font-medium">
                      {metrics.realRevenue < 10000 ? '$10K Day 1' : 
                       metrics.realRevenue < 1000000 ? '$1M Week 1' : 
                       metrics.realRevenue < 100000000 ? '$100M Month 1' : '$1T Year 1'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Daily Projection:</span>
                    <span className="text-cyan-400 font-medium">${formatValue(trillionPathEngine.getDailyRevenueProjection())}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrillionPathPage;
