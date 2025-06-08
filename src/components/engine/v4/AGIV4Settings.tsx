
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AGIV4SettingsProps {
  isV4Active: boolean;
  autonomousMode: boolean;
  setAutonomousMode: (value: boolean) => void;
  learningRate: number[];
  setLearningRate: (value: number[]) => void;
  coordinationLevel: number[];
  setCoordinationLevel: (value: number[]) => void;
}

const AGIV4Settings = ({
  isV4Active,
  autonomousMode,
  setAutonomousMode,
  learningRate,
  setLearningRate,
  coordinationLevel,
  setCoordinationLevel
}: AGIV4SettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-gray-400">Autonomous Mode</label>
        <Switch 
          checked={autonomousMode}
          onCheckedChange={setAutonomousMode}
          disabled={!isV4Active}
        />
      </div>

      <div>
        <label className="text-gray-400 text-sm block mb-2">
          Learning Rate: {learningRate[0]}s intervals
        </label>
        <Slider
          value={learningRate}
          onValueChange={setLearningRate}
          max={10}
          min={1}
          step={1}
          className="w-full"
          disabled={!isV4Active}
        />
      </div>

      <div>
        <label className="text-gray-400 text-sm block mb-2">
          Coordination Level: {coordinationLevel[0]}%
        </label>
        <Slider
          value={coordinationLevel}
          onValueChange={setCoordinationLevel}
          max={100}
          min={10}
          step={5}
          className="w-full"
          disabled={!isV4Active}
        />
      </div>
    </div>
  );
};

export default AGIV4Settings;
