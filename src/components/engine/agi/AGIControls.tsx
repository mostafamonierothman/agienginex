
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface AGIControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const AGIControls = ({ isRunning, onStart, onStop, onReset }: AGIControlsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onStart}
        disabled={isRunning}
        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs md:text-sm"
        size="sm"
      >
        <Play className="w-3 h-3 md:w-4 md:h-4 mr-1" />
        Start AGI
      </Button>
      <Button 
        onClick={onStop}
        disabled={!isRunning}
        variant="destructive"
        size="sm"
        className="text-xs md:text-sm"
      >
        <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1" />
        Stop AGI
      </Button>
      <Button 
        onClick={onReset}
        variant="outline"
        size="sm"
        className="border-slate-600 text-gray-300 text-xs md:text-sm"
      >
        Reset
      </Button>
    </div>
  );
};

export default AGIControls;
