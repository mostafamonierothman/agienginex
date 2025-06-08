
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Download, Star, Zap, Brain, Target, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { agiApiClient } from '@/services/AGIApiClient';

const FEATURED_AGENTS = [
  {
    name: 'MarketAnalysisAgent',
    type: 'Research',
    purpose: 'Advanced market research and trend analysis',
    rating: 4.8,
    downloads: 1247,
    price: 'Free'
  },
  {
    name: 'CodeOptimizationAgent',
    type: 'Development',
    purpose: 'Automated code review and optimization suggestions',
    rating: 4.9,
    downloads: 2156,
    price: '$9.99/month'
  },
  {
    name: 'CustomerInsightAgent',
    type: 'Analytics',
    purpose: 'Deep customer behavior analysis and insights',
    rating: 4.7,
    downloads: 856,
    price: '$19.99/month'
  },
  {
    name: 'ContentCreatorAgent',
    type: 'Creative',
    purpose: 'Automated content generation and optimization',
    rating: 4.6,
    downloads: 1789,
    price: 'Free'
  },
  {
    name: 'SecurityAuditAgent',
    type: 'Security',
    purpose: 'Comprehensive security analysis and monitoring',
    rating: 4.9,
    downloads: 654,
    price: '$29.99/month'
  },
  {
    name: 'DataPipelineAgent',
    type: 'Data',
    purpose: 'Automated data processing and ETL operations',
    rating: 4.5,
    downloads: 923,
    price: '$14.99/month'
  }
];

const AgentMarketplace = () => {
  const [installedAgents, setInstalledAgents] = useState<string[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);

  const installAgent = async (agent: typeof FEATURED_AGENTS[0]) => {
    try {
      setInstalling(agent.name);
      
      await agiApiClient.installAgent({
        agent_name: agent.name,
        agent_type: agent.type,
        purpose: agent.purpose,
        config: {
          marketplace: true,
          featured: true,
          rating: agent.rating,
          downloads: agent.downloads
        }
      });

      setInstalledAgents(prev => [...prev, agent.name]);
      
      toast({
        title: "✅ Agent Installed",
        description: `${agent.name} has been added to your AGI system`,
      });
    } catch (error) {
      console.error('Failed to install agent:', error);
      toast({
        title: "Error",
        description: "Failed to install agent",
        variant: "destructive"
      });
    } finally {
      setInstalling(null);
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'Research': return <Target className="w-5 h-5" />;
      case 'Development': return <Bot className="w-5 h-5" />;
      case 'Analytics': return <Brain className="w-5 h-5" />;
      case 'Creative': return <Zap className="w-5 h-5" />;
      case 'Security': return <Users className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const getPriceColor = (price: string) => {
    if (price === 'Free') return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-purple-400" />
          🌍 AGI Agent Marketplace
        </CardTitle>
        <CardDescription className="text-gray-400">
          Discover and install powerful AGI agents from the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_AGENTS.map((agent) => (
            <div 
              key={agent.name}
              className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                {getAgentIcon(agent.type)}
                <div>
                  <h3 className="text-white font-medium">{agent.name}</h3>
                  <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                    {agent.type}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{agent.purpose}</p>
              
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-gray-300">{agent.rating}</span>
                </div>
                <div className="text-gray-400">{agent.downloads.toLocaleString()} downloads</div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`font-medium ${getPriceColor(agent.price)}`}>
                  {agent.price}
                </span>
                <Button
                  onClick={() => installAgent(agent)}
                  disabled={installing === agent.name || installedAgents.includes(agent.name)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {installing === agent.name ? 'Installing...' : 
                   installedAgents.includes(agent.name) ? 'Installed' : 'Install'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            View All Agents ({FEATURED_AGENTS.length + 47} available)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMarketplace;
