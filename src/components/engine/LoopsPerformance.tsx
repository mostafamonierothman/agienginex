
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface LoopsPerformanceProps {
  engineState: EngineState;
}

const LoopsPerformance = ({ engineState }: LoopsPerformanceProps) => {
  return (
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
  );
};

export default LoopsPerformance;
