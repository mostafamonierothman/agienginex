
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useAGIEngine } from '@/hooks/useAGIEngine';
import AGIControls from './agi/AGIControls';
import AGIStatus from './agi/AGIStatus';
import AGIMetrics from './agi/AGIMetrics';
import AGIDecisions from './agi/AGIDecisions';

const EnhancedAGIEngine = () => {
  const { agiState, isRunning, startAGI, stopAGI, resetAGI } = useAGIEngine();

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                🧠 Enhanced AGI Engine
              </CardTitle>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Autonomous AI with learning, adaptation, and emergent behaviors
              </p>
            </div>
            <AGIControls 
              isRunning={isRunning}
              onStart={startAGI}
              onStop={stopAGI}
              onReset={resetAGI}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <AGIStatus isRunning={isRunning} agiState={agiState} />
          <AGIMetrics agiState={agiState} />
          <AGIDecisions agiState={agiState} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAGIEngine;
