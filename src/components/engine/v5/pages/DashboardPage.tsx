
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Settings, Zap, Target, Database } from 'lucide-react';
import { enhancedFemtosecondSupervisor } from '@/engine/EnhancedFemtosecondSupervisor';
import { agentRegistry } from '@/config/AgentRegistry';
import { TrillionPathPersistence } from '@/services/TrillionPathPersistence';

const DashboardPage = () => {
  const [agiStatus, setAgiStatus] = useState(null);
  const [systemState, setSystemState] = useState(null);
  const [agentCount, setAgentCount] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Update status every 3 seconds
    const interval = setInterval(() => {
      const status = enhancedFemtosecondSupervisor.getStatus();
      const state = TrillionPathPersistence.loadState();
      const agents = agentRegistry.getAllAgents();
      
      setAgiStatus(status);
      setSystemState(state);
      setAgentCount(Array.isArray(agents) ? agents.length : 0);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startEnhancedAGI = async () => {
    setIsStarting(true);
    try {
      await enhancedFemtosecondSupervisor.startEnhancedAGISupervision();
    } catch (error) {
      console.error('Failed to start Enhanced AGI:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const stopEnhancedAGI = () => {
    enhancedFemtosecondSupervisor.stop();
  };

  return (
    <div className="space-y-6">
      {/* AGI System Status Header */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            AGIengineX Enhanced Dashboard
            <Badge variant={agiStatus?.isRunning ? "default" : "secondary"} className="ml-auto">
              {agiStatus?.isRunning ? "ACTIVE" : "STANDBY"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">System Cycles</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {agiStatus?.cycleCount || 0}
              </div>
              <div className="text-xs text-gray-400">
                AGI Decisions: {agiStatus?.agiCycleCount || 0}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Autonomy Ratio</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {((agiStatus?.autonomyRatio || 0) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Active Agents</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {agentCount}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">Runtime</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {agiStatus?.runtimeFormatted || "0m"}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {!agiStatus?.isRunning ? (
              <Button 
                onClick={startEnhancedAGI} 
                disabled={isStarting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isStarting ? "Starting..." : "🚀 Start Enhanced AGI"}
              </Button>
            ) : (
              <Button 
                onClick={stopEnhancedAGI} 
                variant="destructive"
              >
                ⏹️ Stop AGI System
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Operations */}
      {agiStatus?.lastOperations && (
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">Recent AGI Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-gray-400">Last Reflection</span>
                <div className="text-white">{agiStatus.lastOperations.lastReflection}</div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-400">Last Feedback</span>
                <div className="text-white">{agiStatus.lastOperations.lastFeedback}</div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-400">Last Goal Evaluation</span>
                <div className="text-white">{agiStatus.lastOperations.lastGoalEvaluation}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Persistence Status */}
      {systemState && (
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">System Persistence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Auto Restart</span>
                <Badge variant={systemState.autoRestart ? "default" : "secondary"}>
                  {systemState.autoRestart ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update</span>
                <span className="text-white">{new Date(systemState.lastUpdate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Enhanced AGI</span>
                <Badge variant={systemState.enhancedAGI ? "default" : "secondary"}>
                  {systemState.enhancedAGI ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
