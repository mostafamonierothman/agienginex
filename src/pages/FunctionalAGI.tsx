
import React, { useEffect, useState } from "react";
import { unifiedAGI } from "@/agi/UnifiedAGICore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FunctionalAGIPage: React.FC = () => {
  const [state, setState] = useState(unifiedAGI.getState());
  const [goalInput, setGoalInput] = useState("");
  const [pluginName, setPluginName] = useState("");
  const [pluginDesc, setPluginDesc] = useState("");
  const [pluginCode, setPluginCode] = useState("");
  const [pluginError, setPluginError] = useState<string | null>(null);

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

  const handleRegisterPlugin = async () => {
    setPluginError(null);
    if (!pluginName.trim() || !pluginDesc.trim() || !pluginCode.trim()) {
      setPluginError("All plugin fields are required.");
      return;
    }
    try {
      // The function body should be JS code that returns a string, 
      // receives ctx: {goal, thoughts, memory}.
      // We'll use new Function for demo: (ctx) => { ... }
      // Security note: In real apps, never eval untrusted code!
      // For demonstration only.
      // Wrap code with 'async (ctx) => { ... }'
      const asyncBody = `return (async (ctx) => {${pluginCode}\n})`;
      // eslint-disable-next-line no-new-func
      const createFunc = new Function(asyncBody);
      const exec = await createFunc();
      unifiedAGI.registerPlugin({
        name: pluginName.trim(),
        description: pluginDesc.trim(),
        execute: exec,
      });
      setPluginName("");
      setPluginDesc("");
      setPluginCode("");
    } catch (e: any) {
      setPluginError("Failed to create plugin: " + (e.message || e));
    }
  };

  const handleUnregisterPlugin = (name: string) => {
    unifiedAGI.unregisterPlugin(name);
  };

  // AGI Completion estimate after this step
  const AGI_COMPLETION_PERCENT = 65;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🌐 Functional AGI Core
            <span className="ml-auto text-green-400 text-sm">{AGI_COMPLETION_PERCENT}% Complete</span>
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

          {/* === Plugin Registration UI === */}
          <div className="mb-6 bg-slate-800 p-4 rounded">
            <div className="font-bold text-blue-300 mb-2">Register Action Plugin</div>
            <div className="mb-2 flex flex-col gap-2">
              <Input placeholder="Plugin Name" value={pluginName} onChange={e => setPluginName(e.target.value)} />
              <Input placeholder="Short Description" value={pluginDesc} onChange={e => setPluginDesc(e.target.value)} />
              <Textarea
                placeholder={`Async plugin code. Example:\nreturn \`Echo: \${ctx.goal} -- \${ctx.thoughts}\`;`}
                value={pluginCode}
                onChange={e => setPluginCode(e.target.value)}
                className="font-mono"
                rows={4}
              />
              <Button onClick={handleRegisterPlugin} className="bg-blue-600 hover:bg-blue-700">
                ➕ Register Plugin
              </Button>
              {pluginError && <div className="text-red-400 text-xs">{pluginError}</div>}
            </div>
            <div className="mt-3">
              <span className="text-cyan-400 font-semibold">Active Plugins:</span>
              {state.plugins && state.plugins.length > 0 ? (
                <ul className="ml-5 mt-2 text-xs">
                  {state.plugins.map((p: string) => (
                    <li key={p} className="flex items-center gap-2 mb-1">
                      <span className="text-white">{p}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="py-0.5 px-2 text-xs"
                        onClick={() => handleUnregisterPlugin(p)}
                      >
                        Unregister
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-400">No plugins registered.</span>
              )}
            </div>
          </div>

          {/* === AGI Status === */}
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
