
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, TrendingUp, Activity, MessageSquare } from 'lucide-react';
import { agiEngineX, AGIGoal } from '@/services/AGIengineXService';

const AGIV2Dashboard = () => {
  const [goals, setGoals] = useState<AGIGoal[]>([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [goalsData, statusData] = await Promise.all([
        agiEngineX.getCurrentGoals(),
        agiEngineX.getSystemStatus()
      ]);
      
      setGoals(goalsData);
      setSystemStatus(statusData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalText.trim()) return;
    
    setIsLoading(true);
    const success = await agiEngineX.createGoal(newGoalText, 5);
    if (success) {
      setNewGoalText('');
      await loadDashboardData();
    }
    setIsLoading(false);
  };

  const handleRunAgentChain = async () => {
    setIsLoading(true);
    const result = await agiEngineX.runAgentChain();
    console.log('Agent chain result:', result);
    await loadDashboardData();
    setIsLoading(false);
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    setIsLoading(true);
    const response = await agiEngineX.chat(chatMessage);
    setChatResponse(response.response);
    setChatMessage('');
    setIsLoading(false);
  };

  const handleTriggerWebhook = async () => {
    setIsLoading(true);
    await agiEngineX.triggerWebhook('market_change', {
      source: 'dashboard',
      data: 'Manual market change trigger'
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧠 AGIengineX V2 Dashboard</h2>
        <p className="text-gray-400">TRUE AGI Platform with Autonomous Agents, Goals, and Self-Reflection</p>
      </div>

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            🚀 AGI System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {systemStatus?.agi_loop_running ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">AGI Loop</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {systemStatus?.active_goals || 0}
            </div>
            <div className="text-sm text-gray-400">Active Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {systemStatus?.performance_score || 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {systemStatus?.agi_features?.autonomy ? '🧠' : '⚠️'}
            </div>
            <div className="text-sm text-gray-400">Autonomy</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Management */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              🎯 AGI Goals Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter new AGI goal..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateGoal()}
              />
              <Button 
                onClick={handleCreateGoal}
                disabled={isLoading || !newGoalText.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add Goal
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {goals.map((goal, index) => (
                <div key={goal.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Priority {goal.priority}
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {goal.progress_percentage || 0}%
                    </Badge>
                  </div>
                  <p className="text-white text-sm">{goal.goal_text}</p>
                  <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${goal.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AGI Chat Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              💬 AGI Chat Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask AGI about goals, performance, strategies..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
              />
              <Button 
                onClick={handleChat}
                disabled={isLoading || !chatMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ask AGI
              </Button>
            </div>
            
            {chatResponse && (
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <h4 className="text-white font-medium mb-2">🤖 AGI Response:</h4>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{chatResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AGI Operations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            ⚡ AGI Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={handleRunAgentChain}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 p-6 h-auto flex flex-col items-center gap-2"
          >
            <Brain className="w-6 h-6" />
            <span>🔗 Run Agent Chain</span>
            <span className="text-xs opacity-75">Execute autonomous agent sequence</span>
          </Button>
          
          <Button 
            onClick={handleTriggerWebhook}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 p-6 h-auto flex flex-col items-center gap-2"
          >
            <TrendingUp className="w-6 h-6" />
            <span>🌍 Trigger Environment Event</span>
            <span className="text-xs opacity-75">Simulate external market change</span>
          </Button>
          
          <Button 
            onClick={loadDashboardData}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 p-6 h-auto flex flex-col items-center gap-2"
          >
            <Activity className="w-6 h-6" />
            <span>📊 Refresh Dashboard</span>
            <span className="text-xs opacity-75">Update all AGI metrics</span>
          </Button>
        </CardContent>
      </Card>

      {/* AGI Features Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            🎛️ TRUE AGI Features
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">
              {systemStatus?.agi_features?.autonomy ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">Autonomy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {systemStatus?.agi_features?.self_reflection ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">Self-Reflection</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {systemStatus?.agi_features?.goal_driven ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">Goal-Driven</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {systemStatus?.agi_features?.environment_adaptive ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">Adaptive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">
              {systemStatus?.agi_features?.agent_chaining ? '✅' : '❌'}
            </div>
            <div className="text-sm text-gray-400">Chaining</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIV2Dashboard;
