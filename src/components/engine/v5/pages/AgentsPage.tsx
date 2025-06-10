
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Zap, Target, Settings, Play, Pause } from 'lucide-react';
import { agentRegistry } from '@/config/AgentRegistry';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

interface AgentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [runningAgents, setRunningAgents] = useState(new Set());
  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    try {
      const allAgents = agentRegistry.getAllAgents();
      const stats = agentRegistry.getSystemStatus();
      // Ensure allAgents is an array
      const agentsArray = Array.isArray(allAgents) ? allAgents : [];
      setAgents(agentsArray);
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgents([]); // Fallback to empty array
    }
  }, []);

  const runAgent = async (agentName) => {
    setRunningAgents(prev => new Set([...prev, agentName]));
    
    try {
      await sendChatUpdate(`🚀 Running ${agentName}...`);
      
      const result = await agentRegistry.runAgent(agentName, {
        input: { trigger: 'manual_execution', timestamp: new Date().toISOString() },
        user_id: 'dashboard_user'
      });

      await sendChatUpdate(`✅ ${agentName} completed: ${result.message}`);
    } catch (error) {
      await sendChatUpdate(`❌ ${agentName} failed: ${error.message}`);
    } finally {
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentName);
        return newSet;
      });
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Core': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Coordination': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Strategic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Tool': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Enhanced': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'V7': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Emergency': 'bg-red-500/20 text-red-400 border-red-500/30',
      'AGO': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Ensure agents is always an array before using reduce
  const groupedAgents = Array.isArray(agents) ? agents.reduce((groups, agent) => {
    const category = agent.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(agent);
    return groups;
  }, {}) : {};

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-400" />
            Agent Registry System
            <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-400">
              {systemStats?.version || 'V9'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-white">{systemStats?.totalAgents || agents.length}</div>
              <div className="text-sm text-gray-300">Total Agents</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-400">{systemStats?.agoAgents || 0}</div>
              <div className="text-sm text-gray-300">AGO Agents</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-400">{systemStats?.coreAgents || 0}</div>
              <div className="text-sm text-gray-300">Core Agents</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-400">{systemStats?.emergencyAgents || 0}</div>
              <div className="text-sm text-gray-300">Emergency Agents</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Categories */}
      <div className="grid gap-6">
        {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
          <Card key={category} className="bg-slate-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                {category} Agents
                <Badge variant="outline" className={getCategoryColor(category)}>
                  {Array.isArray(categoryAgents) ? categoryAgents.length : 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="grid gap-3">
                  {Array.isArray(categoryAgents) && categoryAgents.map((agent) => (
                    <div 
                      key={agent.name}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded border border-slate-600/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium text-white">{agent.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {agent.version}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{agent.description}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => runAgent(agent.name)}
                        disabled={runningAgents.has(agent.name)}
                        className="ml-4"
                      >
                        {runningAgents.has(agent.name) ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Run
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
