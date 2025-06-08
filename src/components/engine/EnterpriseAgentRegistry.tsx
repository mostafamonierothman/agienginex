
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target, Users, Database, Settings, Activity, Shield, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CORE_AGENTS = [
  { name: 'FactoryAgent', type: 'Factory', category: 'generator', status: 'active', description: 'Creates new agents using dynamic templates' },
  { name: 'ResearchAgent', type: 'Research', category: 'scanner', status: 'active', description: 'Scans external sources for insights' },
  { name: 'LearningAgentV2', type: 'Learning', category: 'learning', status: 'active', description: 'Generates learning goals and strategies' },
  { name: 'CriticAgent', type: 'Critic', category: 'evaluation', status: 'active', description: 'Evaluates system performance' },
  { name: 'SupervisorAgent', type: 'Supervisor', category: 'coordination', status: 'active', description: 'Monitors all agent activities' },
  { name: 'StrategicAgent', type: 'Strategic', category: 'strategy', status: 'active', description: 'Plans strategic decisions' },
  { name: 'OpportunityAgent', type: 'Opportunity', category: 'analyzer', status: 'active', description: 'Identifies market opportunities' },
  { name: 'CoordinationAgent', type: 'Coordination', category: 'coordination', status: 'active', description: 'Manages agent workflows' }
];

const EnterpriseAgentRegistry = () => {
  const [registeredAgents, setRegisteredAgents] = useState<any[]>([]);
  const [coreAgents] = useState(CORE_AGENTS);
  const [totalRuns, setTotalRuns] = useState(0);

  useEffect(() => {
    loadRegisteredAgents();
    const interval = setInterval(loadRegisteredAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRegisteredAgents = async () => {
    try {
      const { data: agents } = await supabase
        .from('supervisor_queue')
        .select('agent_name')
        .order('timestamp', { ascending: false });

      const agentCounts = new Map();
      agents?.forEach(entry => {
        const name = entry.agent_name;
        agentCounts.set(name, (agentCounts.get(name) || 0) + 1);
      });

      const registeredList = Array.from(agentCounts.entries()).map(([name, runs]) => ({
        name,
        runs,
        last_run: new Date().toISOString(),
        status: 'active'
      }));

      setRegisteredAgents(registeredList);
      setTotalRuns(agents?.length || 0);
    } catch (error) {
      console.error('Error loading registered agents:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strategy': return <Target className="w-4 h-4" />;
      case 'scanner': return <TrendingUp className="w-4 h-4" />;
      case 'learning': return <Brain className="w-4 h-4" />;
      case 'coordination': return <Users className="w-4 h-4" />;
      case 'generator': return <Zap className="w-4 h-4" />;
      case 'evaluation': return <Shield className="w-4 h-4" />;
      case 'analyzer': return <Activity className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strategy': return 'border-purple-400 text-purple-400';
      case 'scanner': return 'border-blue-400 text-blue-400';
      case 'learning': return 'border-green-400 text-green-400';
      case 'coordination': return 'border-yellow-400 text-yellow-400';
      case 'generator': return 'border-cyan-400 text-cyan-400';
      case 'evaluation': return 'border-red-400 text-red-400';
      case 'analyzer': return 'border-orange-400 text-orange-400';
      default: return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          🤖 Enterprise Agent Registry
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline" className="text-green-400 border-green-400">
            {coreAgents.length} Core Agents
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {registeredAgents.length} Dynamic Agents
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {totalRuns} Total Executions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Core Agents */}
        <div>
          <h3 className="text-white font-medium mb-3">🔧 Core System Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {coreAgents.map((agent) => (
              <div 
                key={agent.name}
                className="bg-slate-700/50 p-3 rounded border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(agent.category)}
                  <h4 className="text-white font-medium text-sm">{agent.name}</h4>
                </div>
                <p className="text-gray-400 text-xs mb-2">{agent.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(agent.category)}`}>
                    {agent.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                    {agent.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Agents */}
        <div>
          <h3 className="text-white font-medium mb-3">⚡ Dynamic Runtime Agents</h3>
          {registeredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {registeredAgents.map((agent, index) => (
                <div 
                  key={index}
                  className="bg-slate-700/50 p-3 rounded border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{agent.name}</h4>
                    <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{agent.runs} executions</span>
                    <span className="text-gray-500">
                      {new Date(agent.last_run).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              No dynamic agents created yet. Factory agent will generate them automatically.
            </div>
          )}
        </div>

        {/* Agent Statistics */}
        <div className="bg-slate-700/50 p-4 rounded">
          <h3 className="text-white font-medium mb-3">📊 System Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-purple-400">{coreAgents.length + registeredAgents.length}</div>
              <div className="text-xs text-gray-400">Total Agents</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-400">{coreAgents.filter(a => a.status === 'active').length}</div>
              <div className="text-xs text-gray-400">Active Core</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-400">{registeredAgents.length}</div>
              <div className="text-xs text-gray-400">Dynamic</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-400">{totalRuns}</div>
              <div className="text-xs text-gray-400">Executions</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseAgentRegistry;
