
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RefreshCw, Settings, Bot, Brain, Target } from 'lucide-react';
import { agiEngineX, AgentInfo } from '@/services/AGIengineXService';

interface AGIGoal {
  id: string;
  goal_text: string;
  progress_percentage: number;
  priority: number;
  status: string;
}

const AGISystemControls = () => {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [goals, setGoals] = useState<AGIGoal[]>([]);
  const [loopRunning, setLoopRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      const [status, availableAgents] = await Promise.all([
        agiEngineX.getSystemStatus(),
        agiEngineX.getAvailableAgents()
      ]);
      
      setSystemStatus(status);
      setAgents(availableAgents);
      setLoopRunning(status.agi_loop_running || false);

      // Load AGI goals
      try {
        const response = await fetch('https://hnudinfejowoxlybifqq.supabase.co/functions/v1/agienginex/goals', {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU`
          }
        });
        if (response.ok) {
          const goalsData = await response.json();
          setGoals(goalsData.goals || []);
        }
      } catch (error) {
        console.log('Goals not yet available');
      }
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLoop = async () => {
    setIsLoading(true);
    const success = await agiEngineX.startLoop();
    if (success) {
      setLoopRunning(true);
    }
    setIsLoading(false);
  };

  const handleStopLoop = async () => {
    setIsLoading(true);
    const success = await agiEngineX.stopLoop();
    if (success) {
      setLoopRunning(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            🎛️ AGI V2 Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">TRUE AGI Loop:</span>
            <Badge 
              variant="outline" 
              className={loopRunning ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}
            >
              {loopRunning ? '🟢 AUTONOMOUS' : '🔴 STOPPED'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">AGI Features:</span>
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                ✅ Goals ✅ Self-Reflection ✅ Adaptive
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Performance Score:</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              {systemStatus?.performance_score || 'N/A'}/10
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStartLoop}
              disabled={loopRunning || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start AGI
            </Button>
            <Button
              onClick={handleStopLoop}
              disabled={!loopRunning || isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop AGI
            </Button>
          </div>

          <Button
            onClick={loadSystemData}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            🎯 AGI Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {goals.length > 0 ? (
            goals.map((goal, index) => (
              <div key={goal.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">Priority {goal.priority}</span>
                  <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                    {goal.progress_percentage || 0}%
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{goal.goal_text}</p>
                <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${goal.progress_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm text-center py-4">
              No active goals found. AGI system will initialize default goals.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            🤖 AGI Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {agents.map((agent, index) => (
            <div key={index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium text-sm">
                  {agent.name.replace('_', ' ').toUpperCase()}
                </h3>
                <Badge variant="outline" className="text-green-400 border-green-400 text-xs">
                  AGI-READY
                </Badge>
              </div>
              <p className="text-gray-400 text-xs mb-2">{agent.description}</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((capability, capIndex) => (
                  <Badge key={capIndex} variant="secondary" className="text-xs">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AGISystemControls;
