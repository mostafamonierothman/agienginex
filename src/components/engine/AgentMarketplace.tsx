
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Package, Download, Trash2, Zap, Search } from 'lucide-react';
import { agiApiClient } from '@/services/AGIApiClient';

interface Agent {
  id: string;
  agent_name: string;
  agent_type: string;
  endpoint?: string;
  status: 'available' | 'installed' | 'running';
  description: string;
  capabilities: string[];
}

const AgentMarketplace = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [installedAgents, setInstalledAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAgent, setCustomAgent] = useState({
    name: '',
    type: 'custom',
    endpoint: ''
  });

  const marketplaceAgents: Agent[] = [
    {
      id: '1',
      agent_name: 'market_analyzer_agent',
      agent_type: 'analysis',
      description: 'Advanced market analysis and trend detection',
      capabilities: ['Market Analysis', 'Trend Detection', 'Risk Assessment'],
      status: 'available'
    },
    {
      id: '2',
      agent_name: 'content_creator_agent',
      agent_type: 'content',
      description: 'AI-powered content generation and optimization',
      capabilities: ['Content Generation', 'SEO Optimization', 'Social Media'],
      status: 'available'
    },
    {
      id: '3',
      agent_name: 'financial_advisor_agent',
      agent_type: 'finance',
      description: 'Financial planning and investment recommendations',
      capabilities: ['Portfolio Analysis', 'Risk Management', 'Investment Strategy'],
      status: 'available'
    },
    {
      id: '4',
      agent_name: 'research_assistant_agent',
      agent_type: 'research',
      description: 'Deep research and data analysis capabilities',
      capabilities: ['Data Mining', 'Report Generation', 'Citation Management'],
      status: 'available'
    },
    {
      id: '5',
      agent_name: 'automation_specialist_agent',
      agent_type: 'automation',
      description: 'Workflow automation and process optimization',
      capabilities: ['Process Automation', 'Workflow Design', 'Integration'],
      status: 'available'
    },
    {
      id: '6',
      agent_name: 'customer_support_agent',
      agent_type: 'support',
      description: 'Intelligent customer service and support',
      capabilities: ['Query Resolution', 'Sentiment Analysis', 'Escalation Management'],
      status: 'available'
    }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const response = await agiApiClient.listAgents();
      if (response.agents) {
        setInstalledAgents(response.agents.map((a: any) => a.agent_name));
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const installAgent = async (agent: Agent) => {
    setIsLoading(true);
    try {
      await agiApiClient.installAgent({
        agent_name: agent.agent_name,
        agent_type: agent.agent_type,
        endpoint: agent.endpoint
      });

      setInstalledAgents(prev => [...prev, agent.agent_name]);
      toast({
        title: "🚀 Agent Installed",
        description: `${agent.agent_name} is now available in your AGI system`,
      });
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Failed to install agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uninstallAgent = async (agentName: string) => {
    setIsLoading(true);
    try {
      await agiApiClient.uninstallAgent(agentName);
      setInstalledAgents(prev => prev.filter(name => name !== agentName));
      toast({
        title: "🗑️ Agent Uninstalled",
        description: `${agentName} has been removed from your system`,
      });
    } catch (error) {
      toast({
        title: "Uninstallation Failed",
        description: "Failed to uninstall agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const installCustomAgent = async () => {
    if (!customAgent.name.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter an agent name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await agiApiClient.installAgent({
        agent_name: customAgent.name,
        agent_type: customAgent.type,
        endpoint: customAgent.endpoint || undefined
      });

      setInstalledAgents(prev => [...prev, customAgent.name]);
      setCustomAgent({ name: '', type: 'custom', endpoint: '' });
      toast({
        title: "🚀 Custom Agent Installed",
        description: `${customAgent.name} is now available in your AGI system`,
      });
    } catch (error) {
      toast({
        title: "Installation Failed",
        description: "Failed to install custom agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAgents = marketplaceAgents.filter(agent =>
    agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.capabilities.some(cap => cap.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          🏪 Agent Marketplace
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Install and manage AI agents to expand your AGI capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search agents by name, type, or capability..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {/* Custom Agent Installation */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Install Custom Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-gray-400">Agent Name</Label>
                <Input
                  placeholder="my_custom_agent"
                  value={customAgent.name}
                  onChange={(e) => setCustomAgent(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Type</Label>
                <Input
                  placeholder="custom"
                  value={customAgent.type}
                  onChange={(e) => setCustomAgent(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-400">Endpoint (Optional)</Label>
                <Input
                  placeholder="https://api.example.com"
                  value={customAgent.endpoint}
                  onChange={(e) => setCustomAgent(prev => ({ ...prev, endpoint: e.target.value }))}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>
            <Button 
              onClick={installCustomAgent}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Install Custom Agent
            </Button>
          </CardContent>
        </Card>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => {
            const isInstalled = installedAgents.includes(agent.agent_name);
            
            return (
              <Card key={agent.id} className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">{agent.agent_name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={isInstalled ? 'text-green-400 border-green-400' : 'text-blue-400 border-blue-400'}
                    >
                      {isInstalled ? '✅ Installed' : '📦 Available'}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-purple-400 border-purple-400 w-fit">
                    {agent.agent_type}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-xs">{agent.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-600 text-gray-300">
                        {capability}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {isInstalled ? (
                      <Button
                        onClick={() => uninstallAgent(agent.agent_name)}
                        disabled={isLoading}
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Uninstall
                      </Button>
                    ) : (
                      <Button
                        onClick={() => installAgent(agent)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                        size="sm"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Install
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{marketplaceAgents.length}</div>
            <div className="text-gray-400 text-xs">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{installedAgents.length}</div>
            <div className="text-gray-400 text-xs">Installed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{filteredAgents.length}</div>
            <div className="text-gray-400 text-xs">Matching</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMarketplace;
