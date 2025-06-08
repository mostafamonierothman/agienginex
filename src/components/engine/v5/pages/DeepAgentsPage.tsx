
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Activity, Zap, Play, Square } from 'lucide-react';
import {
  startDeepAutonomousLoop,
  stopDeepAutonomousLoop,
  isDeepAutonomousLoopRunning,
  shouldAutoStartDeepLoop
} from '@/engine/DeepAutonomousLoopController';
import { EnhancedMetaAgentRunner } from '@/agents/EnhancedMetaAgent';
import { EnhancedGoalAgentRunner } from '@/agents/EnhancedGoalAgent';
import { EnhancedCollaborationAgentRunner } from '@/agents/EnhancedCollaborationAgent';

const DeepAgentsPage = () => {
  const [agents, setAgents] = useState([
    { name: 'EnhancedMetaAgent', status: 'IDLE', lastAction: '' },
    { name: 'EnhancedGoalAgent', status: 'IDLE', lastAction: '' },
    { name: 'EnhancedCollaborationAgent', status: 'IDLE', lastAction: '' }
  ]);
  const [logs, setLogs] = useState([]);
  const [kpis, setKpis] = useState({
    cycles: 0,
    loopSpeed: 1000,
    errors: 0,
    lastAgent: '',
    lastResult: ''
  });
  const [isRunning, setIsRunning] = useState(false);

  // Enhanced agents with runners
  const enhancedAgents = [
    {
      name: 'EnhancedMetaAgent',
      runner: EnhancedMetaAgentRunner,
      status: 'IDLE',
      lastAction: 'System optimization analysis'
    },
    {
      name: 'EnhancedGoalAgent',
      runner: EnhancedGoalAgentRunner,
      status: 'IDLE',
      lastAction: 'Goal management and routing'
    },
    {
      name: 'EnhancedCollaborationAgent',
      runner: EnhancedCollaborationAgentRunner,
      status: 'IDLE',
      lastAction: 'Network collaboration analysis'
    }
  ];

  useEffect(() => {
    if (shouldAutoStartDeepLoop()) {
      console.log('[DEEP AGENTS] Auto-starting deep autonomous loop...');
      handleStartLoop();
    }
  }, []);

  const handleStartLoop = () => {
    startDeepAutonomousLoop(
      enhancedAgents,
      setAgents,
      setLogs,
      setKpis,
      { loopDelayMs: 2000, maxCycles: 1000 }
    );
    setIsRunning(true);
  };

  const handleStopLoop = () => {
    stopDeepAutonomousLoop();
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Brain className="h-8 w-8 text-purple-400" />
          Deep Agents System
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleStartLoop}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Deep Loop
          </Button>
          <Button
            onClick={handleStopLoop}
            disabled={!isRunning}
            variant="destructive"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Loop
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                Status: <span className={isRunning ? 'text-green-400' : 'text-red-400'}>
                  {isRunning ? 'Running' : 'Stopped'}
                </span>
              </p>
              <p className="text-gray-300">Cycles: <span className="text-blue-400">{kpis.cycles}</span></p>
              <p className="text-gray-300">Errors: <span className="text-red-400">{kpis.errors}</span></p>
              <p className="text-gray-300">Speed: <span className="text-purple-400">{kpis.loopSpeed}ms</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Last Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">Agent: <span className="text-yellow-400">{kpis.lastAgent}</span></p>
              <p className="text-gray-300">Result: <span className="text-green-400">{kpis.lastResult}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Enhanced Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {enhancedAgents.map((agent, idx) => (
                <p key={idx} className="text-gray-300">
                  {agent.name}: <span className="text-blue-400">{agent.status}</span>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Deep Loop Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto space-y-2">
            {logs.length === 0 ? (
              <p className="text-gray-400">No activity yet. Start the deep loop to see agent interactions.</p>
            ) : (
              logs.slice(-20).map((log, idx) => (
                <div key={idx} className="text-sm p-2 bg-slate-700/50 rounded">
                  <span className="text-blue-400">{log.agent}</span>
                  <span className="text-gray-300"> → </span>
                  <span className="text-green-400">{log.action}</span>
                  <span className="text-gray-300">: </span>
                  <span className="text-gray-200">{log.result}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepAgentsPage;
