
import React from 'react';
import { Target, Zap } from 'lucide-react';
import { AGIState } from '@/hooks/useAGIEngine';

interface AGIDecisionsProps {
  agiState: AGIState;
}

const AGIDecisions = ({ agiState }: AGIDecisionsProps) => {
  return (
    <>
      {/* Current Decision */}
      <div className="bg-slate-700/30 border border-slate-600 rounded p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-semibold text-sm md:text-base">Current Decision:</span>
        </div>
        <div className="text-white text-sm md:text-base">{agiState.lastDecision}</div>
      </div>

      {/* Emergent Behaviors */}
      {agiState.emergentBehaviors.length > 0 && (
        <div className="bg-slate-700/30 border border-purple-600 rounded p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-semibold text-sm md:text-base">Emergent Behaviors:</span>
          </div>
          <div className="space-y-1">
            {agiState.emergentBehaviors.map((behavior, index) => (
              <div key={index} className="text-purple-300 text-xs md:text-sm">
                • {behavior}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AGIDecisions;
