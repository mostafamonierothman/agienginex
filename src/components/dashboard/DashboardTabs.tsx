import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrillionPathDashboard from '../engine/TrillionPathDashboard';
import AutoDeployDashboard from '../engine/AutoDeployDashboard';
import EngineConnection from '../engine/EngineConnection';
import EngineMetrics from '../engine/EngineMetrics';
import EngineAdvancedMetrics from '../engine/EngineAdvancedMetrics';
import TaskCommandCenter from '../engine/TaskCommandCenter';
import LoopsStatus from '../engine/LoopsStatus';
import LoopsPerformance from '../engine/LoopsPerformance';
import LoopEngine from '../loops/LoopEngine';
import APIChain from '../engine/APIChain';
import EnhancedAGIEngine from '../engine/EnhancedAGIEngine';
import OpenAIIntegration from '../engine/OpenAIIntegration';

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
    <Tabs defaultValue="trillion-path" className="w-full">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 bg-slate-800 h-auto gap-1 p-1">
        <TabsTrigger value="trillion-path" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">💎 Trillion Path</span>
          <span className="sm:hidden">💎 Path</span>
        </TabsTrigger>
        <TabsTrigger value="auto-deploy" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🚀 Auto-Deploy</span>
          <span className="sm:hidden">🚀 Deploy</span>
        </TabsTrigger>
        <TabsTrigger value="enhanced-agi" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🧠 Enhanced AGI</span>
          <span className="sm:hidden">🧠 AGI</span>
        </TabsTrigger>
        <TabsTrigger value="openai" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🤖 OpenAI</span>
          <span className="sm:hidden">🤖 AI</span>
        </TabsTrigger>
        <TabsTrigger value="engine" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">⚙️ Engine Control</span>
          <span className="sm:hidden">⚙️ Engine</span>
        </TabsTrigger>
        <TabsTrigger value="api-chain" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🚀 API Chain</span>
          <span className="sm:hidden">🚀 API</span>
        </TabsTrigger>
        <TabsTrigger value="loops" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🔄 Core Loops</span>
          <span className="sm:hidden">🔄 Loops</span>
        </TabsTrigger>
        <TabsTrigger value="loop-engine" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">⚡ Loop Engine</span>
          <span className="sm:hidden">⚡ L.Engine</span>
        </TabsTrigger>
        <TabsTrigger value="business" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">💰 Business Paths</span>
          <span className="sm:hidden">💰 Business</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="trillion-path">
        <TrillionPathDashboard />
      </TabsContent>

      <TabsContent value="auto-deploy">
        <AutoDeployDashboard />
      </TabsContent>

      <TabsContent value="enhanced-agi">
        <EnhancedAGIEngine />
      </TabsContent>

      <TabsContent value="openai">
        <OpenAIIntegration />
      </TabsContent>

      <TabsContent value="engine" className="space-y-6">
        <EngineConnection 
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />

        {engineState && (
          <>
            <EngineMetrics engineState={engineState} />
            <EngineAdvancedMetrics engineState={engineState} />
          </>
        )}

        <TaskCommandCenter 
          taskName={taskName}
          setTaskName={setTaskName}
          triggerTask={triggerTask}
        />
      </TabsContent>

      <TabsContent value="api-chain">
        <APIChain />
      </TabsContent>

      <TabsContent value="loops" className="space-y-6">
        {engineState && (
          <>
            <LoopsStatus engineState={engineState} />
            <LoopsPerformance engineState={engineState} />
          </>
        )}
      </TabsContent>

      <TabsContent value="loop-engine">
        <LoopEngine engineState={engineState} />
      </TabsContent>

      <TabsContent value="business">
        <BusinessPathsTracker engineState={engineState} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
