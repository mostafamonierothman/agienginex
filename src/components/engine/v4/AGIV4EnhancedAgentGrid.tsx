import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Play, Zap, Shield, Clock, Globe, Target, Lightbulb, Code, Activity, Settings, Search, Database } from 'lucide-react';
import { agentRegistry, RegisteredAgent } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';
import { enhancedAutonomousLoop } from '@/loops/EnhancedAutonomousLoop';

const AGIV4EnhancedAgentGrid = () => {
  const [agents, setAgents] = useState<RegisteredAgent[]>([]);
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set());
  const [systemStatus, setSystemStatus] = useState({ isRunning: false, cycleCount: 0, totalAgents: 20 });

  useEffect(() => {
    // Map AgentDefinition to RegisteredAgent
    const mappedAgents: RegisteredAgent[] = agentRegistry.getAllAgents().map(agent => ({
      name: agent.name,
      status: 'idle',
      lastAction: 'none',
      category: agent.category,
      description: agent.description,
      version: agent.version,
      runner: agent.runner
    }));
    setAgents(mappedAgents);
    
    // Update system status every 2 seconds
    const interval = setInterval(() => {
      setSystemStatus(enhancedAutonomousLoop.getStatus());
    }, 2000);

    return () => clearInterval(interval);
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
      'SupervisorAgent': Settings,
      'ResearchAgent': Search,
      'MemoryAgent': Database,
      'CoordinationAgent': Activity,
      'LearningAgentV2': Brain,
      'FactoryAgent': Settings,
      'CriticAgent': Search,
      'LLMAgent': Brain,
      'StrategicAgent': Target,
      'OpportunityAgent': Search,
      'EvolutionAgent': Activity,
      'CollaborationAgent': Activity
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

  const startEnhancedLoop = async () => {
    try {
      await enhancedAutonomousLoop.start();
      toast({
        title: "🚀 Enhanced Autonomous Loop Started",
        description: `All ${agents.length} agents now running in enhanced autonomous mode`,
      });
    } catch (error) {
      toast({
        title: "❌ Failed to Start Enhanced Loop",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const stopEnhancedLoop = () => {
    enhancedAutonomousLoop.stop();
    toast({
      title: "⏹️ Enhanced Loop Stopped",
      description: "All autonomous execution has been halted",
    });
  };

  const runAllAgents = async () => {
    const agentPromises = agents.map(agent => runAgent(agent.name));
    
    toast({
      title: "🚀 Running All Agents",
      description: `Executing all ${agents.length} agents simultaneously...`,
    });

    try {
      await Promise.allSettled(agentPromises);
      toast({
        title: "✅ All Agents Completed",
        description: `${agents.length} agents have finished execution`,
      });
    } catch (error) {
      toast({
        title: "❌ Some Agents Failed",
        description: "Check individual agent statuses",
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
            {systemStatus.isRunning && (
              <span className="ml-4 text-green-400">
                🔄 Autonomous Loop Active (Cycle #{systemStatus.cycleCount})
              </span>
            )}
          </CardDescription>
          
          {/* Main Control Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              onClick={runRandomAgent}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Random Agent
            </Button>
            
            <Button
              onClick={runAllAgents}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Run All {agents.length} Agents
            </Button>
            
            {!systemStatus.isRunning ? (
              <Button
                onClick={startEnhancedLoop}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Start Enhanced Loop
              </Button>
            ) : (
              <Button
                onClick={stopEnhancedLoop}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Stop Enhanced Loop
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Enhanced Agents Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">🚀 Enhanced Agents (V4.5) - {enhancedAgents.length} agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
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
            <h3 className="text-lg font-semibold text-blue-400 mb-3">⚙️ Core Agents (V4.0) - {coreAgents.length} agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {coreAgents.map((agent) => {
                const IconComponent = getAgentIcon(agent.name);
                const isRunning = runningAgents.has(agent.name);
                
                return (
                  <Card key={agent.name} className="bg-slate-700/50 border border-slate-600/30 hover:border-blue-500/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            {agent.name.replace('Agent', '').replace('V2', '')}
                          </span>
                        </div>
                        <Badge className={`${getCategoryColor(agent.category)} text-white text-xs`}>
                          {agent.version}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => runAgent(agent.name)}
                        disabled={isRunning}
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIV4EnhancedAgentGrid;
