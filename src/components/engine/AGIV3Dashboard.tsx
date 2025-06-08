
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Zap, TrendingUp, Activity, MessageSquare, Users, CreditCard, BarChart3, Key } from 'lucide-react';
import { agiEngineXV3 } from '@/services/AGIengineXV3Service';

const AGIV3Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState<any>(null);
  const [supervisorLogs, setSupervisorLogs] = useState<any[]>([]);
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      const [logsData, goalsData] = await Promise.all([
        agiEngineXV3.getSupervisorLogs(20),
        agiEngineXV3.getActiveGoals()
      ]);
      
      setSupervisorLogs(logsData);
      setActiveGoals(goalsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleAuthenticate = async () => {
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    // Simple authentication simulation
    if (apiKey === 'demo_key' || apiKey.length > 10) {
      setIsAuthenticated(true);
    } else {
      alert('Authentication failed. Use "demo_key" or enter a valid API key.');
    }
    setIsLoading(false);
  };

  const handleRunAgent = async (agentName: string) => {
    setIsLoading(true);
    try {
      const response = await agiEngineXV3.runEnhancedAgent(agentName, {
        enhanced_mode: true,
        context_aware: true
      });
      console.log('Agent response:', response);
      await loadDashboardData();
    } catch (error) {
      console.error('Agent execution failed:', error);
    }
    setIsLoading(false);
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate chat response
      const response = {
        agent_used: 'llm_agent',
        response: `AI Response: I understand you said "${chatMessage}". This is a simulated response from the AGI system.`,
        timestamp: new Date().toLocaleTimeString(),
        tokens_used: Math.floor(Math.random() * 100) + 50
      };
      setChatResponse(response);
      setChatMessage('');
      await loadDashboardData();
    } catch (error) {
      console.error('Chat failed:', error);
    }
    setIsLoading(false);
  };

  // Authentication Required View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              🚀 AGIengineX V3
            </CardTitle>
            <p className="text-gray-400">Multi-User AGI Platform</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">API Key</label>
              <Input
                type="password"
                placeholder="Enter 'demo_key' or your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
              />
            </div>
            
            <Button 
              onClick={handleAuthenticate}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Authenticating...' : 'Authenticate'}
            </Button>
            
            <div className="text-center">
              <p className="text-gray-400 text-xs">
                Use "demo_key" for demo access or enter your API key.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGIengineX V3 Platform</h2>
        <p className="text-gray-400">Multi-User AGI with Enhanced Features & Enterprise Controls</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            AUTHENTICATED
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            UNLIMITED
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800">
          <TabsTrigger value="chat" className="text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            AGI Chat
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-white">
            <Brain className="w-4 h-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="system" className="text-white">
            <Activity className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                🧠 AGI Chat Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask the AGI anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                />
                <Button 
                  onClick={handleChat}
                  disabled={isLoading || !chatMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Send
                </Button>
              </div>
              
              {chatResponse && (
                <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {chatResponse.agent_used}
                    </Badge>
                    <span className="text-xs text-gray-400">{chatResponse.timestamp}</span>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{chatResponse.response}</p>
                  {chatResponse.tokens_used && (
                    <p className="text-xs text-gray-400 mt-2">Tokens used: {chatResponse.tokens_used}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['strategic_planner', 'opportunity_detector', 'performance_critic'].map((agent) => (
              <Card key={agent} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4 text-center">
                  <h3 className="text-white font-medium mb-2">{agent.replace('_', ' ').toUpperCase()}</h3>
                  <Button 
                    onClick={() => handleRunAgent(agent)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Run Agent
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                📊 AGI Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {supervisorLogs.length > 0 ? (
                  supervisorLogs.map((entry, index) => (
                    <div key={entry.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {entry.agent_name}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{entry.output || entry.action}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Status: {entry.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No activity logs yet. Run some agents to see activity.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                🔧 System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">✅</div>
                  <div className="text-sm text-gray-400">Status</div>
                  <div className="text-xs text-white">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">V3</div>
                  <div className="text-sm text-gray-400">Version</div>
                  <div className="text-xs text-white">Latest</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">🔐</div>
                  <div className="text-sm text-gray-400">Auth</div>
                  <div className="text-xs text-white">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{activeGoals.length}</div>
                  <div className="text-sm text-gray-400">Goals</div>
                  <div className="text-xs text-white">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIV3Dashboard;
