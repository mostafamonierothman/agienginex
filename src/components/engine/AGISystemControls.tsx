
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RefreshCw, Settings, Bot } from 'lucide-react';
import { agiEngineX, AgentInfo } from '@/services/AGIengineXService';

const AGISystemControls = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loopRunning, setLoopRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      const [status, availableAgents] = await Promise.all([
        agiEngineX.getSystemStatus(),
        agiEngineX.getAvailableAgents()
      ]);
      
      setSystemStatus(status);
      setAgents(availableAgents);
      setLoopRunning(status.loop_running || false);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLoop = async () => {
    setIsLoading(true);
    const success = await agiEngineX.startLoop();
    if (success) {
      setLoopRunning(true);
    }
    setIsLoading(false);
  };

  const handleStopLoop = async () => {
    setIsLoading(true);
    const success = await agiEngineX.stopLoop();
    if (success) {
      setLoopRunning(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            🎛️ System Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">AGI Loop Status:</span>
            <Badge 
              variant="outline" 
              className={loopRunning ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}
            >
              {loopRunning ? '🟢 RUNNING' : '🔴 STOPPED'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Agents:</span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {systemStatus?.agents_active || agents.length}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStartLoop}
              disabled={loopRunning || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Loop
            </Button>
            <Button
              onClick={handleStopLoop}
              disabled={!loopRunning || isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Loop
            </Button>
          </div>

          <Button
            onClick={loadSystemData}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            🤖 Available Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agents.map((agent, index) => (
            <div key={index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{agent.name.replace('_', ' ').toUpperCase()}</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  ACTIVE
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">{agent.description}</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((capability, capIndex) => (
                  <Badge key={capIndex} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AGISystemControls;
