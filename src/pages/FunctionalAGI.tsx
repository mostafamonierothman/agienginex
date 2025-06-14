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
import { AGISystemAssessment } from "@/agi/AGISystemAssessment";
import { AGISystemAssessmentPanel } from "@/components/agi/AGISystemAssessmentPanel";

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
  const [worldSyncStatus, setWorldSyncStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  // --- NEW: Assessment State
  const [systemAssessment, setSystemAssessment] = useState(() =>
    AGISystemAssessment.assess({ ...unifiedAGI.getState(), vectorStats, selfReflectionHistory: selfReflections })
  );

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
      const reflections = [insight, ...selfReflections].slice(0, 5);
      setSelfReflections(reflections);

      // --- Update assessment
      setSystemAssessment(
        AGISystemAssessment.assess({
          ...unifiedAGI.getState(),
          vectorStats,
          selfReflectionHistory: reflections,
        })
      );
    };
    unifiedAGI.subscribe(update);
    return () => unifiedAGI.unsubscribe(update);
  }, [selfReflections, vectorStats]);

  // --- NEW: World sync effect (on start/reset) ---
  useEffect(() => {
    if (state.running) {
      setWorldSyncStatus("syncing");
      (async () => {
        try {
          // This triggers UnifiedAGICore.absorbWorldState automatically; here for user feedback.
          setWorldSyncStatus("done");
        } catch {
          setWorldSyncStatus("error");
        }
      })();
    }
  }, [state.running]);

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

  // Use new dynamically computed percent:
  const AGI_COMPLETION_PERCENT = systemAssessment.overallPercent;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* NEW: Assessment Panel */}
      <AGISystemAssessmentPanel assessment={systemAssessment} />
      {/* NEW: Show world sync status and latest world memories */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🌐 Functional AGI Core
            <span className="ml-auto text-green-400 text-sm">{AGI_COMPLETION_PERCENT}% Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {worldSyncStatus === "syncing" && (
            <div className="mb-2 text-blue-200">🌎 Syncing up with the current world state...</div>
          )}
          {state.lastRecalledWorldState && state.lastRecalledWorldState.length > 0 && (
            <div className="mb-2">
              <div className="font-bold text-cyan-400 mb-1">World Awareness:</div>
              <ul className="list-disc ml-6 text-cyan-200 text-xs">
                {state.lastRecalledWorldState.map(
                  (mem: any, i: number) => (
                    <li key={mem.id || i}>
                      <span className="font-semibold">{mem.content}</span>
                      <span className="ml-2 text-gray-500">{mem.metadata?.timestamp ? new Date(mem.metadata.timestamp).toLocaleString() : ""}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          <AGIControlsPanel running={state.running} />
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
