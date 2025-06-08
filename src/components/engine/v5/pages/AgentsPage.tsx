
import React, { useState, useEffect } from 'react';
import { agentRegistry } from '@/config/AgentRegistry';
import { enhancedAutonomousLoop } from '@/loops/EnhancedAutonomousLoop';
import AgentCard from '../components/AgentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [runningAgents, setRunningAgents] = useState(new Set());

  useEffect(() => {
    const registeredAgents = agentRegistry.getAllAgents();
    const agentData = registeredAgents.map(agent => ({
      name: agent.name,
      status: runningAgents.has(agent.name) ? 'RUNNING' : 'IDLE',
      lastAction: 'Ready for execution',
      category: agent.category,
      description: agent.description,
      version: agent.version
    }));
    setAgents(agentData);
  }, [runningAgents]);

  const handleRunAgent = async (agentName: string) => {
    if (runningAgents.has(agentName)) return;

    setRunningAgents(prev => new Set(prev).add(agentName));

    try {
      const context = {
        user_id: 'v5_interface',
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

  const runAllAgents = async () => {
    toast({
      title: "🚀 Running All Agents",
      description: `Executing all ${agents.length} agents...`,
    });

    const agentPromises = agents.map(agent => handleRunAgent(agent.name));
    await Promise.allSettled(agentPromises);
  };

  const coreAgents = agents.filter(a => a.category === 'core');
  const enhancedAgents = agents.filter(a => a.category === 'enhanced');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Users className="h-8 w-8 text-purple-400" />
          Agents
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {coreAgents.length} Core
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {enhancedAgents.length} Enhanced
          </Badge>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={runAllAgents}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Run All {agents.length} Agents
        </Button>
        <Button
          onClick={() => enhancedAutonomousLoop.runRandomEnhancedAgent()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Zap className="h-4 w-4 mr-2" />
          Run Random Agent
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-purple-400 mb-4">🚀 Enhanced Agents (V4.5+)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enhancedAgents.map((agent, index) => (
              <AgentCard
                key={index}
                agentName={agent.name}
                status={agent.status}
                lastAction={agent.lastAction}
                description={agent.description}
                version={agent.version}
                category={agent.category}
                onRunAgent={() => handleRunAgent(agent.name)}
                isRunning={runningAgents.has(agent.name)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-400 mb-4">⚙️ Core Agents (V4.0)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreAgents.map((agent, index) => (
              <AgentCard
                key={index}
                agentName={agent.name}
                status={agent.status}
                lastAction={agent.lastAction}
                description={agent.description}
                version={agent.version}
                category={agent.category}
                onRunAgent={() => handleRunAgent(agent.name)}
                isRunning={runningAgents.has(agent.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
