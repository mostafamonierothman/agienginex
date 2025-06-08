
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Square, Activity, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { enhancedAutonomousLoop } from '@/loops/EnhancedAutonomousLoop';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';

const AGIV4SystemControls = () => {
  const [systemStatus, setSystemStatus] = useState({ isRunning: false, cycleCount: 0, totalAgents: 20 });
  const [registryStatus, setRegistryStatus] = useState({ totalAgents: 0, coreAgents: 0, enhancedAgents: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(enhancedAutonomousLoop.getStatus());
      setRegistryStatus(agentRegistry.getSystemStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startSystem = async () => {
    try {
      await enhancedAutonomousLoop.start();
      toast({
        title: "🚀 AGI V4.5+ System Started",
        description: `Enhanced autonomous loop with ${registryStatus.totalAgents} agents is now active`,
      });
    } catch (error) {
      toast({
        title: "❌ System Start Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stopSystem = () => {
    enhancedAutonomousLoop.stop();
    toast({
      title: "⏹️ AGI System Stopped",
      description: "All autonomous operations have been halted",
    });
  };

  const resetSystem = async () => {
    stopSystem();
    
    // Wait a moment then restart
    setTimeout(async () => {
      await startSystem();
      toast({
        title: "🔄 System Reset Complete",
        description: "AGI V4.5+ system has been reset and restarted",
      });
    }, 1000);
  };

  const runRandomAgent = async () => {
    try {
      await enhancedAutonomousLoop.runRandomEnhancedAgent();
      toast({
        title: "🎲 Random Agent Executed",
        description: "A random agent has been selected and executed",
      });
    } catch (error) {
      toast({
        title: "❌ Random Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const emergencyProtocol = async () => {
    try {
      stopSystem();
      
      // Run security and critic agents for system analysis
      const context = {
        user_id: 'emergency_protocol',
        timestamp: new Date().toISOString()
      };

      await agentRegistry.runAgent('SecurityAgent', context);
      await agentRegistry.runAgent('CriticAgent', context);
      await agentRegistry.runAgent('MetaAgent', context);

      toast({
        title: "🚨 Emergency Protocol Activated",
        description: "System stopped and security analysis initiated",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "❌ Emergency Protocol Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-600/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5 text-purple-400" />
          AGI V4.5+ System Controls
        </CardTitle>
        
        {/* System Status */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant={systemStatus.isRunning ? "default" : "secondary"} className="bg-green-600 text-white">
            {systemStatus.isRunning ? "🟢 ACTIVE" : "🔴 STOPPED"}
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Cycle #{systemStatus.cycleCount}
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {registryStatus.totalAgents} Agents
          </Badge>
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {registryStatus.coreAgents} Core
          </Badge>
          <Badge variant="outline" className="text-pink-400 border-pink-400">
            {registryStatus.enhancedAgents} Enhanced
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Primary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {!systemStatus.isRunning ? (
            <Button
              onClick={startSystem}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start V4.5+ System
            </Button>
          ) : (
            <Button
              onClick={stopSystem}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop System
            </Button>
          )}
          
          <Button
            onClick={resetSystem}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset System
          </Button>
          
          <Button
            onClick={runRandomAgent}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            Random Agent
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={emergencyProtocol}
            variant="destructive"
            className="bg-orange-600 hover:bg-orange-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            🚨 Emergency Protocol
          </Button>
          
          <Button
            onClick={() => {
              const status = agentRegistry.getSystemStatus();
              toast({
                title: "📊 System Status",
                description: `${status.totalAgents} agents ready • Version ${status.version}`,
              });
            }}
            variant="outline"
            className="border-slate-500 text-slate-200 hover:bg-slate-700"
          >
            <Activity className="h-4 w-4 mr-2" />
            System Status
          </Button>
        </div>

        {/* System Information */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/30">
          <h4 className="text-white font-medium mb-2">AGI V4.5+ Enhanced System</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-gray-400">Total Agents</div>
              <div className="text-white font-semibold">{registryStatus.totalAgents}</div>
            </div>
            <div>
              <div className="text-gray-400">Core Agents</div>
              <div className="text-blue-300 font-semibold">{registryStatus.coreAgents}</div>
            </div>
            <div>
              <div className="text-gray-400">Enhanced Agents</div>
              <div className="text-purple-300 font-semibold">{registryStatus.enhancedAgents}</div>
            </div>
            <div>
              <div className="text-gray-400">System Version</div>
              <div className="text-green-300 font-semibold">{registryStatus.version}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AGIV4SystemControls;
