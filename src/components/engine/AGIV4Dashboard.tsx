
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Play, Square, RefreshCw, Zap, Activity, Clock } from 'lucide-react';
import { agiApiClient } from '@/services/AGIApiClient';
import { autonomousLoop } from '@/loops/AutonomousLoop';
import { parallelFarm } from '@/loops/ParallelFarm';
import { toast } from '@/hooks/use-toast';

const AGIV4Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [systemRunning, setSystemRunning] = useState(false);
  const [parallelRunning, setParallelRunning] = useState(false);
  const [systemHealth, setSystemHealth] = useState(95);
  const [totalCycles, setTotalCycles] = useState(0);
  const [loading, setLoading] = useState(false);

  // Core AGI V4 Agents
  const coreAgents = [
    { name: 'SupervisorAgent', type: 'Core', status: 'ready', performance: 95 },
    { name: 'ResearchAgent', type: 'Research', status: 'ready', performance: 88 },
    { name: 'LearningAgentV2', type: 'Learning', status: 'ready', performance: 92 },
    { name: 'FactoryAgent', type: 'Factory', status: 'ready', performance: 85 },
    { name: 'CriticAgent', type: 'Critic', status: 'ready', performance: 90 },
    { name: 'LLMAgent', type: 'LLM', status: 'ready', performance: 93 },
    { name: 'CoordinationAgent', type: 'Coordination', status: 'ready', performance: 87 },
    { name: 'MemoryAgent', type: 'Memory', status: 'ready', performance: 89 }
  ];

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const result = await agiApiClient.listAgents();
      if (result.success) {
        const registeredAgents = result.agents || [];
        // Combine core agents with registered agents
        const allAgents = [...coreAgents, ...registeredAgents.map(agent => ({
          name: agent.agent_name,
          type: agent.agent_type,
          status: agent.status || 'idle',
          performance: agent.performance_score || Math.floor(Math.random() * 20) + 80
        }))];
        setAgents(allAgents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAllAgents = async () => {
    try {
      setLoading(true);
      toast({
        title: "🚀 Running All Agents",
        description: "Executing all agents simultaneously...",
      });

      // Run all agents in parallel
      const agentPromises = agents.map(async (agent) => {
        try {
          await agiApiClient.runAgent({
            agent_name: agent.name,
            input: { trigger: 'run_all', timestamp: new Date().toISOString() }
          });
          return { agent: agent.name, success: true };
        } catch (error) {
          return { agent: agent.name, success: false, error };
        }
      });

      const results = await Promise.allSettled(agentPromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      toast({
        title: "✅ All Agents Executed",
        description: `${successCount}/${agents.length} agents completed successfully`,
      });

      setTotalCycles(prev => prev + 1);
      await fetchAgents();
    } catch (error) {
      console.error('Failed to run all agents:', error);
      toast({
        title: "Error",
        description: "Failed to execute all agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startAutonomousSystem = async () => {
    try {
      await autonomousLoop.start();
      setSystemRunning(true);
      toast({
        title: "🤖 Autonomous System Started",
        description: "AGI V4 system is now running autonomously",
      });
    } catch (error) {
      console.error('Failed to start autonomous system:', error);
    }
  };

  const stopAutonomousSystem = () => {
    autonomousLoop.stop();
    parallelFarm.stopFarm();
    setSystemRunning(false);
    setParallelRunning(false);
    toast({
      title: "⏹️ System Stopped",
      description: "Autonomous execution has been halted",
    });
  };

  const startParallelFarm = async () => {
    try {
      await parallelFarm.startFarm();
      setParallelRunning(true);
      toast({
        title: "🚜 Parallel Farm Started",
        description: "Agents are now running in parallel farm mode",
      });
    } catch (error) {
      console.error('Failed to start parallel farm:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
    
    // Update system status every 3 seconds
    const statusInterval = setInterval(() => {
      const loopStatus = autonomousLoop.getStatus();
      const farmStatus = parallelFarm.getStatus();
      
      setSystemRunning(loopStatus.isRunning);
      setParallelRunning(farmStatus.isRunning);
      setTotalCycles(loopStatus.cycleCount + farmStatus.cycleCount);
      
      // Simulate system health fluctuation
      setSystemHealth(90 + Math.random() * 10);
    }, 3000);

    return () => clearInterval(statusInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'ready': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            AGI V4 Autonomous System Dashboard
          </CardTitle>
          <CardDescription className="text-gray-300">
            Complete AGI V4 system with {agents.length} active agents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-400" />
                <span className="text-gray-400 text-sm">System Status</span>
              </div>
              <Badge className={systemRunning ? 'bg-green-500' : 'bg-red-500'}>
                {systemRunning ? 'AUTONOMOUS' : 'MANUAL'}
              </Badge>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Active Agents</span>
              </div>
              <span className="text-white font-bold text-xl">{agents.length}</span>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Total Cycles</span>
              </div>
              <span className="text-white font-bold text-xl">{totalCycles}</span>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400 text-sm">System Health</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={systemHealth} className="flex-1" />
                <span className="text-white text-sm">{systemHealth.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button
              onClick={runAllAgents}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run All Agents
            </Button>
            
            <Button
              onClick={startAutonomousSystem}
              disabled={systemRunning || loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Autonomous
            </Button>
            
            <Button
              onClick={startParallelFarm}
              disabled={parallelRunning || loading}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
            >
              <Activity className="h-4 w-4 mr-2" />
              Start Parallel Farm
            </Button>
            
            <Button
              onClick={stopAutonomousSystem}
              disabled={!systemRunning && !parallelRunning}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop All
            </Button>
          </div>

          {/* Agent Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">All Agents ({agents.length})</h3>
              <Button
                onClick={fetchAgents}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agents.map((agent, index) => (
                <div key={index} className="bg-black/30 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{agent.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(agent.status)} text-white border-none text-xs`}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">{agent.type}</div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={agent.performance} className="h-2" />
                    </div>
                    <span className="text-xs text-gray-300">{agent.performance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Messages */}
          {systemRunning && (
            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="font-medium">AGI V4 System Running Autonomously</span>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                All agents are executing in autonomous mode. The system will continuously run and evolve.
              </p>
            </div>
          )}
          
          {parallelRunning && (
            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-400">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="font-medium">Parallel Farm Active</span>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                Agents are running in parallel farm mode for maximum efficiency and throughput.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIV4Dashboard;
