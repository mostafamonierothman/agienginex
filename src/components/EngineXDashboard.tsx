
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
  engine_status: string;
  tasks_in_queue: number;
  tasks_per_sec: number;
  learning_progress: number;
  latency_ms: number;
  current_million_dollar_path_progress: string;
  geo_expansion_status: string;
}

const EngineXDashboard = () => {
  const [engineState, setEngineState] = useState<EngineState | null>(null);
  const [apiUrl, setApiUrl] = useState('http://localhost:5000');
  const [taskName, setTaskName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch engine state every 5 seconds
  useEffect(() => {
    const fetchEngineState = async () => {
      try {
        console.log('Fetching engine state from:', `${apiUrl}/engine_state`);
        const response = await fetch(`${apiUrl}/engine_state`);
        
        if (response.ok) {
          const data = await response.json();
          setEngineState(data);
          setIsConnected(true);
          setLastUpdate(new Date());
          console.log('Engine state updated:', data);
        } else {
          throw new Error('Failed to fetch engine state');
        }
      } catch (error) {
        console.error('Error fetching engine state:', error);
        setIsConnected(false);
        // Still show demo data when disconnected
        setEngineState({
          engine_status: "demo_mode",
          tasks_in_queue: Math.floor(Math.random() * 50) + 10,
          tasks_per_sec: Math.floor(Math.random() * 15) + 5,
          learning_progress: Math.floor(Math.random() * 100),
          latency_ms: Math.floor(Math.random() * 50) + 10,
          current_million_dollar_path_progress: `$${Math.floor(Math.random() * 500)}K`,
          geo_expansion_status: "DEMO: UK, EU, USA, Gulf ACTIVE"
        });
      }
    };

    fetchEngineState();
    const interval = setInterval(fetchEngineState, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  const triggerTask = async () => {
    if (!taskName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Triggering task:', taskName);
      const response = await fetch(`${apiUrl}/trigger_task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskName }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Task Triggered",
          description: `Task "${taskName}" has been sent to AGI Engine X`,
        });
        setTaskName('');
        console.log('Task triggered successfully:', result);
      } else {
        throw new Error('Failed to trigger task');
      }
    } catch (error) {
      console.error('Error triggering task:', error);
      toast({
        title: "Connection Error",
        description: "Failed to trigger task. Check your API connection.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accelerating': return 'bg-green-500';
      case 'optimizing': return 'bg-blue-500';
      case 'learning': return 'bg-purple-500';
      case 'demo_mode': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

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
              {isConnected ? "🟢 CONNECTED" : "🔴 DEMO MODE"}
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
                    placeholder="API URL (e.g., http://localhost:5000)"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
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
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(engineState.engine_status)} animate-pulse`}></div>
                      <span className="text-2xl font-bold text-white capitalize">
                        {engineState.engine_status.replace('_', ' ')}
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
                        {engineState.tasks_per_sec}
                      </span>
                      <ArrowUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-500">{engineState.tasks_in_queue} in queue</p>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-400">LEARNING PROGRESS</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <span className="text-3xl font-bold text-purple-400">
                        {engineState.learning_progress}%
                      </span>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${engineState.learning_progress}%` }}
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
                        {engineState.latency_ms}ms
                      </span>
                      <ArrowDown className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-500">Ultra-low latency</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Business Path Progress */}
            {engineState && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">💰 Million Dollar Path Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-green-400">
                        {engineState.current_million_dollar_path_progress}
                      </div>
                      <div className="text-gray-300">
                        <p>🚀 MedJourney+ Active</p>
                        <p>🌍 GEO Expansion Running</p>
                        <p>📋 Waiting List Targeting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">🌍 Geographic Expansion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg text-gray-300">
                      {engineState.geo_expansion_status}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <Badge variant="outline" className="text-green-400 border-green-400">UK ✓</Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400">EU ✓</Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400">USA ✓</Badge>
                      <Badge variant="outline" className="text-green-400 border-green-400">Gulf ✓</Badge>
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
                    placeholder="Enter task name (e.g., optimize_geo_expansion, accelerate_learning_loop)"
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('optimize_geo_expansion')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Optimize GEO
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('accelerate_learning_loop')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Accelerate Learning
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('scale_revenue_path')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Scale Revenue
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setTaskName('optimize_latency')}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Optimize Latency
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <BusinessPathsTracker />
          </TabsContent>

          <TabsContent value="loops" className="space-y-6">
            {/* 7 Core Loops Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">🔄 Seven Core Loops Status</CardTitle>
                <p className="text-gray-400">Compounding Intelligence Architecture</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Learning Loop", status: "ACTIVE", color: "green", description: "Agents get smarter every sec" },
                    { name: "Latency Optimizer", status: "BUILDING", color: "yellow", description: "Engine gets faster every sec" },
                    { name: "Opportunity Seeker", status: "PLANNED", color: "blue", description: "Finds new $ paths every sec" },
                    { name: "Hardware Optimizer", status: "PLANNED", color: "gray", description: "Infinite infra scaling" },
                    { name: "Task Pipeline Optimizer", status: "PLANNED", color: "gray", description: "Finish ALL tasks in 1 sec" },
                    { name: "Self-Prioritizer", status: "PLANNED", color: "gray", description: "No human bottleneck" },
                    { name: "Self-Rewrite Loop", status: "FUTURE", color: "purple", description: "Ultimate AGI - self-evolution" }
                  ].map((loop, index) => (
                    <Card key={index} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold">{loop.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`
                              ${loop.color === 'green' ? 'text-green-400 border-green-400' : ''}
                              ${loop.color === 'yellow' ? 'text-yellow-400 border-yellow-400' : ''}
                              ${loop.color === 'blue' ? 'text-blue-400 border-blue-400' : ''}
                              ${loop.color === 'gray' ? 'text-gray-400 border-gray-400' : ''}
                              ${loop.color === 'purple' ? 'text-purple-400 border-purple-400' : ''}
                            `}
                          >
                            {loop.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{loop.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Loop Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">🧠 Learning Loop Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Knowledge Base Growth</span>
                      <span className="text-green-400 font-bold">+12.4% daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Agent Intelligence Score</span>
                      <span className="text-white font-bold">847/1000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Learning Rate</span>
                      <span className="text-purple-400 font-bold">2.3x baseline</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Adaptation Speed</span>
                      <span className="text-blue-400 font-bold">0.7 seconds</span>
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
                      <span className="text-green-400 font-bold">13ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Latency</span>
                      <span className="text-yellow-400 font-bold">5ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Optimization Rate</span>
                      <span className="text-white font-bold">-2ms/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bottleneck Detection</span>
                      <span className="text-blue-400 font-bold">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EngineXDashboard;
