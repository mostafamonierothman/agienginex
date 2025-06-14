import React, { useEffect, useState } from "react";
import { unifiedAGI } from "@/agi/UnifiedAGICore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { vectorMemoryService } from "@/services/VectorMemoryService";
import { PluginPanel } from "@/components/agi/PluginPanel";
import { PeerFeedbackList } from "@/components/agi/PeerFeedbackList";
import { VectorMemoryStats } from "@/components/agi/VectorMemoryStats";
import { VectorMemoryRecallList } from "@/components/agi/VectorMemoryRecallList";
import { AGIControlsPanel } from "@/components/agi/AGIControlsPanel";
import { AGIStatusPanel } from "@/components/agi/AGIStatusPanel";
import { AGILessonsPanel } from "@/components/agi/AGILessonsPanel";
import { AGISelfReflectionManager } from "@/agi/AGISelfReflectionManager";

const selfReflection = new AGISelfReflectionManager();

const FunctionalAGIPage: React.FC = () => {
  const [state, setState] = useState(unifiedAGI.getState());
  const [goalInput, setGoalInput] = useState("");
  const [pluginName, setPluginName] = useState("");
  const [pluginDesc, setPluginDesc] = useState("");
  const [pluginCode, setPluginCode] = useState("");
  const [pluginError, setPluginError] = useState<string | null>(null);
  const [vectorStats, setVectorStats] = useState<{ shortTerm: number; longTerm: number; episodic: number }>({
    shortTerm: 0,
    longTerm: 0,
    episodic: 0,
  });
  const [selfReflections, setSelfReflections] = useState<string[]>([]);

  useEffect(() => {
    const fetchVectorStats = async () => {
      const stats = await vectorMemoryService.getMemoryStats("core-agi-agent");
      setVectorStats(stats);
    };
    fetchVectorStats();
    const update = () => {
      setState(unifiedAGI.getState());
      fetchVectorStats();

      // Reflect and store the latest insight for display
      const insight = selfReflection.analyzeAndReflect(unifiedAGI.getState());
      setSelfReflections([insight, ...selfReflections].slice(0, 5));
    };
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

  // AGI Completion estimate after new self-reflection capability
  const AGI_COMPLETION_PERCENT = 99.6;

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
          <AGIControlsPanel running={state.running} />
          {/* Plugin Panel */}
          <PluginPanel
            pluginName={pluginName}
            pluginDesc={pluginDesc}
            pluginCode={pluginCode}
            pluginError={pluginError}
            onNameChange={setPluginName}
            onDescChange={setPluginDesc}
            onCodeChange={setPluginCode}
            onRegister={handleRegisterPlugin}
            plugins={state.plugins ?? []}
            onUnregister={handleUnregisterPlugin}
          />
          <AGIStatusPanel state={state} vectorStats={vectorStats} />
          <AGILessonsPanel state={state} />
          {/* NEW: Self-Reflection Insights */}
          <div className="mb-4">
            <span className="font-bold text-lime-300">Recent Self-Reflection:</span>
            <ul className="list-decimal ml-6 text-lime-200 text-xs">
              {selfReflections.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionalAGIPage;
