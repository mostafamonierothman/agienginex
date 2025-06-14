import React, { useEffect, useState } from "react";
import { unifiedAGI } from "@/agi/UnifiedAGICore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FunctionalAGIPage: React.FC = () => {
  const [state, setState] = useState(unifiedAGI.getState());
  const [goalInput, setGoalInput] = useState("");

  useEffect(() => {
    const update = () => setState(unifiedAGI.getState());
    unifiedAGI.subscribe(update);
    return () => unifiedAGI.unsubscribe(update);
  }, []);

  const handleStart = () => unifiedAGI.start();
  const handleStop = () => unifiedAGI.stop();
  const handleReset = () => unifiedAGI.reset();
  const handleSetGoal = () => {
    if (goalInput.trim()) {
      unifiedAGI.setGoal(goalInput.trim());
      setGoalInput("");
    }
  };

  // AGI Completion estimate after this step
  const AGI_COMPLETION_PERCENT = 40;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🌐 Functional AGI Core <span className="ml-auto text-green-400 text-sm">{AGI_COMPLETION_PERCENT}% Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Button onClick={handleStart} disabled={state.running} className="bg-green-600 hover:bg-green-700">
              Start AGI
            </Button>
            <Button onClick={handleStop} disabled={!state.running} variant="destructive">
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
              disabled={!state.running}
              className="mb-2"
              onChange={e => setGoalInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSetGoal();
              }}
            />
            <Button onClick={handleSetGoal} disabled={!goalInput.trim() || !state.running} className="w-full">
              ➕ Add Goal
            </Button>
          </div>
          <div className="mb-4">
            <span className="text-green-400 font-semibold">Status:</span>{" "}
            {state.running ? "AGI is running" : "Stopped"}
          </div>
          <div className="mb-4">
            <span className="text-cyan-400">Current Goal:</span>{" "}
            {state.currentGoal ? (
              <span className="text-white">{state.currentGoal}</span>
            ) : (
              <span className="text-gray-400">None (waiting for next cycle)</span>
            )}
          </div>
          <div className="mb-4">
            <span className="text-yellow-400">Memory Keys: {state.memoryKeys.length}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold text-purple-300">Completed Goals:</span>
            <ul className="list-disc ml-6 text-gray-200 text-xs">
              {state.completedGoals.slice(0, 5).map((g, i) => (
                <li key={i}>
                  <span className="font-semibold">{g.goal}</span>
                  <span className="ml-1 text-gray-400">({g.result.slice(0, 50)}...)</span>
                  <span className="ml-2 text-gray-500 text-xs">{g.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <span className="font-bold text-pink-400">Lessons Learned ({(state.lessonsLearned?.length || 0)}):</span>
            <ul className="list-decimal ml-6 text-pink-200 text-xs">
              {state.lessonsLearned && state.lessonsLearned.slice(0, 5).map((lesson: string, i: number) => (
                <li key={i}>{lesson}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-bold text-blue-400">Latest Logs:</span>
            <ul className="list-disc ml-6 text-gray-300 text-xs">
              {state.logs.slice(0, 10).map((log, idx) => (
                <li key={idx}>{log}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionalAGIPage;
