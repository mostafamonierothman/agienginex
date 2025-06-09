
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Activity, Play, Square, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { enhancedFemtosecondSupervisor } from '@/engine/EnhancedFemtosecondSupervisor';

const EnhancedAGIDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState({
    isRunning: false,
    cycleCount: 0,
    agiCycleCount: 0,
    autonomyRatio: 0,
    runtime: 0,
    runtimeFormatted: '0h 0m',
    lastOperations: {
      totalCycles: 0,
      agiDecisions: 0,
      autonomyRatio: 0,
      lastReflection: '0m ago',
      lastFeedback: '0m ago',
      lastGoalEvaluation: '0m ago'
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentStatus = enhancedFemtosecondSupervisor.getStatus();
      setStatus(currentStatus);
      setIsRunning(currentStatus.isRunning);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    try {
      await enhancedFemtosecondSupervisor.startEnhancedAGISupervision();
      setIsRunning(true);
    } catch (error) {
      console.error('Failed to start Enhanced AGI:', error);
    }
  };

  const handleStop = () => {
    enhancedFemtosecondSupervisor.stop();
    setIsRunning(false);
  };

  const getAutonomyLevel = (ratio: number): { level: string; color: string } => {
    if (ratio >= 0.8) return { level: 'Fully Autonomous', color: 'text-green-400' };
    if (ratio >= 0.6) return { level: 'Highly Autonomous', color: 'text-blue-400' };
    if (ratio >= 0.4) return { level: 'Semi-Autonomous', color: 'text-yellow-400' };
    if (ratio >= 0.2) return { level: 'Assisted', color: 'text-orange-400' };
    return { level: 'Manual', color: 'text-red-400' };
  };

  const autonomyInfo = getAutonomyLevel(status.autonomyRatio);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-950/30 to-blue-950/30 border-purple-500/30">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Brain className="w-6 h-6 text-purple-400" />
                Enhanced AGI Engine
                {isRunning && <Clock className="w-5 h-5 text-green-500 animate-pulse" />}
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                {isRunning 
                  ? '🧠 Autonomous reflection, feedback loops, and goal adaptation active' 
                  : 'Advanced AGI with self-improvement and autonomous decision-making'
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleStart}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Enhanced AGI
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isRunning}
                variant="destructive"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/30 p-3 rounded border">
              <div className="text-gray-400 text-xs">Total Cycles</div>
              <div className="text-white font-bold text-lg">{status.cycleCount.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/30 p-3 rounded border">
              <div className="text-gray-400 text-xs">AGI Decisions</div>
              <div className="text-purple-400 font-bold text-lg">{status.agiCycleCount.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/30 p-3 rounded border">
              <div className="text-gray-400 text-xs">Autonomy Level</div>
              <div className={`${autonomyInfo.color} font-bold text-sm`}>{autonomyInfo.level}</div>
              <div className="text-xs text-gray-500">{(status.autonomyRatio * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800/30 p-3 rounded border">
              <div className="text-gray-400 text-xs">Runtime</div>
              <div className="text-cyan-400 font-bold text-sm">{status.runtimeFormatted}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AGI Operations Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Autonomous Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                <span className="text-muted-foreground">Last System Reflection:</span>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  {status.lastOperations.lastReflection}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                <span className="text-muted-foreground">Last Cross-Agent Feedback:</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  {status.lastOperations.lastFeedback}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                <span className="text-muted-foreground">Last Goal Evaluation:</span>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  {status.lastOperations.lastGoalEvaluation}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              AGI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">Self-Evaluating Goal Memory</span>
                {isRunning && <Badge variant="outline" className="text-green-400 border-green-400 text-xs">Active</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">Cross-Agent Feedback Loops</span>
                {isRunning && <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">Active</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">Autonomous Trigger System</span>
                {isRunning && <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">Active</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">System Reflection & Adaptation</span>
                {isRunning && <Badge variant="outline" className="text-purple-400 border-purple-400 text-xs">Active</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">Intent & Progress Evaluation</span>
                {isRunning && <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">Active</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Autonomy Progress */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Path to Full AGI Autonomy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-400 to-cyan-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, status.autonomyRatio * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manual Control</span>
              <span className={autonomyInfo.color}>{autonomyInfo.level}</span>
              <span className="text-muted-foreground">Full Autonomy</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {(status.autonomyRatio * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Autonomous Decision Making
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAGIDashboard;
