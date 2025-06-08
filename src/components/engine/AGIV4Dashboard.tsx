import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, Target, Users, Database, Settings, Play, TrendingUp, MessageSquare, Activity, Shield, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AVAILABLE_AGENTS = [
  { name: 'FactoryAgent', type: 'Factory', category: 'generator', description: 'Creates new agents dynamically using templates' },
  { name: 'ResearchAgent', type: 'Research', category: 'scanner', description: 'Scans external sources for insights and trends' },
  { name: 'LearningAgentV2', type: 'Learning', category: 'learning', description: 'Generates learning goals and adapts strategies' },
  { name: 'CriticAgent', type: 'Critic', category: 'evaluation', description: 'Evaluates system performance and provides feedback' },
  { name: 'SupervisorAgent', type: 'Supervisor', category: 'coordination', description: 'Monitors and coordinates all agent activities' },
  { name: 'StrategicAgent', type: 'Strategic', category: 'strategy', description: 'Plans high-level strategic decisions' },
  { name: 'OpportunityAgent', type: 'Opportunity', category: 'analyzer', description: 'Identifies business opportunities and market gaps' },
  { name: 'CoordinationAgent', type: 'Coordination', category: 'coordination', description: 'Manages inter-agent communication and workflows' }
];

interface Agent {
  name: string;
  description: string;
  category: string;
  version: string;
}

interface AgentExecution {
  result: string;
  agent_name: string;
  execution_time: number;
  status: string;
  metadata?: any;
}

const AGIV4Dashboard = () => {
  const [availableAgents, setAvailableAgents] = useState(AVAILABLE_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [agentInput, setAgentInput] = useState<string>('');
  const [lastExecution, setLastExecution] = useState<AgentExecution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [supervisorLogs, setSupervisorLogs] = useState<any[]>([]);
  const [agentMemories, setAgentMemories] = useState<any[]>([]);
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalAgents: AVAILABLE_AGENTS.length,
    executionsToday: 0,
    memoryEntries: 0,
    activeGoals: 0
  });

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load supervisor logs
      const { data: logs } = await supabase
        .from('supervisor_queue')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      // Load agent memories
      const { data: memories } = await supabase
        .from('agent_memory')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(15);

      // Load active goals
      const { data: goals } = await supabase
        .from('agi_goals_enhanced')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: false })
        .limit(10);

      setSupervisorLogs(logs || []);
      setAgentMemories(memories || []);
      setActiveGoals(goals || []);

      // Update stats
      setSystemStats(prev => ({
        ...prev,
        executionsToday: logs?.length || 0,
        memoryEntries: memories?.length || 0,
        activeGoals: goals?.length || 0
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const executeAgent = async () => {
    if (!selectedAgent) return;

    setIsExecuting(true);
    console.log(`🚀 V4 Executing agent: ${selectedAgent}`);

    try {
      // Execute agent via function
      const { data, error } = await supabase.functions.invoke('agi-v4-core', {
        body: {
          action: 'run_agent',
          agent_name: selectedAgent,
          input: agentInput || null,
          user_id: 'demo_user',
          context: { source: 'v4_dashboard' }
        }
      });

      if (error) throw error;

      setLastExecution({
        result: data?.message || 'Agent executed successfully',
        agent_name: selectedAgent,
        execution_time: data?.execution_time || 0,
        status: data?.success ? 'success' : 'error',
        metadata: data?.data
      });
      
      setAgentInput('');
      
      // Refresh dashboard data
      setTimeout(loadDashboardData, 1000);

    } catch (error) {
      console.error('Error executing agent:', error);
      setLastExecution({
        result: `Error: ${error.message}`,
        agent_name: selectedAgent,
        execution_time: 0,
        status: 'error'
      });
    } finally {
      setIsExecuting(false);
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGI V4+ Enterprise Platform</h2>
        <p className="text-gray-400">Next-Generation Autonomous Agent System with Enterprise Features</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            V4+ ENTERPRISE
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {systemStats.totalAgents} AGENTS
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            AUTO-HEALING
          </Badge>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            MULTI-TENANT
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{systemStats.totalAgents}</div>
            <div className="text-sm text-gray-400">V4+ Agents</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{systemStats.executionsToday}</div>
            <div className="text-sm text-gray-400">Executions</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{systemStats.memoryEntries}</div>
            <div className="text-sm text-gray-400">Memories</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{systemStats.activeGoals}</div>
            <div className="text-sm text-gray-400">Active Goals</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="agents" className="text-white">
            <Brain className="w-4 h-4 mr-2" />
            V4+ Agents
          </TabsTrigger>
          <TabsTrigger value="memory" className="text-white">
            <Database className="w-4 h-4 mr-2" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="goals" className="text-white">
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="enterprise" className="text-white">
            <Award className="w-4 h-4 mr-2" />
            Enterprise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                🤖 V4+ Agent Execution Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Select V4+ Agent</label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded px-3 py-2"
                  >
                    <option value="">Choose an agent...</option>
                    {availableAgents.map((agent) => (
                      <option key={agent.name} value={agent.name}>
                        {agent.name} - {agent.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Input (Optional)</label>
                  <Input
                    placeholder="Enter input for agent..."
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </div>

              <Button 
                onClick={executeAgent}
                disabled={!selectedAgent || isExecuting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Play className={`w-4 h-4 mr-2 ${isExecuting ? 'animate-spin' : ''}`} />
                {isExecuting ? 'Executing V4+ Agent...' : 'Execute V4+ Agent'}
              </Button>

              {lastExecution && (
                <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Latest Execution Result</h3>
                    <Badge 
                      variant="outline" 
                      className={lastExecution.status === 'error' ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}
                    >
                      {lastExecution.status === 'error' ? '❌ ERROR' : '✅ SUCCESS'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 text-sm">Agent:</span>
                      <p className="text-white">{lastExecution.agent_name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Result:</span>
                      <p className="text-white text-sm bg-slate-800 p-2 rounded mt-1">
                        {lastExecution.result}
                      </p>
                    </div>
                    {lastExecution.metadata && (
                      <div>
                        <span className="text-gray-400 text-sm">Metadata:</span>
                        <p className="text-xs text-gray-300">
                          {JSON.stringify(lastExecution.metadata, null, 2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Available Agents Registry */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">📋 Complete V4+ Agent Registry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAgents.map((agent) => (
                  <div 
                    key={agent.name}
                    className="bg-slate-700/50 p-4 rounded border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(agent.category)}
                      <h4 className="text-white font-medium text-sm">{agent.name}</h4>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{agent.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(agent.category)}`}>
                        {agent.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-500">
                        {agent.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                🧠 V4 Agent Memory System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {agentMemories.length > 0 ? (
                  agentMemories.map((memory, index) => (
                    <div key={memory.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400 text-xs">
                          {memory.agent_name}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(memory.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{memory.memory_value}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Type: {memory.memory_key}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No agent memories yet. Execute some agents to build the memory system.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                🎯 V4 Autonomous Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeGoals.length > 0 ? (
                  activeGoals.map((goal, index) => (
                    <div key={goal.goal_id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                          Priority {goal.priority}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {goal.progress_percentage}% Complete
                        </span>
                      </div>
                      <p className="text-white text-sm">{goal.goal_text}</p>
                      <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full" 
                          style={{ width: `${goal.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No active goals. The learning agent will generate autonomous goals.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                📊 V4 System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {supervisorLogs.length > 0 ? (
                  supervisorLogs.map((log, index) => (
                    <div key={log.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                          {log.agent_name}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{log.output}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Status: {log.status} | Action: {log.action}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No activity logs yet. Execute agents to see system activity.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enterprise" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                🏢 Enterprise Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">🚀 Auto-Startup</h4>
                  <p className="text-gray-400 text-sm mb-3">System automatically boots and starts autonomous loops</p>
                  <Badge variant="outline" className="text-green-400 border-green-400">ACTIVE</Badge>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">🏢 Multi-Tenant</h4>
                  <p className="text-gray-400 text-sm mb-3">Support for multiple users with isolated agent environments</p>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">ENABLED</Badge>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">🔧 Self-Healing</h4>
                  <p className="text-gray-400 text-sm mb-3">Agents automatically recover from failures and bootstrap missing components</p>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">MONITORING</Badge>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">🏆 Promotion Engine</h4>
                  <p className="text-gray-400 text-sm mb-3">Best performing agents get priority and enhanced resources</p>
                  <Badge variant="outline" className="text-yellow-400 border-yellow-400">ACTIVE</Badge>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">🗂️ Memory Compression</h4>
                  <p className="text-gray-400 text-sm mb-3">Intelligent vector memory optimization and cleanup</p>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400">OPTIMIZING</Badge>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-white font-medium mb-2">📊 Advanced Analytics</h4>
                  <p className="text-gray-400 text-sm mb-3">Real-time performance metrics and agent behavior analysis</p>
                  <Badge variant="outline" className="text-orange-400 border-orange-400">TRACKING</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIV4Dashboard;
