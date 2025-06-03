
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

interface EngineAdvancedMetricsProps {
  engineState: EngineState;
}

const EngineAdvancedMetrics = ({ engineState }: EngineAdvancedMetricsProps) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const totalRevenue = Object.values(engineState.current_revenue).reduce((sum, val) => sum + val, 0);

  return (
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
  );
};

export default EngineAdvancedMetrics;
