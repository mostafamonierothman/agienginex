
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ControlPanelProps {
  isAGIActive: boolean;
  isLoading: boolean;
  toggleAGI: () => void;
  runIntelligentAgent: () => void;
  deployEmergencySquad: () => void;
}

const ControlPanel = ({ 
  isAGIActive, 
  isLoading, 
  toggleAGI, 
  runIntelligentAgent, 
  deployEmergencySquad 
}: ControlPanelProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
      <Button 
        onClick={toggleAGI}
        className={`px-4 md:px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 ${
          isAGIActive 
            ? 'bg-red-600 hover:bg-red-700 border border-red-500/50' 
            : 'bg-green-600 hover:bg-green-700 border border-green-500/50'
        }`}
      >
        {isAGIActive ? '🛑 Stop AGI Autonomy' : '▶️ Start AGI Autonomy'}
      </Button>

      <Button 
        onClick={runIntelligentAgent}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold border border-blue-500/50 shadow-lg transition-all duration-200 disabled:opacity-50"
      >
        <Zap className="w-4 h-4 mr-2" />
        {isLoading ? 'Processing...' : 'Run Intelligent Agent'}
      </Button>

      <Button 
        onClick={deployEmergencySquad}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-3 rounded-lg font-semibold border border-purple-500/50 shadow-lg transition-all duration-200"
      >
        🚀 Deploy AGI Emergency Squad (50 Agents)
      </Button>
    </div>
  );
};

export default ControlPanel;
