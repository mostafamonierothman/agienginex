
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { multiAgentSupervisor, Agent } from '@/services/MultiAgentSupervisor';
import { fastAPIService } from '@/services/FastAPIService';
import { vectorMemoryService } from '@/services/VectorMemoryService';
import { toast } from '@/hooks/use-toast';

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
        description: "FastAPI backend is responding",
      });
    } else {
      toast({
        title: "❌ Backend Unavailable",
        description: "Will use local agent intelligence",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'text-blue-400 border-blue-400';
      case 'executing': return 'text-green-400 border-green-400';
      case 'completed': return 'text-purple-400 border-purple-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking': return '🤔';
      case 'executing': return '⚡';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '😴';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-white flex items-center gap-2">
                  🤖 Multi-Agent Supervisor V2 Hybrid
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Autonomous agents with FastAPI backend integration & vector memory
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={backendConnected ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'}>
                  {backendConnected ? '🔗 BACKEND' : '💻 LOCAL'}
                </Badge>
                <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                  {isActive ? '🟢 SUPERVISING' : '🔴 INACTIVE'}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {isActive ? (
                <Button onClick={stopSupervision} variant="destructive" className="w-full sm:w-auto">
                  Stop Supervision
                </Button>
              ) : (
                <Button onClick={startSupervision} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                  Start Supervision V2
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Backend Configuration */}
          <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
            <h3 className="text-white font-medium mb-3">🔗 FastAPI Backend Configuration</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label htmlFor="backend-url" className="text-gray-400">Backend URL</Label>
                <Input
                  id="backend-url"
                  placeholder="http://localhost:8000"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={testBackendConnection} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Total Agents</div>
              <div className="text-white font-bold text-lg">{stats.totalAgents}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Active Agents</div>
              <div className="text-green-400 font-bold text-lg">{stats.activeAgents}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Avg Performance</div>
              <div className="text-blue-400 font-bold text-lg">{stats.avgPerformance.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Avg Autonomy</div>
              <div className="text-purple-400 font-bold text-lg">{stats.avgAutonomy.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Loop Interval</div>
              <div className="text-yellow-400 font-bold text-lg">{(loopInterval/1000).toFixed(1)}s</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && agents.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">🤖 Agent Status & Hybrid Coordination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {getStatusIcon(agent.status)} {agent.name}
                        {agent.useBackend && (
                          <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                            BACKEND
                          </Badge>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">{agent.role}</div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Performance</span>
                      <span className="text-white">{agent.performance.toFixed(0)}%</span>
                    </div>
                    <Progress value={agent.performance} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Autonomy Level</span>
                      <span className="text-white">{agent.autonomyLevel.toFixed(0)}%</span>
                    </div>
                    <Progress value={agent.autonomyLevel} className="h-2" />
                  </div>

                  {agent.currentTask && (
                    <div className="mt-3 p-2 bg-slate-600/50 rounded">
                      <div className="text-gray-400 text-xs">Current Task:</div>
                      <div className="text-white text-sm">{agent.currentTask}</div>
                    </div>
                  )}

                  {agent.lastAction && (
                    <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-700/30">
                      <div className="text-gray-400 text-xs">Last Action:</div>
                      <div className="text-green-400 text-sm">{agent.lastAction}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiAgentDashboard;
