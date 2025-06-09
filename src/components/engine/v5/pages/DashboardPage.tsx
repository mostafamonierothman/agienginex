import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Zap, TrendingUp, Database, RefreshCw } from 'lucide-react';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';
import { startDeepAutonomousLoop, stopDeepAutonomousLoop, shouldAutoStartDeepLoop, getDeepLoopMetrics, resetDeepLoopMetrics } from '@/engine/DeepAutonomousLoopController';
import { useAGIStatePersistence } from '@/hooks/usePersistence';
import KPIWidget from '../components/KPIWidget';
import AutonomousLoopController from '../components/AutonomousLoopController';
import PersistenceStatus from '../components/PersistenceStatus';
import SystemRecovery from '../components/SystemRecovery';

interface SystemState {
  isRunning: boolean;
  lastUpdate: string;
  loopType?: string;
}

interface KPIState {
  cycles: number;
  activeAgents: number;
  projectsCompleted: number;
  totalOperations: number;
  loopSpeed: number;
  handoffs: number;
  collaborations: number;
  optimizations: number;
  errors: number;
}

const DashboardPage = () => {
  const [systemStatus, setSystemStatus] = useState('MANUAL');
  const [isDeepLoopRunning, setIsDeepLoopRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const {
    agents: persistedAgents,
    setAgents: setPersistedAgents,
    kpis: persistedKpis,
    setKpis: setPersistedKpis,
    systemState,
    setSystemState,
    isLoading: persistenceLoading
  } = useAGIStatePersistence();

  const [kpis, setKpis] = useState<KPIState>({
    cycles: 0,
    activeAgents: 0,
    projectsCompleted: 0,
    totalOperations: 0,
    loopSpeed: 3000,
    handoffs: 0,
    collaborations: 0,
    optimizations: 0,
    errors: 0
  });

  useEffect(() => {
    // Load agents from registry
    const registeredAgents = agentRegistry.getAllAgents();
    const agentData = registeredAgents.map(agent => ({
      name: agent.name,
      status: 'IDLE',
      lastAction: 'Ready for execution',
      category: agent.category,
      description: agent.description,
      version: agent.version,
      runner: agent.runner
    }));
    setAgents(agentData);

    // Update initial KPIs with real data
    setKpis(prev => ({
      ...prev,
      activeAgents: agentData.length
    }));

    // Auto-start deep loop if it was previously running
    if (shouldAutoStartDeepLoop() && agentData.length > 0) {
      console.log('Auto-starting Deep Autonomous Loop...');
      setIsDeepLoopRunning(true);
      setSystemStatus('DEEP_AUTONOMOUS');
      startDeepAutonomousLoop(
        agentData,
        setAgents,
        setLogs,
        setKpis,
        { 
          loopDelayMs: 3000, 
          maxCycles: 10000,
          enableHandoffs: true,
          enableCollaborations: true,
          adaptiveSpeed: true
        }
      );
      toast({
        title: "🚀 Auto-Resumed Deep Loop",
        description: "Enhanced autonomous system automatically resumed",
      });
    }

    // Load persisted KPIs if available
    if (persistedKpis && Object.keys(persistedKpis).length > 0) {
      setKpis(prev => ({ ...prev, ...persistedKpis }));
    }
  }, [persistedKpis]);

  useEffect(() => {
    const interval = setInterval(() => {
      const deepMetrics = getDeepLoopMetrics();
      const registryStatus = agentRegistry.getSystemStatus();
      
      setKpis(prev => {
        const updated = {
          ...prev,
          cycles: deepMetrics.cycles,
          activeAgents: registryStatus.totalAgents,
          handoffs: deepMetrics.handoffs,
          collaborations: deepMetrics.collaborations,
          optimizations: deepMetrics.optimizations,
          errors: deepMetrics.errors,
          totalOperations: prev.totalOperations + (deepMetrics.cycles > prev.cycles ? 1 : 0)
        };
        
        // Persist KPIs
        setPersistedKpis(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setPersistedKpis]);

  const startDeepLoop = async () => {
    try {
      setIsDeepLoopRunning(true);
      setSystemStatus('DEEP_AUTONOMOUS');
      
      startDeepAutonomousLoop(
        agents,
        setAgents,
        setLogs,
        setKpis,
        { 
          loopDelayMs: 3000, 
          maxCycles: 10000,
          enableHandoffs: true,
          enableCollaborations: true,
          adaptiveSpeed: true
        }
      );
      
      // Update system state
      const newSystemState: SystemState = {
        isRunning: true,
        lastUpdate: new Date().toISOString(),
        loopType: 'deep_autonomous'
      };
      setSystemState(newSystemState);
      
      toast({
        title: "🚀 Deep Autonomous Loop Started",
        description: "Enhanced system with handoffs and collaborations is now running",
      });
    } catch (error) {
      setIsDeepLoopRunning(false);
      setSystemStatus('MANUAL');
      toast({
        title: "❌ Failed to Start Deep Loop",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stopDeepLoop = () => {
    setIsDeepLoopRunning(false);
    setSystemStatus('MANUAL');
    stopDeepAutonomousLoop();
    
    const newSystemState: SystemState = {
      isRunning: false,
      lastUpdate: new Date().toISOString(),
      loopType: 'stopped'
    };
    setSystemState(newSystemState);
    
    toast({
      title: "⏹️ Deep Loop Stopped",
      description: "Manual control restored",
    });
  };

  const resetSystem = () => {
    stopDeepAutonomousLoop();
    resetDeepLoopMetrics();
    setKpis(prev => ({ 
      ...prev, 
      cycles: 0, 
      handoffs: 0, 
      collaborations: 0, 
      optimizations: 0, 
      errors: 0 
    }));
    setIsDeepLoopRunning(false);
    setSystemStatus('MANUAL');
    toast({
      title: "🔄 System Reset Complete",
      description: "All metrics reset to zero",
    });
  };

  const exportSystemData = () => {
    return {
      agents: persistedAgents,
      kpis: persistedKpis,
      systemState,
      timestamp: new Date().toISOString(),
      version: 'V7'
    };
  };

  const importSystemData = (data: any) => {
    if (data.agents) setPersistedAgents(data.agents);
    if (data.kpis) setPersistedKpis(data.kpis);
    if (data.systemState) setSystemState(data.systemState);
    
    toast({
      title: "📥 System Data Imported",
      description: "Successfully restored from backup",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AGI V7 Memory-Aware Dashboard</h1>
          <p className="text-gray-300 text-sm">Self-improving autonomous system with {kpis.activeAgents} agents + memory awareness</p>
        </div>
        <Badge variant="outline" className={`self-start sm:self-auto ${
          systemStatus === 'DEEP_AUTONOMOUS' 
            ? 'text-green-400 border-green-400' 
            : 'text-gray-400 border-gray-400'
        }`}>
          {systemStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPIWidget 
          label="System Status" 
          value={systemStatus} 
          icon={<Activity className="h-4 w-4 md:h-5 md:w-5" />}
          color={systemStatus === 'DEEP_AUTONOMOUS' ? 'green' : 'blue'}
        />
        <KPIWidget 
          label="Deep Cycles" 
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
          label="Handoffs" 
          value={kpis.handoffs} 
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5" />}
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Enhanced Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-300">Collaborations</div>
                <div className="text-cyan-400 font-bold">{kpis.collaborations}</div>
              </div>
              <div>
                <div className="text-gray-300">Optimizations</div>
                <div className="text-green-400 font-bold">{kpis.optimizations}</div>
              </div>
              <div>
                <div className="text-gray-300">Loop Speed</div>
                <div className="text-blue-400 font-bold">{kpis.loopSpeed}ms</div>
              </div>
              <div>
                <div className="text-gray-300">System Errors</div>
                <div className="text-red-400 font-bold">{kpis.errors}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <PersistenceStatus
          isLoading={persistenceLoading}
          error={null}
          lastSaved={systemState?.lastUpdate}
          backend="supabase"
        />
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-white text-lg md:text-xl">Deep Loop Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto">
            {isDeepLoopRunning && (
              <div className="text-sm md:text-base text-yellow-400 animate-pulse">
                🤖 Deep Loop Active: Cycle #{kpis.cycles} • {kpis.handoffs} handoffs • {kpis.collaborations} collaborations
              </div>
            )}
            {logs.slice(-5).map((log, index) => (
              <div key={index} className="text-sm md:text-base text-orange-400">
                🔄 {log.agent}: {log.action} → {log.result}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-gray-400 text-center py-4">
                No activity yet. Start the Deep Loop to see real-time agent interactions.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-white text-lg md:text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Deep Loop Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button
                onClick={startDeepLoop}
                disabled={isDeepLoopRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Start Deep Loop
              </Button>
              <Button
                onClick={stopDeepLoop}
                disabled={!isDeepLoopRunning}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Stop Deep Loop
              </Button>
              <Button
                onClick={resetSystem}
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div>
          </CardContent>
        </Card>

        <SystemRecovery
          onExport={exportSystemData}
          onRestore={importSystemData}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
