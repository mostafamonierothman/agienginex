
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, RefreshCw, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { agiApiClient } from '@/services/AGIApiClient';

interface Agent {
  agent_name: string;
  agent_type: string;
  purpose: string;
  status: string;
  last_run?: string;
  performance_score?: number;
}

const AgentManager = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [installing, setInstalling] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const result = await agiApiClient.listAgents();
      if (result.success) {
        const agentData = result.agents || [];
        const formattedAgents: Agent[] = agentData.map(agent => ({
          agent_name: agent.agent_name,
          agent_type: agent.agent_type,
          purpose: agent.purpose || 'No description available',
          status: agent.status || 'idle',
          last_run: agent.last_run,
          performance_score: agent.performance_score
        }));
        setAgents(formattedAgents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const installAgent = async () => {
    try {
      setInstalling(true);
      const agentName = `CustomAgent_${Date.now()}`;
      
      await agiApiClient.installAgent({
        agent_name: agentName,
        agent_type: "Custom",
        purpose: "Custom agent for specific tasks",
        config: { custom: true }
      });

      toast({
        title: "✅ Agent Installed",
        description: `${agentName} has been installed successfully`,
      });

      await fetchAgents();
    } catch (error) {
      console.error('Failed to install agent:', error);
      toast({
        title: "Error",
        description: "Failed to install agent",
        variant: "destructive"
      });
    } finally {
      setInstalling(false);
    }
  };

  const uninstallAgent = async (agentName: string) => {
    try {
      await agiApiClient.uninstallAgent(agentName);
      
      toast({
        title: "🗑️ Agent Uninstalled",
        description: `${agentName} has been removed`,
      });

      await fetchAgents();
    } catch (error) {
      console.error('Failed to uninstall agent:', error);
      toast({
        title: "Error",
        description: "Failed to uninstall agent",
        variant: "destructive"
      });
    }
  };

  const runAgent = async (agentName: string) => {
    try {
      await agiApiClient.runAgent({
        agent_name: agentName,
        input: { trigger: 'manual' }
      });
      
      toast({
        title: "🚀 Agent Triggered",
        description: `${agentName} is now running`,
      });
    } catch (error) {
      console.error('Failed to run agent:', error);
      toast({
        title: "Error",
        description: "Failed to run agent",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🧩 Agent Manager</h1>
            <p className="text-gray-400">Manage, install, and monitor your AGI agents</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchAgents} 
              disabled={loading}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={installAgent} 
              disabled={installing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {installing ? 'Installing...' : 'Install Agent'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.agent_name} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    {agent.agent_name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                    {agent.agent_type}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {agent.purpose}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <Badge 
                      variant={agent.status === 'active' ? 'default' : 'secondary'}
                      className={agent.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  
                  {agent.performance_score && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Performance:</span>
                      <span className="text-white">{agent.performance_score}%</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => runAgent(agent.agent_name)}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Run
                    </Button>
                    <Button 
                      onClick={() => uninstallAgent(agent.agent_name)}
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agents.length === 0 && !loading && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Agents Found</h3>
              <p className="text-gray-400 mb-6">Get started by installing your first agent</p>
              <Button 
                onClick={installAgent} 
                disabled={installing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Install Your First Agent
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AgentManager;
