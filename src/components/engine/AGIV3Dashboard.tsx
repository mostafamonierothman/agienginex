
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Zap, TrendingUp, Activity, MessageSquare, Users, CreditCard, BarChart3, Key } from 'lucide-react';
import { agiEngineXV3, AGIV3Response, UserSession, AGIReplayEntry } from '@/services/AGIengineXV3Service';

const AGIV3Dashboard = () => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState<AGIV3Response | null>(null);
  const [replayHistory, setReplayHistory] = useState<AGIReplayEntry[]>([]);
  const [billing, setBilling] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [userSession]);

  const loadDashboardData = async () => {
    if (!userSession) return;
    
    try {
      const [replayData, billingData, healthData] = await Promise.all([
        agiEngineXV3.getReplayHistory(userSession.user_id, 20),
        agiEngineXV3.getUserBilling(userSession.user_id),
        agiEngineXV3.getSystemHealthV3()
      ]);
      
      setReplayHistory(replayData);
      setBilling(billingData);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleAuthenticate = async () => {
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    const session = await agiEngineXV3.authenticateUser(apiKey);
    if (session) {
      setUserSession(session);
    } else {
      alert('Authentication failed. Please check your API key.');
    }
    setIsLoading(false);
  };

  const handleLLMChat = async () => {
    if (!chatMessage.trim() || !userSession) return;
    
    setIsLoading(true);
    const response = await agiEngineXV3.chatWithLLM(chatMessage, {
      provider: 'openai',
      model: 'gpt-4o-mini'
    });
    setChatResponse(response);
    setChatMessage('');
    await loadDashboardData(); // Refresh data
    setIsLoading(false);
  };

  const handleUpgrade = async (tier: 'pro' | 'enterprise') => {
    setIsLoading(true);
    const checkoutUrl = await agiEngineXV3.upgradeSubscription(tier);
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
    setIsLoading(false);
  };

  const handleRunAgent = async (agentName: string) => {
    if (!userSession) return;
    
    setIsLoading(true);
    const response = await agiEngineXV3.runAgentV3(agentName, {}, userSession.user_id);
    console.log('Agent response:', response);
    await loadDashboardData();
    setIsLoading(false);
  };

  // Authentication Required View
  if (!userSession) {
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
                placeholder="Enter your API key..."
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
                Don't have an API key? Contact sales for enterprise access.
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
        <p className="text-gray-400">Multi-User AGI with LLM Intelligence & Enterprise Features</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            {userSession.subscription_tier.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {userSession.tokens_remaining} tokens
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="chat" className="text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            LLM Chat
          </TabsTrigger>
          <TabsTrigger value="agents" className="text-white">
            <Brain className="w-4 h-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="replay" className="text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Replay
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
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
                🧠 LLM-Powered AGI Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask the AGI anything..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleLLMChat()}
                />
                <Button 
                  onClick={handleLLMChat}
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
            {['next_move_agent', 'opportunity_agent', 'critic_agent'].map((agent) => (
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

        <TabsContent value="replay" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                📊 AGI Session Replay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {replayHistory.map((entry, index) => (
                  <div key={entry.id || index} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {entry.agent_name}
                      </Badge>
                      <span className="text-xs text-gray-400">{entry.timestamp}</span>
                    </div>
                    <p className="text-white text-sm">{entry.output}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Execution: {entry.execution_time_ms}ms | Session: {entry.session_id}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  💳 Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subscription:</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {userSession.subscription_tier.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tokens:</span>
                    <span className="text-white">{userSession.tokens_remaining}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  🚀 Upgrade Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handleUpgrade('pro')}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Upgrade to PRO ($99/mo)
                </Button>
                <Button 
                  onClick={() => handleUpgrade('enterprise')}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Enterprise ($499/mo)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                🔧 System Health V3
              </CardTitle>
            </CardHeader>
            <CardContent>
              {systemHealth && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {systemHealth.status === 'healthy' ? '✅' : '⚠️'}
                    </div>
                    <div className="text-sm text-gray-400">Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">V3</div>
                    <div className="text-sm text-gray-400">Version</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {systemHealth.user_authenticated ? '🔐' : '🔓'}
                    </div>
                    <div className="text-sm text-gray-400">Auth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {systemHealth.features_available?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Features</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIV3Dashboard;
