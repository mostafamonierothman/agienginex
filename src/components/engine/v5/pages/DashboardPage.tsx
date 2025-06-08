
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Zap, TrendingUp } from 'lucide-react';
import { enhancedAutonomousLoop } from '@/loops/EnhancedAutonomousLoop';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';
import KPIWidget from '../components/KPIWidget';

const DashboardPage = () => {
  const [systemStatus, setSystemStatus] = useState('AUTONOMOUS');
  const [kpis, setKpis] = useState({
    cycles: 0,
    activeAgents: 19,
    projectsCompleted: 3,
    totalOperations: 1247
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const status = enhancedAutonomousLoop.getStatus();
      const registryStatus = agentRegistry.getSystemStatus();
      
      setKpis(prev => ({
        ...prev,
        cycles: status.cycleCount,
        activeAgents: registryStatus.totalAgents
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const startAutonomous = async () => {
    try {
      await enhancedAutonomousLoop.start();
      toast({
        title: "🚀 V5 Autonomous System Started",
        description: "All agents are now running autonomously",
      });
    } catch (error) {
      toast({
        title: "❌ Failed to Start",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const startParallelFarm = () => {
    toast({
      title: "🔄 Parallel Farm Started",
      description: "Running agents in parallel mode",
    });
  };

  const stopAll = () => {
    enhancedAutonomousLoop.stop();
    toast({
      title: "⏹️ All Systems Stopped",
      description: "All autonomous operations halted",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">AGI V5 Dashboard</h1>
        <Badge variant="outline" className="text-green-400 border-green-400 self-start sm:self-auto">
          {systemStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPIWidget 
          label="System Status" 
          value={systemStatus} 
          icon={<Activity className="h-4 w-4 md:h-5 md:w-5" />}
          color="green"
        />
        <KPIWidget 
          label="Cycles" 
          value={kpis.cycles} 
          icon={<Brain className="h-4 w-4 md:h-5 md:w-5" />}
          color="blue"
        />
        <KPIWidget 
          label="Active Agents" 
          value={kpis.activeAgents} 
          icon={<Zap className="h-4 w-4 md:h-5 md:w-5" />}
          color="purple"
        />
        <KPIWidget 
          label="Projects Completed" 
          value={kpis.projectsCompleted} 
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5" />}
          color="cyan"
        />
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-white text-lg md:text-xl">System Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              onClick={startAutonomous}
              className="bg-green-600 hover:bg-green-700 text-white h-11 md:h-10 text-sm md:text-base"
            >
              Start Autonomous
            </Button>
            <Button
              onClick={startParallelFarm}
              className="bg-yellow-600 hover:bg-yellow-700 text-white h-11 md:h-10 text-sm md:text-base"
            >
              Start Parallel Farm
            </Button>
            <Button
              onClick={stopAll}
              className="bg-red-600 hover:bg-red-700 text-white h-11 md:h-10 text-sm md:text-base"
            >
              Stop All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-white text-lg md:text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            <div className="text-sm md:text-base text-green-400">✅ SupervisorAgent: System monitoring active</div>
            <div className="text-sm md:text-base text-blue-400">🔍 ResearchAgent: Scanning external sources</div>
            <div className="text-sm md:text-base text-purple-400">🧠 LearningAgentV2: Adapting strategies</div>
            <div className="text-sm md:text-base text-cyan-400">🌐 BrowserAgent: Web scraping complete</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
