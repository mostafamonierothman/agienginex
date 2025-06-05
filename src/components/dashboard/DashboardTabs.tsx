import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessPathsTracker from '../BusinessPathsTracker';
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
import MultiAgentDashboard from '../engine/MultiAgentDashboard';
import AGITestButton from '../engine/multi-agent/AGITestButton';
import AGIDashboard from '../engine/AGIDashboard';

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

interface DashboardTabsProps {
  engineState: EngineState | null;
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
    <Tabs defaultValue="agi-dashboard" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-10 bg-slate-800 h-auto gap-1 p-1">
        <TabsTrigger value="agi-dashboard" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🎯 AGI Dashboard</span>
          <span className="sm:hidden">🎯 AGI</span>
        </TabsTrigger>
        <TabsTrigger value="agi-test" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🚀 AGI Test</span>
          <span className="sm:hidden">🚀 Test</span>
        </TabsTrigger>
        <TabsTrigger value="enhanced-agi" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🧠 Enhanced AGI</span>
          <span className="sm:hidden">🧠 AGI</span>
        </TabsTrigger>
        <TabsTrigger value="multi-agent-v2" className="text-white text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
          <span className="hidden sm:inline">🤖 Multi-Agent V2</span>
          <span className="sm:hidden">🤖 V2</span>
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

      <TabsContent value="agi-dashboard">
        <AGIDashboard />
      </TabsContent>

      <TabsContent value="agi-test">
        <AGITestButton />
      </TabsContent>

      <TabsContent value="enhanced-agi">
        <EnhancedAGIEngine />
      </TabsContent>

      <TabsContent value="multi-agent-v2">
        <MultiAgentDashboard />
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
