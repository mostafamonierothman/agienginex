
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unifiedAGI } from "@/agi/UnifiedAGICore";

interface AGIControlsPanelProps {
  running: boolean;
}

export const AGIControlsPanel: React.FC<AGIControlsPanelProps> = ({ running }) => {
  const [goalInput, setGoalInput] = useState("");

  const handleStart = () => unifiedAGI.start();
  const handleStop = () => unifiedAGI.stop();
  const handleReset = () => unifiedAGI.reset();
  const handleSetGoal = () => {
    if (goalInput.trim()) {
      unifiedAGI.setGoal(goalInput.trim());
      setGoalInput("");
    }
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <Button onClick={handleStart} disabled={running} className="bg-green-600 hover:bg-green-700">
          Start AGI
        </Button>
        <Button onClick={handleStop} disabled={!running} variant="destructive">
          Stop AGI
        </Button>
        <Button onClick={handleReset} variant="secondary">
          Reset
        </Button>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          value={goalInput}
          placeholder="Set a new goal for AGI"
          maxLength={160}
          disabled={!running}
          className="mb-2"
          onChange={e => setGoalInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSetGoal();
          }}
        />
        <Button onClick={handleSetGoal} disabled={!goalInput.trim() || !running} className="w-full">
          ➕ Add Goal
        </Button>
      </div>
    </>
  );
};
