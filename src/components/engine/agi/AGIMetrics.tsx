
import React from 'react';
import { AGIState } from '@/hooks/useAGIEngine';

interface AGIMetricsProps {
  agiState: AGIState;
}

const AGIMetrics = ({ agiState }: AGIMetricsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      <div className="bg-slate-700/50 p-3 md:p-4 rounded">
        <div className="text-gray-400 text-xs md:text-sm">Intelligence</div>
        <div className="text-white font-bold text-lg md:text-xl">{agiState.intelligence.toFixed(1)}%</div>
        <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${agiState.intelligence}%` }}
          />
        </div>
      </div>
      <div className="bg-slate-700/50 p-3 md:p-4 rounded">
        <div className="text-gray-400 text-xs md:text-sm">Efficiency</div>
        <div className="text-white font-bold text-lg md:text-xl">{agiState.efficiency.toFixed(1)}%</div>
        <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${agiState.efficiency}%` }}
          />
        </div>
      </div>
      <div className="bg-slate-700/50 p-3 md:p-4 rounded">
        <div className="text-gray-400 text-xs md:text-sm">Autonomy</div>
        <div className="text-white font-bold text-lg md:text-xl">{agiState.autonomyLevel.toFixed(1)}%</div>
        <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${agiState.autonomyLevel}%` }}
          />
        </div>
      </div>
      <div className="bg-slate-700/50 p-3 md:p-4 rounded">
        <div className="text-gray-400 text-xs md:text-sm">Revenue</div>
        <div className="text-white font-bold text-lg md:text-xl">${agiState.revenue.toFixed(0)}</div>
        <div className="text-green-400 text-xs md:text-sm">+{(agiState.autonomyLevel * 50).toFixed(0)}/cycle</div>
      </div>
    </div>
  );
};

export default AGIMetrics;
