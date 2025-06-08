
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Zap, TrendingUp, Users, Target, Settings, Rocket, TestTube, Bot, Activity } from 'lucide-react';
import EngineConnection from '../engine/EngineConnection';
import EngineMetrics from '../engine/EngineMetrics';
import LoopsStatus from '../engine/LoopsStatus';
import LoopsPerformance from '../engine/LoopsPerformance';
import AGIDashboard from '../engine/AGIDashboard';
import MultiAgentDashboard from '../engine/MultiAgentDashboard';
import AGIV2Dashboard from '../engine/AGIV2Dashboard';
import AGIV3Dashboard from '../engine/AGIV3Dashboard';
import AGIV4Dashboard from '../engine/AGIV4Dashboard';
import AGIV4Controls from '../engine/AGIV4Controls';
import BusinessPathsTracker from '../BusinessPathsTracker';
import APIChain from '../engine/APIChain';
import TaskCommandCenter from '../engine/TaskCommandCenter';
import EngineAdvancedMetrics from '../engine/EngineAdvancedMetrics';

interface DashboardTabsProps {
  engineState: any;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  taskName: string;
  setTaskName: (name: string) => void;
  triggerTask: () => void;
}

const DashboardTabs = ({
  engineState,
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
  taskName,
  setTaskName,
  triggerTask
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="v4" className="w-full">
      <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-2 bg-slate-800/50">
        <TabsTrigger value="v4" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-purple-600">
          <Rocket className="w-4 h-4" />
          V4
        </TabsTrigger>
        <TabsTrigger value="v3" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-blue-600">
          <Brain className="w-4 h-4" />
          V3
        </TabsTrigger>
        <TabsTrigger value="v2" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-green-600">
          <Bot className="w-4 h-4" />
          V2
        </TabsTrigger>
        <TabsTrigger value="ctrl" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-yellow-600">
          <Zap className="w-4 h-4" />
          Ctrl
        </TabsTrigger>
        <TabsTrigger value="agi" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-red-600">
          <Target className="w-4 h-4" />
          AGI
        </TabsTrigger>
        <TabsTrigger value="test" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-orange-600">
          <TestTube className="w-4 h-4" />
          Test
        </TabsTrigger>
        <TabsTrigger value="ai" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-cyan-600">
          <Brain className="w-4 h-4" />
          AI
        </TabsTrigger>
        <TabsTrigger value="api" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-pink-600">
          <Activity className="w-4 h-4" />
          API
        </TabsTrigger>
        <TabsTrigger value="engine" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-indigo-600">
          <Settings className="w-4 h-4" />
          Engine
        </TabsTrigger>
        <TabsTrigger value="business" className="flex flex-col items-center gap-1 text-xs text-white data-[state=active]:bg-emerald-600">
          <TrendingUp className="w-4 h-4" />
          Business
        </TabsTrigger>
      </TabsList>

      <TabsContent value="v4" className="space-y-6">
        <div className="space-y-6">
          <AGIV4Controls />
          <AGIV4Dashboard />
        </div>
      </TabsContent>

      <TabsContent value="v3" className="space-y-6">
        <AGIV3Dashboard />
      </TabsContent>

      <TabsContent value="v2" className="space-y-6">
        <AGIV2Dashboard />
      </TabsContent>

      <TabsContent value="ctrl" className="space-y-6">
        <TaskCommandCenter
          taskName={taskName}
          setTaskName={setTaskName}
          triggerTask={triggerTask}
        />
      </TabsContent>

      <TabsContent value="agi" className="space-y-6">
        <AGIDashboard />
      </TabsContent>

      <TabsContent value="test" className="space-y-6">
        <MultiAgentDashboard />
      </TabsContent>

      <TabsContent value="ai" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EngineConnection
            apiUrl={apiUrl}
            setApiUrl={setApiUrl}
            apiKey={apiKey}
            setApiKey={setApiKey}
          />
          <EngineAdvancedMetrics engineState={engineState} />
        </div>
      </TabsContent>

      <TabsContent value="api" className="space-y-6">
        <APIChain />
      </TabsContent>

      <TabsContent value="engine" className="space-y-6">
        <div className="space-y-6">
          <EngineMetrics engineState={engineState} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LoopsStatus engineState={engineState} />
            <LoopsPerformance engineState={engineState} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="business" className="space-y-6">
        <BusinessPathsTracker />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
