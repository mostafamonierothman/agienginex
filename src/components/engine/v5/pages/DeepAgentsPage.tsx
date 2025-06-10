
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Zap, Target, Cpu, Network, GitBranch } from 'lucide-react';
import { AGOCoreLoopAgentRunner } from '@/agents/AGOCoreLoopAgent';
import { ReflectionAgentRunner } from '@/agents/ReflectionAgent';
import { AutonomyTriggerAgentRunner } from '@/agents/AutonomyTriggerAgent';
import { CrossAgentFeedbackAgentRunner } from '@/agents/CrossAgentFeedbackAgent';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

const DeepAgentsPage = () => {
  const [isRunningAGO, setIsRunningAGO] = useState(false);
  const [lastResults, setLastResults] = useState({});
  const [agentStats, setAgentStats] = useState({
    totalRuns: 0,
    successRate: 0,
    avgScore: 0
  });

  const deepAgents = [
    {
      name: 'AGO Core Loop',
      key: 'ago_core_loop',
      description: 'Master AGI orchestrator with goal selection, execution, and self-improvement',
      icon: Brain,
      color: 'purple',
      runner: AGOCoreLoopAgentRunner,
      category: 'Master Control'
    },
    {
      name: 'Reflection Agent',
      key: 'reflection',
      description: 'System reflection and autonomous decision-making for goal progress',
      icon: Cpu,
      color: 'blue',
      runner: ReflectionAgentRunner,
      category: 'Self-Analysis'
    },
    {
      name: 'Autonomy Trigger',
      key: 'autonomy_trigger',
      description: 'Monitors conditions and triggers autonomous actions when needed',
      icon: Zap,
      color: 'yellow',
      runner: AutonomyTriggerAgentRunner,
      category: 'Autonomous Control'
    },
    {
      name: 'Cross-Agent Feedback',
      key: 'cross_feedback',
      description: 'Inter-agent performance analysis and optimization recommendations',
      icon: Network,
      color: 'green',
      runner: CrossAgentFeedbackAgentRunner,
      category: 'Performance Analysis'
    }
  ];

  const runDeepAgent = async (agent) => {
    const startTime = Date.now();
    
    try {
      await sendChatUpdate(`🧠 Starting ${agent.name}...`);
      
      const result = await agent.runner({
        input: {
          trigger: 'deep_agent_manual_run',
          timestamp: new Date().toISOString(),
          requestedBy: 'dashboard_user'
        },
        user_id: 'deep_agents_page'
      });

      const duration = Date.now() - startTime;
      
      setLastResults(prev => ({
        ...prev,
        [agent.key]: {
          ...result,
          duration,
          timestamp: new Date().toISOString()
        }
      }));

      await sendChatUpdate(`✅ ${agent.name} completed in ${duration}ms`);
      
      // Update stats
      setAgentStats(prev => ({
        totalRuns: prev.totalRuns + 1,
        successRate: result.success ? 
          ((prev.successRate * prev.totalRuns + 100) / (prev.totalRuns + 1)) : 
          ((prev.successRate * prev.totalRuns) / (prev.totalRuns + 1)),
        avgScore: result.data?.score ? 
          ((prev.avgScore * prev.totalRuns + result.data.score) / (prev.totalRuns + 1)) : 
          prev.avgScore
      }));

    } catch (error) {
      await sendChatUpdate(`❌ ${agent.name} failed: ${error.message}`);
      setLastResults(prev => ({
        ...prev,
        [agent.key]: {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  const runAGOCoreLoop = async () => {
    setIsRunningAGO(true);
    try {
      await runDeepAgent(deepAgents[0]); // AGO Core Loop
    } finally {
      setIsRunningAGO(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            Deep AGI Agent Operations
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              V7+ Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">{agentStats.totalRuns}</div>
              <div className="text-sm text-gray-300">Total Deep Runs</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400">{agentStats.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-blue-400">{agentStats.avgScore.toFixed(1)}</div>
              <div className="text-sm text-gray-300">Average Score</div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={runAGOCoreLoop}
              disabled={isRunningAGO}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isRunningAGO ? "🧠 Running AGO..." : "🚀 Execute AGO Core Loop"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deep Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deepAgents.map((agent) => {
          const IconComponent = agent.icon;
          const lastResult = lastResults[agent.key];
          
          return (
            <Card key={agent.key} className="bg-slate-800/50 border-slate-600/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-purple-400" />
                  {agent.name}
                  <Badge className={getColorClasses(agent.color)}>
                    {agent.category}
                  </Badge>
                </CardTitle>
                <p className="text-gray-300 text-sm">{agent.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => runDeepAgent(agent)}
                  className="w-full"
                  variant="outline"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  Execute Agent
                </Button>

                {lastResult && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Last Result:</span>
                      <Badge variant={lastResult.success ? "default" : "destructive"}>
                        {lastResult.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    
                    <div className="bg-slate-700/30 rounded p-3">
                      <div className="text-sm text-gray-300 mb-2">
                        {new Date(lastResult.timestamp).toLocaleString()}
                      </div>
                      <div className="text-sm text-white">
                        {lastResult.message?.substring(0, 150)}
                        {lastResult.message?.length > 150 ? '...' : ''}
                      </div>
                      {lastResult.duration && (
                        <div className="text-xs text-gray-400 mt-2">
                          Execution time: {lastResult.duration}ms
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeepAgentsPage;
