
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Target, DollarSign } from 'lucide-react';
import { AGIState } from '@/hooks/useAGIEngine';

interface AGIMetricsProps {
  agiState: AGIState;
}

const AGIMetrics = ({ agiState }: AGIMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {/* Intelligence */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-blue-400 font-semibold text-sm">Intelligence</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{agiState.intelligence.toFixed(1)}%</span>
            <span className="text-gray-400">Growing</span>
          </div>
          <Progress value={agiState.intelligence} className="h-2" />
        </div>
      </div>

      {/* Efficiency */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-semibold text-sm">Efficiency</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{agiState.efficiency.toFixed(1)}%</span>
            <span className="text-gray-400">Optimizing</span>
          </div>
          <Progress value={agiState.efficiency} className="h-2" />
        </div>
      </div>

      {/* Autonomy */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold text-sm">Autonomy</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">{agiState.autonomyLevel.toFixed(1)}%</span>
            <span className="text-gray-400">Evolving</span>
          </div>
          <Progress value={agiState.autonomyLevel} className="h-2" />
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 font-semibold text-sm">Revenue Generated</span>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-bold text-white">
            ${agiState.revenue.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            Rate: ${(agiState.autonomyLevel * 10).toFixed(0)}/cycle
          </div>
        </div>
      </div>
    </div>
  );
};

export default AGIMetrics;
