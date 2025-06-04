import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { multiAgentSupervisor, Agent } from '@/services/MultiAgentSupervisor';
import { fastAPIService } from '@/services/FastAPIService';
import { openAIService } from '@/services/OpenAIService';
import { toast } from '@/hooks/use-toast';
import { useBackendPolling } from '@/hooks/useBackendPolling';
import MultiAgentHeader from './multi-agent/MultiAgentHeader';
import BackendConfiguration from './multi-agent/BackendConfiguration';
import OpenAIConfiguration from './multi-agent/OpenAIConfiguration';
import AgentStatsGrid from './multi-agent/AgentStatsGrid';
import AgentStatusList from './multi-agent/AgentStatusList';
import LiveBackendData from './multi-agent/LiveBackendData';

const MultiAgentDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [backendUrl, setBackendUrl] = useState('https://othmanm-agienginex.hf.space');
  const [backendConnected, setBackendConnected] = useState(false);
  const [openAIConnected, setOpenAIConnected] = useState(false);
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
    // Load OpenAI configuration on startup
    openAIService.loadApiKey();
    setOpenAIConnected(openAIService.isAvailable());
  }, []);

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
    console.log('Starting supervision with backend URL:', backendUrl);
    console.log('OpenAI enhanced:', openAIConnected);
    
    // Update backend URL
    fastAPIService.setBaseUrl(backendUrl);
    multiAgentSupervisor.setBackendUrl(backendUrl);

    // Set OpenAI availability for agents
    multiAgentSupervisor.setOpenAIAvailable(openAIConnected);

    await multiAgentSupervisor.startSupervision();
    setIsActive(true);
    
    const deploymentType = backendUrl.includes('hf.space') ? 'HuggingFace Cloud' : 
                          backendUrl.includes('huggingface.co') ? 'HuggingFace Alternative' : 'backend';
    const aiEnhancement = openAIConnected ? ' + OpenAI Enhanced' : '';
    
    toast({
      title: "🤖 Multi-Agent System V2 Activated",
      description: `Autonomous agents coordinating with ${deploymentType}${aiEnhancement}`,
    });
  };

  const stopSupervision = () => {
    multiAgentSupervisor.stopSupervision();
    setIsActive(false);
  };

  const testBackendConnection = async () => {
    console.log('Testing connection to:', backendUrl);
    
    fastAPIService.setBaseUrl(backendUrl);
    const connected = await fastAPIService.checkStatus();
    setBackendConnected(connected);
    
    if (connected) {
      const deploymentType = backendUrl.includes('hf.space') ? 'HuggingFace Cloud' : 
                            backendUrl.includes('huggingface.co') ? 'HuggingFace Alternative' : 'Local';
      toast({
        title: "✅ Backend Connected",
        description: `${deploymentType} backend is responding - Live data enabled!`,
      });
    } else {
      let errorMessage = "Will use local agent intelligence.";
      if (backendUrl.includes('hf.space')) {
        errorMessage = "HuggingFace Space may be sleeping or not deployed. Try the alternative URL or check your space status.";
      } else if (backendUrl.includes('localhost')) {
        errorMessage = "Make sure your local FastAPI server is running on port 8000.";
      }
      
      toast({
        title: "❌ Backend Unavailable",
        description: errorMessage,
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

          <OpenAIConfiguration
            onConnectionChange={setOpenAIConnected}
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
