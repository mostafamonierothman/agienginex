
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Play, Zap, Shield, Clock, Globe, Target, Lightbulb, Code } from 'lucide-react';
import { agentRegistry, RegisteredAgent } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';

const AGIV4EnhancedAgentGrid = () => {
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAgents(agentRegistry.getAllAgents());
  }, []);

  const getAgentIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'BrowserAgent': Globe,
      'SecurityAgent': Shield,
      'TimelineAgent': Clock,
      'CreativityAgent': Lightbulb,
      'MetaAgent': Brain,
      'GoalAgent': Target,
      'APIConnectorAgent': Code,
    };
    return iconMap[name] || Zap;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-500';
      case 'enhanced': return 'bg-purple-500';
      case 'utility': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const runAgent = async (agentName: string) => {
    if (runningAgents.has(agentName)) return;

    setRunningAgents(prev => new Set(prev).add(agentName));

    try {
      const context = {
        user_id: 'enhanced_ui_user',
        timestamp: new Date().toISOString()
      };

      const result = await agentRegistry.runAgent(agentName, context);
      
      toast({
        title: `🤖 ${agentName} Executed`,
        description: result.message || `${agentName} completed successfully`,
      });
    } catch (error) {
      toast({
        title: `❌ ${agentName} Failed`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentName);
        return newSet;
      });
    }
  };

  const runRandomAgent = async () => {
    try {
      const randomAgent = agentRegistry.getRandomAgent();
      if (randomAgent) {
        await runAgent(randomAgent.name);
      }
    } catch (error) {
      toast({
        title: "❌ Random Agent Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const coreAgents = agents.filter(a => a.category === 'core');
  const enhancedAgents = agents.filter(a => a.category === 'enhanced');

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-purple-400" />
            AGI V4.5+ Enhanced Agent Grid
          </CardTitle>
          <CardDescription className="text-slate-300">
            {agents.length} total agents • {coreAgents.length} core • {enhancedAgents.length} enhanced
          </CardDescription>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={runRandomAgent}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Random Agent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Agents Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">🚀 Enhanced Agents (V4.5)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enhancedAgents.map((agent) => {
                const IconComponent = getAgentIcon(agent.name);
                const isRunning = runningAgents.has(agent.name);
                
                return (
                  <Card key={agent.name} className="bg-slate-700/50 border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-purple-400" />
                          <CardTitle className="text-sm text-white">{agent.name}</CardTitle>
                        </div>
                        <Badge className={`${getCategoryColor(agent.category)} text-white text-xs`}>
                          {agent.version}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-slate-300">
                        {agent.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        onClick={() => runAgent(agent.name)}
                        disabled={isRunning}
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isRunning ? (
                          <>
                            <Zap className="h-3 w-3 mr-1 animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Execute
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Core Agents Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">⚙️ Core Agents (V4.0)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {coreAgents.map((agent) => {
                const isRunning = runningAgents.has(agent.name);
                
                return (
                  <Card key={agent.name} className="bg-slate-700/50 border border-slate-600/30 hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{agent.name.replace('Agent', '')}</span>
                        <Badge className={`${getCategoryColor(agent.category)} text-white text-xs`}>
                          {agent.version}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => runAgent(agent.name)}
                        disabled={isRunning}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isRunning ? (
                          <Zap className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIV4EnhancedAgentGrid;
