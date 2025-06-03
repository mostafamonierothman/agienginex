
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { multiAgentSupervisor, Agent } from '@/services/MultiAgentSupervisor';
import { fastAPIService } from '@/services/FastAPIService';
import { toast } from '@/hooks/use-toast';
import { useBackendPolling } from '@/hooks/useBackendPolling';
import MultiAgentHeader from './multi-agent/MultiAgentHeader';
import BackendConfiguration from './multi-agent/BackendConfiguration';
import AgentStatsGrid from './multi-agent/AgentStatsGrid';
import AgentStatusList from './multi-agent/AgentStatusList';
import LiveBackendData from './multi-agent/LiveBackendData';

const MultiAgentDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000');
  const [backendConnected, setBackendConnected] = useState(false);
  const [loopInterval, setLoopInterval] = useState(3000);
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    avgPerformance: 0,
    avgAutonomy: 0
  });

  // Use the new polling hook for live backend data
  const { backendData, isConnected, isPolling, refreshData } = useBackendPolling(isActive && backendConnected);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setAgents(multiAgentSupervisor.getAgents());
        setStats(multiAgentSupervisor.getAgentStats());
        setBackendConnected(multiAgentSupervisor.getBackendStatus());
        setLoopInterval(multiAgentSupervisor.getDynamicLoopInterval());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const startSupervision = async () => {
    // Update backend URL if changed
    if (backendUrl !== 'http://localhost:8000') {
      fastAPIService.setBaseUrl(backendUrl);
      multiAgentSupervisor.setBackendUrl(backendUrl);
    }

    await multiAgentSupervisor.startSupervision();
    setIsActive(true);
    toast({
      title: "🤖 Multi-Agent System V2 Activated",
      description: "Autonomous agents coordinating with hybrid architecture",
    });
  };

  const stopSupervision = () => {
    multiAgentSupervisor.stopSupervision();
    setIsActive(false);
  };

  const testBackendConnection = async () => {
    fastAPIService.setBaseUrl(backendUrl);
    const connected = await fastAPIService.checkStatus();
    setBackendConnected(connected);
    
    if (connected) {
      toast({
        title: "✅ Backend Connected",
        description: "FastAPI backend is responding - Live data enabled!",
      });
    } else {
      toast({
        title: "❌ Backend Unavailable",
        description: "Will use local agent intelligence",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <MultiAgentHeader
          isActive={isActive}
          backendConnected={backendConnected}
          onStartSupervision={startSupervision}
          onStopSupervision={stopSupervision}
        />
        
        <CardContent className="space-y-4">
          <BackendConfiguration
            backendUrl={backendUrl}
            onBackendUrlChange={setBackendUrl}
            onTestConnection={testBackendConnection}
          />

          <AgentStatsGrid stats={stats} loopInterval={loopInterval} />
        </CardContent>
      </Card>

      {isActive && backendData && (
        <LiveBackendData
          backendData={backendData}
          isConnected={isConnected}
          isPolling={isPolling}
          onRefresh={refreshData}
        />
      )}

      {isActive && <AgentStatusList agents={agents} />}
    </div>
  );
};

export default MultiAgentDashboard;
