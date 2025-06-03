
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { multiAgentSupervisor, Agent } from '@/services/MultiAgentSupervisor';
import { vectorMemoryService } from '@/services/VectorMemoryService';
import { toast } from '@/hooks/use-toast';

const MultiAgentDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
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
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const startSupervision = () => {
    multiAgentSupervisor.startSupervision();
    setIsActive(true);
    toast({
      title: "🤖 Multi-Agent System Activated",
      description: "Autonomous agents are now coordinating and optimizing",
    });
  };

  const stopSupervision = () => {
    multiAgentSupervisor.stopSupervision();
    setIsActive(false);
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                🤖 Multi-Agent Supervisor V2
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Autonomous agent coordination with vector memory and cross-agent learning
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                {isActive ? '🟢 SUPERVISING' : '🔴 INACTIVE'}
              </Badge>
              {isActive ? (
                <Button onClick={stopSupervision} variant="destructive" size="sm">
                  Stop Supervision
                </Button>
              ) : (
                <Button onClick={startSupervision} className="bg-purple-600 hover:bg-purple-700" size="sm">
                  Start Supervision
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {isActive && agents.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">🤖 Agent Status & Coordination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {getStatusIcon(agent.status)} {agent.name}
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
