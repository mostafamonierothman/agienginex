
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

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

interface EngineMetricsProps {
  engineState: EngineState;
}

const EngineMetrics = ({ engineState }: EngineMetricsProps) => {
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

  return (
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
  );
};

export default EngineMetrics;
