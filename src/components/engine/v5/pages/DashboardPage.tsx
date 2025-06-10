
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Settings, Zap, Target, Database } from 'lucide-react';
import { enhancedFemtosecondSupervisor } from '@/engine/EnhancedFemtosecondSupervisor';
import { agentRegistry } from '@/config/AgentRegistry';
import { TrillionPathPersistence } from '@/services/TrillionPathPersistence';
import { SupabaseMemoryService } from '@/services/SupabaseMemoryService';
import { toast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const [agiStatus, setAgiStatus] = useState(null);
  const [systemState, setSystemState] = useState(null);
  const [agentCount, setAgentCount] = useState(0);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    // Update status every 3 seconds
    const interval = setInterval(() => {
      try {
        const status = enhancedFemtosecondSupervisor.getStatus();
        const state = TrillionPathPersistence.loadState();
        const agents = agentRegistry.getAllAgents();
        
        setAgiStatus(status);
        setSystemState(state);
        setAgentCount(Array.isArray(agents) ? agents.length : 0);
      } catch (error) {
        console.error('Error updating dashboard status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const startEnhancedAGI = async () => {
    setIsStarting(true);
    try {
      console.log('🚀 Starting Enhanced AGI from Dashboard...');
      
      // Start the enhanced supervisor
      await enhancedFemtosecondSupervisor.startEnhancedAGISupervision();
      
      // Log the start event
      await SupabaseMemoryService.saveExecutionLog('DashboardPage', 'start_enhanced_agi', {
        success: true,
        message: 'Enhanced AGI started from dashboard',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "🚀 Enhanced AGI Started",
        description: "AGI supervision is now running with autonomous agents",
      });
      
      console.log('✅ Enhanced AGI started successfully');
    } catch (error) {
      console.error('Failed to start Enhanced AGI:', error);
      
      toast({
        title: "❌ Failed to Start AGI",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsStarting(false);
    }
  };

  const stopEnhancedAGI = async () => {
    try {
      enhancedFemtosecondSupervisor.stop();
      
      await SupabaseMemoryService.saveExecutionLog('DashboardPage', 'stop_enhanced_agi', {
        success: true,
        message: 'Enhanced AGI stopped from dashboard',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "⏹️ Enhanced AGI Stopped",
        description: "AGI supervision has been halted",
      });
    } catch (error) {
      console.error('Failed to stop Enhanced AGI:', error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* AGI System Status Header */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl lg:text-2xl text-white flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <Brain className="h-6 w-6 md:h-7 lg:h-8 md:w-7 lg:w-8 text-purple-400 flex-shrink-0" />
              <span className="break-words">AGIengineX Enhanced Dashboard</span>
            </div>
            <Badge variant={agiStatus?.isRunning ? "default" : "secondary"} className="w-fit">
              {agiStatus?.isRunning ? "ACTIVE" : "STANDBY"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="space-y-2 p-3 bg-slate-800/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-xs md:text-sm text-gray-300">System Cycles</span>
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                {agiStatus?.cycleCount || 0}
              </div>
              <div className="text-xs text-gray-400">
                AGI Decisions: {agiStatus?.agiCycleCount || 0}
              </div>
            </div>
            
            <div className="space-y-2 p-3 bg-slate-800/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs md:text-sm text-gray-300">Autonomy Ratio</span>
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                {((agiStatus?.autonomyRatio || 0) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2 p-3 bg-slate-800/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-xs md:text-sm text-gray-300">Active Agents</span>
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                {agentCount}
              </div>
            </div>

            <div className="space-y-2 p-3 bg-slate-800/30 rounded-lg border border-slate-600/20">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-purple-400" />
                <span className="text-xs md:text-sm text-gray-300">Runtime</span>
              </div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                {agiStatus?.runtimeFormatted || "0m"}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {!agiStatus?.isRunning ? (
              <Button 
                onClick={startEnhancedAGI} 
                disabled={isStarting}
                className="bg-purple-600 hover:bg-purple-700 text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
              >
                {isStarting ? "Starting..." : "🚀 Start Enhanced AGI"}
              </Button>
            ) : (
              <Button 
                onClick={stopEnhancedAGI} 
                variant="destructive"
                className="text-sm md:text-base px-4 py-2 md:px-6 md:py-3"
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
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg md:text-xl">Recent AGI Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2 p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-sm text-gray-400">Last Reflection</span>
                <div className="text-white text-sm break-words">{agiStatus.lastOperations.lastReflection}</div>
              </div>
              <div className="space-y-2 p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-sm text-gray-400">Last Feedback</span>
                <div className="text-white text-sm break-words">{agiStatus.lastOperations.lastFeedback}</div>
              </div>
              <div className="space-y-2 p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-sm text-gray-400">Last Goal Evaluation</span>
                <div className="text-white text-sm break-words">{agiStatus.lastOperations.lastGoalEvaluation}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Persistence Status */}
      {systemState && (
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg md:text-xl">System Persistence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-gray-400 text-sm">Auto Restart</span>
                <Badge variant={systemState.autoRestart ? "default" : "secondary"}>
                  {systemState.autoRestart ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-gray-400 text-sm">Last Update</span>
                <span className="text-white text-sm">{new Date(systemState.lastUpdate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded border border-slate-600/20">
                <span className="text-gray-400 text-sm">Enhanced AGI</span>
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
