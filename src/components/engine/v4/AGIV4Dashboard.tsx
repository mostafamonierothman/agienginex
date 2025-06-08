
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, Database, Settings, Zap } from 'lucide-react';
import AGIV4DataInitializer from './AGIV4DataInitializer';
import AGIV4DataMonitor from './AGIV4DataMonitor';
import AGIV4ActivityFeed from './AGIV4ActivityFeed';
import AGIV4EnhancedAgentGrid from './AGIV4EnhancedAgentGrid';
import AGIV4Controls from '../AGIV4Controls';
import AutonomousLoopController from '../AutonomousLoopController';

const AGIV4Dashboard = () => {
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-purple-400" />
            🧠 AGI V4.5+ Complete System
          </CardTitle>
          <CardDescription className="text-gray-300">
            Advanced Artificial General Intelligence with 20 Enhanced Agents • Real-time Learning • Autonomous Operations
          </CardDescription>
        </CardHeader>
      </Card>

      <AGIV4DataInitializer onDataInitialized={() => setIsDataInitialized(true)} />

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Enhanced Agents
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Controls
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Monitor
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Feed
          </TabsTrigger>
          <TabsTrigger value="autonomous" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Autonomous Loop
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <AGIV4EnhancedAgentGrid />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <AGIV4Controls />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <AGIV4DataMonitor />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <AGIV4ActivityFeed />
        </TabsContent>

        <TabsContent value="autonomous" className="space-y-4">
          <AutonomousLoopController />
          <Card className="bg-slate-800/50 border border-slate-600/30">
            <CardHeader>
              <CardTitle className="text-white">Enhanced Autonomous System Status</CardTitle>
              <CardDescription className="text-slate-300">
                The Enhanced Autonomous Loop now includes all 20 agents (12 core + 8 enhanced V4.5 agents)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-gray-400">Core Agents</div>
                  <div className="text-white font-semibold">12 Agents</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-gray-400">Enhanced Agents</div>
                  <div className="text-purple-300 font-semibold">8 Agents</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-gray-400">Total System</div>
                  <div className="text-green-300 font-semibold">20 Agents</div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="text-gray-400">Version</div>
                  <div className="text-blue-300 font-semibold">V4.5+</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIV4Dashboard;
