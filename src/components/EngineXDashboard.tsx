
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ArrowUp, ArrowDown } from 'lucide-react';
import BusinessPathsTracker from './BusinessPathsTracker';

interface EngineState {
  timestamp: string;
  overall_status: string;
  tasks_completed_last_sec: number;
  learning_loop_progress_percent: number;
  latency_loop_current_latency_ms: number;
  pipeline_optimizer_efficiency_percent: number;
  active_agents: number;
  current_revenue: {
    medjourney_main: number;
    geo_expansion: number;
    waiting_list_targeting: number;
    billionaire_path: number;
    agi_healthcare: number;
    sweden_health: number;
    sweden_crime: number;
  };
  loop_status: {
    learning_loop: string;
    latency_optimizer_loop: string;
    pipeline_optimizer_loop: string;
    hardware_optimizer_loop: string;
    self_prioritizer_loop: string;
    opportunity_seeker_loop: string;
    self_rewrite_loop: string;
  };
  estimated_time_to_1_sec_finish_sec: number;
  estimated_days_to_10M_path: number;
  engine_cycle_rate_sec: number;
  femto_aspiration_gap_percent: number;
}

const EngineXDashboard = () => {
  const [engineState, setEngineState] = useState<EngineState | null>(null);
  const [apiUrl, setApiUrl] = useState('https://api.agienginex.ai');
  const [apiKey, setApiKey] = useState('');
  const [taskName, setTaskName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('agienginex_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('agienginex_api_key', apiKey);
    }
  }, [apiKey]);

  // Valid task names from your Engine X
  const validTasks = [
    'spawn_agents_main_medjourney',
    'spawn_agents_geo_expansion', 
    'spawn_agents_waiting_list_targeting',
    'optimize_agent_scaling',
    'start_learning_loop',
    'start_latency_optimizer_loop',
    'start_pipeline_optimizer_loop',
    'start_hardware_optimizer_loop',
    'start_self_prioritizer_loop',
    'start_opportunity_seeker_loop',
    'start_self_rewrite_loop',
    'refresh_dashboard_stream',
    'push_leadgen_campaign',
    'execute_best_action_now',
    'report_engine_state_now'
  ];

  // Fetch engine state every 5 seconds
  useEffect(() => {
    const fetchEngineState = async () => {
      if (!apiKey) {
        console.log('No API key provided, using demo data');
        setEngineState({
          timestamp: new Date().toISOString(),
          overall_status: "demo_mode",
          tasks_completed_last_sec: Math.floor(Math.random() * 200) + 50,
          learning_loop_progress_percent: Math.floor(Math.random() * 100),
          latency_loop_current_latency_ms: Math.floor(Math.random() * 50) + 10,
          pipeline_optimizer_efficiency_percent: Math.floor(Math.random() * 30),
          active_agents: Math.floor(Math.random() * 200) + 100,
          current_revenue: {
            medjourney_main: 125000,
            geo_expansion: 24500,
            waiting_list_targeting: 6800,
            billionaire_path: 0,
            agi_healthcare: 0,
            sweden_health: 0,
            sweden_crime: 0
          },
          loop_status: {
            learning_loop: "active",
            latency_optimizer_loop: "building",
            pipeline_optimizer_loop: "queued",
            hardware_optimizer_loop: "queued",
            self_prioritizer_loop: "queued",
            opportunity_seeker_loop: "active",
            self_rewrite_loop: "planned"
          },
          estimated_time_to_1_sec_finish_sec: 7.5,
          estimated_days_to_10M_path: 8,
          engine_cycle_rate_sec: 1,
          femto_aspiration_gap_percent: 88.3
        });
        setIsConnected(false);
        return;
      }

      try {
        console.log('Fetching engine state from:', `${apiUrl}/engine_state`);
        const response = await fetch(`${apiUrl}/engine_state`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEngineState(data);
          setIsConnected(true);
          setLastUpdate(new Date());
          console.log('Engine state updated:', data);
        } else if (response.status === 401) {
          throw new Error('Invalid API key');
        } else {
          throw new Error('Failed to fetch engine state');
        }
      } catch (error) {
        console.error('Error fetching engine state:', error);
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: error instanceof Error ? error.message : "Failed to connect to Engine X",
          variant: "destructive",
        });
      }
    };

    fetchEngineState();
    const interval = setInterval(fetchEngineState, 5000);
    return () => clearInterval(interval);
  }, [apiUrl, apiKey]);

  const triggerTask = async () => {
    if (!taskName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your API key first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Triggering task:', taskName);
      const response = await fetch(`${apiUrl}/trigger_task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_name: taskName }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Task Triggered",
          description: `Task "${taskName}" has been sent to AGI Engine X`,
        });
        setTaskName('');
        console.log('Task triggered successfully:', result);
      } else if (response.status === 401) {
        throw new Error('Invalid API key');
      } else {
        throw new Error('Failed to trigger task');
      }
    } catch (error) {
      console.error('Error triggering task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to trigger task",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accelerating': return 'bg-green-500';
      case 'active': return 'bg-green-500';
      case 'building': return 'bg-blue-500';
      case 'queued': return 'bg-yellow-500';
      case 'planned': return 'bg-purple-500';
      case 'demo_mode': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const totalRevenue = engineState ? Object.values(engineState.current_revenue).reduce((sum, val) => sum + val, 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AGI ENGINE X
          </h1>
          <p className="text-xl text-gray-300">
            Self-Optimizing Intelligence • 1-Second Loop • Trillionaire Path
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
              {isConnected ? "🟢 CONNECTED" : apiKey ? "🔴 CONNECTION ERROR" : "🟡 DEMO MODE"}
            </Badge>
            {lastUpdate && (
              <span className="text-sm text-gray-400">
                Last Update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="engine" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="engine" className="text-white">🤖 Engine Control</TabsTrigger>
            <TabsTrigger value="business" className="text-white">💰 Business Paths</TabsTrigger>
            <TabsTrigger value="loops" className="text-white">🔄 Core Loops</TabsTrigger>
          </TabsList>

          <TabsContent value="engine" className="space-y-6">
            {/* API Configuration */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Engine Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="API URL (e.g., https://api.agienginex.ai)"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="API Key (Bearer Token)"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Core Engine Metrics */}
            {engineState && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">ENGINE STATUS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(engineState.overall_status)} animate-pulse`}></div>
                      <span className="text-2xl font-bold text-white capitalize">
                        {engineState.overall_status.replace('_', ' ')}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">TASKS/SEC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-green-400">
                        {engineState.tasks_completed_last_sec}
                      </span>
                      <ArrowUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-500">{engineState.active_agents} active agents</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">LEARNING PROGRESS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">
                        {engineState.learning_loop_progress_percent}%
                      </span>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${engineState.learning_loop_progress_percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">LATENCY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-blue-400">
                        {engineState.latency_loop_current_latency_ms}ms
                      </span>
                      <ArrowDown className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-500">Ultra-low latency</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Advanced Engine Metrics */}
            {engineState && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">💰 Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-green-400">
                        {formatCurrency(totalRevenue)}
                      </div>
                      <div className="text-gray-300">
                        <p>🚀 {engineState.estimated_days_to_10M_path} days to $10M</p>
                        <p>⚡ {engineState.estimated_time_to_1_sec_finish_sec}s to 1-sec loop</p>
                        <p>🎯 {engineState.femto_aspiration_gap_percent}% gap remaining</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">🔄 Engine Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cycle Rate:</span>
                        <span className="text-white font-bold">{engineState.engine_cycle_rate_sec}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Agents:</span>
                        <span className="text-white font-bold">{engineState.active_agents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pipeline Efficiency:</span>
                        <span className="text-white font-bold">{engineState.pipeline_optimizer_efficiency_percent}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">🌍 Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">MedJourney+:</span>
                        <span className="text-green-400 font-bold">{formatCurrency(engineState.current_revenue.medjourney_main)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Geo Expansion:</span>
                        <span className="text-green-400 font-bold">{formatCurrency(engineState.current_revenue.geo_expansion)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Waiting List:</span>
                        <span className="text-green-400 font-bold">{formatCurrency(engineState.current_revenue.waiting_list_targeting)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Task Trigger Interface */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">⚡ Task Command Center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter task name or select from quick actions below"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && triggerTask()}
                  />
                  <Button 
                    onClick={triggerTask}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Trigger Task
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('execute_best_action_now')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Best Action Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('optimize_agent_scaling')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Scale Agents
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('start_pipeline_optimizer_loop')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Start Pipeline
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('push_leadgen_campaign')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Push Leadgen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('spawn_agents_main_medjourney')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Spawn MedJourney
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('spawn_agents_geo_expansion')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Spawn Geo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('start_learning_loop')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Start Learning
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('refresh_dashboard_stream')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Refresh Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <BusinessPathsTracker engineState={engineState} />
          </TabsContent>

          <TabsContent value="loops" className="space-y-6">
            {/* 7 Core Loops Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">🔄 Seven Core Loops Status</CardTitle>
                <p className="text-gray-400">Compounding Intelligence Architecture</p>
              </CardHeader>
              <CardContent>
                {engineState && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(engineState.loop_status).map(([loop, status]) => (
                      <Card key={loop} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold capitalize">
                              {loop.replace(/_/g, ' ')}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${status === 'active' ? 'text-green-400 border-green-400' : ''}
                                ${status === 'building' ? 'text-blue-400 border-blue-400' : ''}
                                ${status === 'queued' ? 'text-yellow-400 border-yellow-400' : ''}
                                ${status === 'planned' ? 'text-purple-400 border-purple-400' : ''}
                              `}
                            >
                              {status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {loop === 'learning_loop' && `${engineState.learning_loop_progress_percent}% progress`}
                            {loop === 'latency_optimizer_loop' && `${engineState.latency_loop_current_latency_ms}ms current latency`}
                            {loop === 'pipeline_optimizer_loop' && `${engineState.pipeline_optimizer_efficiency_percent}% efficiency`}
                            {!['learning_loop', 'latency_optimizer_loop', 'pipeline_optimizer_loop'].includes(loop) && 'Waiting for activation'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loop Performance Metrics */}
            {engineState && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">🧠 Learning Loop Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-green-400 font-bold">{engineState.learning_loop_progress_percent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-white font-bold capitalize">{engineState.loop_status.learning_loop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Agents</span>
                        <span className="text-purple-400 font-bold">{engineState.active_agents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tasks/Second</span>
                        <span className="text-blue-400 font-bold">{engineState.tasks_completed_last_sec}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">⚡ Latency Optimizer Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Latency</span>
                        <span className="text-green-400 font-bold">{engineState.latency_loop_current_latency_ms}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Latency</span>
                        <span className="text-yellow-400 font-bold">5ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-white font-bold capitalize">{engineState.loop_status.latency_optimizer_loop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cycle Rate</span>
                        <span className="text-blue-400 font-bold">{engineState.engine_cycle_rate_sec}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EngineXDashboard;
