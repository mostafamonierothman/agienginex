import React, { useState, useEffect } from 'react';
import { agentRegistry } from '@/config/AgentRegistry';
import { enhancedAutonomousLoop } from '@/loops/EnhancedAutonomousLoop';
import AgentCard from '../components/AgentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Users, RotateCcw, Square } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { startAutonomousLoop, stopAutonomousLoop, shouldAutoStartLoop } from '@/engine/AutonomousLoopController';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [runningAgents, setRunningAgents] = useState(new Set());
  const [isAutonomousRunning, setIsAutonomousRunning] = useState(false);
  const [showCore, setShowCore] = useState(true);
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const registeredAgents = agentRegistry.getAllAgents();
    const agentData = registeredAgents.map(agent => ({
      name: agent.name,
      status: runningAgents.has(agent.name) ? 'RUNNING' : 'IDLE',
      lastAction: 'Ready for execution',
      category: agent.category,
      description: agent.description,
      version: agent.version,
      runner: agent.runner
    }));
    setAgents(agentData);

    // Auto-start autonomous loop if it was previously running
    if (shouldAutoStartLoop() && agentData.length > 0) {
      console.log('Auto-starting Autonomous Loop from AgentsPage...');
      setIsAutonomousRunning(true);
      startAutonomousLoop(
        null, // supervisorAgent placeholder
        agentData,
        setAgents,
        setLogs,
        (kpis) => setCycles(kpis.cycles),
        { loopDelayMs: 3000, maxCycles: 10000 }
      );
      toast({
        title: "🚀 Auto-Resumed Autonomous Loop",
        description: "System automatically resumed from previous session",
      });
    }
  }, [runningAgents]);

  const handleRunAgent = async (agentName: string, params = {}) => {
    if (runningAgents.has(agentName)) return;

    setRunningAgents(prev => new Set(prev).add(agentName));

    try {
      const context = {
        input: params,
        user_id: 'v5_interface',
        timestamp: new Date().toISOString()
      };

      const result = await agentRegistry.runAgent(agentName, context);
      
      // Update agent in local state
      setAgents(prev => prev.map(agent => 
        agent.name === agentName 
          ? { ...agent, status: 'IDLE', lastAction: result.message || 'Task completed' }
          : agent
      ));
      
      toast({
        title: `🤖 ${agentName} Executed`,
        description: result.message || `${agentName} completed successfully`,
      });
    } catch (error) {
      setAgents(prev => prev.map(agent => 
        agent.name === agentName 
          ? { ...agent, status: 'ERROR', lastAction: `Error: ${error.message}` }
          : agent
      ));
      
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

  const handleRunAllAgents = async () => {
    toast({
      title: "🚀 Running All Agents in Parallel",
      description: `Executing all ${agents.length} agents concurrently...`,
    });

    // Set all agents to RUNNING
    agents.forEach(agent => {
      agent.status = "RUNNING";
    });
    setAgents([...agents]);

    // Run all agents in parallel
    await Promise.all(agents.map(async (agent) => {
      try {
        const context = {
          input: {},
          user_id: 'v5_parallel',
          timestamp: new Date().toISOString()
        };

        const response = await agentRegistry.runAgent(agent.name, context);
        
        agent.status = "IDLE";
        agent.lastAction = response.message || 'Parallel execution completed';

      } catch (error) {
        agent.status = "ERROR";
        agent.lastAction = `Error: ${error.message}`;
      }
    }));

    // Final update
    setAgents([...agents]);
    
    toast({
      title: "✅ Parallel Execution Complete",
      description: "All agents have finished execution",
    });
  };

  const handleRunRandomAgent = async () => {
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    toast({
      title: `🎲 Running Random Agent: ${randomAgent.name}`,
      description: "Executing randomly selected agent...",
    });

    await handleRunAgent(randomAgent.name);
  };

  const handleStartAutonomousLoop = () => {
    setIsAutonomousRunning(true);
    startAutonomousLoop(
      null, // supervisorAgent placeholder
      agents,
      setAgents,
      setLogs,
      (kpis) => setCycles(kpis.cycles),
      { loopDelayMs: 3000, maxCycles: 10000 }
    );
    toast({
      title: "🚀 Autonomous Loop Started",
      description: "Agents will now run automatically in cycles",
    });
  };

  const handleStopAutonomousLoop = () => {
    setIsAutonomousRunning(false);
    stopAutonomousLoop();
    toast({
      title: "⏹️ Autonomous Loop Stopped",
      description: "Manual control restored",
    });
  };

  const coreAgents = agents.filter(a => a.category === 'core');
  const enhancedAgents = agents.filter(a => a.category === 'enhanced');

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
          Agents
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {coreAgents.length} Core
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            {enhancedAgents.length} Enhanced
          </Badge>
          {isAutonomousRunning && (
            <Badge className="bg-green-500 text-white animate-pulse">
              Autonomous • Cycle #{cycles}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <Button
          onClick={handleRunAllAgents}
          className="bg-purple-600 hover:bg-purple-700 text-white h-11 md:h-10"
        >
          <Play className="h-4 w-4 mr-2" />
          Run All {agents.length} Agents
        </Button>
        <Button
          onClick={handleRunRandomAgent}
          className="bg-blue-600 hover:bg-blue-700 text-white h-11 md:h-10"
        >
          <Zap className="h-4 w-4 mr-2" />
          Run Random Agent
        </Button>
        {!isAutonomousRunning ? (
          <Button
            onClick={handleStartAutonomousLoop}
            className="bg-green-600 hover:bg-green-700 text-white h-11 md:h-10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Autonomous
          </Button>
        ) : (
          <Button
            onClick={handleStopAutonomousLoop}
            className="bg-red-600 hover:bg-red-700 text-white h-11 md:h-10"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Autonomous
          </Button>
        )}
      </div>

      <div className="space-y-4 md:space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-purple-400">🚀 Enhanced Agents (V4.5+)</h2>
            <Button
              onClick={() => setShowEnhanced(!showEnhanced)}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
            >
              {showEnhanced ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {showEnhanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {enhancedAgents.map((agent, index) => (
                <AgentCard
                  key={index}
                  agentName={agent.name}
                  status={agent.status}
                  lastAction={agent.lastAction}
                  description={agent.description}
                  version={agent.version}
                  category={agent.category}
                  onRunAgent={handleRunAgent}
                  isRunning={runningAgents.has(agent.name)}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-blue-400">⚙️ Core Agents (V4.0)</h2>
            <Button
              onClick={() => setShowCore(!showCore)}
              variant="outline"
              size="sm"
              className="border-blue-400 text-blue-400 hover:bg-blue-400/20"
            >
              {showCore ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {showCore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {coreAgents.map((agent, index) => (
                <AgentCard
                  key={index}
                  agentName={agent.name}
                  status={agent.status}
                  lastAction={agent.lastAction}
                  description={agent.description}
                  version={agent.version}
                  category={agent.category}
                  onRunAgent={handleRunAgent}
                  isRunning={runningAgents.has(agent.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
