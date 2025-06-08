
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface AGIV4ControlButtonsProps {
  isV4Active: boolean;
  startV4System: () => void;
  stopV4System: () => void;
  resetV4System: () => void;
  runEmergencyProtocol: () => void;
}

const AGIV4ControlButtons = ({
  isV4Active,
  startV4System,
  stopV4System,
  resetV4System,
  runEmergencyProtocol
}: AGIV4ControlButtonsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={startV4System}
          disabled={isV4Active}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <Play className="w-4 h-4 mr-2" />
          Start V4
        </Button>
        <Button 
          onClick={stopV4System}
          disabled={!isV4Active}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
        >
          <Pause className="w-4 h-4 mr-2" />
          Stop V4
        </Button>
        <Button 
          onClick={resetV4System}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset V4
        </Button>
      </div>

      <div className="border-t border-slate-600 pt-4">
        <Button 
          onClick={runEmergencyProtocol}
          disabled={!isV4Active}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          <Zap className="w-4 w-4 mr-2" />
          🚨 Emergency Protocol
        </Button>
      </div>
    </>
  );
};

export default AGIV4ControlButtons;
