
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface LoopsStatusProps {
  engineState: EngineState;
}

const LoopsStatus = ({ engineState }: LoopsStatusProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">🔄 Seven Core Loops Status</CardTitle>
        <p className="text-gray-400">Compounding Intelligence Architecture</p>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default LoopsStatus;
