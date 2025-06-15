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
import { VectorMemoryPanel } from "@/components/agi/VectorMemoryPanel";
import { AGIAssessmentSummary } from "@/components/agi/AGIAssessmentSummary";
import { useVectorMemoryStats } from "@/hooks/useVectorMemoryStats";

const selfReflection = new AGISelfReflectionManager();

const FunctionalAGIPage: React.FC = () => {
  const [state, setState] = useState(unifiedAGI.getState());
  const [goalInput, setGoalInput] = useState("");
  const [pluginName, setPluginName] = useState("");
  const [pluginDesc, setPluginDesc] = useState("");
  const [pluginCode, setPluginCode] = useState("");
  const [pluginError, setPluginError] = useState<string | null>(null);

  // Use the new custom hook for vector stats
  const vectorStats = useVectorMemoryStats("core-agi-agent");

  const [selfReflections, setSelfReflections] = useState<string[]>([]);
  const [worldSyncStatus, setWorldSyncStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");

  // --- Enhanced assessment with new capabilities
  const [systemAssessment, setSystemAssessment] = useState(() =>
    AGISystemAssessment.assess({
      ...unifiedAGI.getState(),
      vectorStats,
      selfReflectionHistory: selfReflections,
      advancedCapabilities: unifiedAGI.getState().advancedCapabilities
    })
  );

  useEffect(() => {
    const update = () => {
      setState(unifiedAGI.getState());

      const insight = selfReflection.analyzeAndReflect(unifiedAGI.getState());
      const reflections = [insight, ...selfReflections].slice(0, 5);
      setSelfReflections(reflections);

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
    // eslint-disable-next-line
  }, [selfReflections, vectorStats.longTerm]); // Depend only on data we update here

  useEffect(() => {
    if (state.running) {
      setWorldSyncStatus("syncing");
      (async () => {
        try {
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

  // Calculate the AGI completion percentage
  const AGI_COMPLETION_PERCENT =
    Math.min(
      100,
      systemAssessment.overallPercent +
        ((vectorStats.total ?? 0) > 0 ? Math.floor(vectorStats.total / 5) : 0)
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* Enhanced Assessment Panel */}
      <AGISystemAssessmentPanel assessment={systemAssessment} />

      {/* Enhanced Main Panel */}
      <Card className="bg-slate-900/80 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🧠 Advanced Functional AGI Core
            <span className="ml-auto text-green-400 text-sm">{AGI_COMPLETION_PERCENT}% Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {worldSyncStatus === "syncing" && (
            <div className="mb-2 text-blue-200">🌎 Syncing up with the current world state...</div>
          )}

          {state.lastRecalledWorldState && state.lastRecalledWorldState.length > 0 && (
            <div className="mb-4">
              <div className="font-bold text-cyan-400 mb-1">🌐 World Awareness:</div>
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

          {state.advancedCapabilities && (
            <div className="mb-4 p-3 bg-purple-900/30 rounded border border-purple-700">
              <div className="font-bold text-purple-300 mb-2">🚀 Advanced AGI Capabilities</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-purple-200">
                  🔗 System Connections: <span className="font-bold text-white">{state.advancedCapabilities.systemConnections}</span>
                </div>
                <div className="text-purple-200">
                  🤖 AGI Instances: <span className="font-bold text-white">{state.advancedCapabilities.agiInstances}</span>
                </div>
                <div className="text-purple-200">
                  🧠 Memory Clusters: <span className="font-bold text-white">{state.advancedCapabilities.memoryConsolidation}</span>
                </div>
                <div className="text-purple-200">
                  🔧 Mod Proposals: <span className="font-bold text-white">{state.advancedCapabilities.modificationProposals}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-300">
                🛡️ Safety Locks: <span className="font-bold text-green-300">{state.advancedCapabilities.safetyStatus?.locksActive || 0} Active</span>
                {state.advancedCapabilities.safetyStatus?.highRiskProposals > 0 && (
                  <span className="ml-2 text-red-300">⚠️ {state.advancedCapabilities.safetyStatus.highRiskProposals} High-Risk</span>
                )}
              </div>
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
      {/* VECTOR MEMORY PANEL */}
      <VectorMemoryPanel
        stats={{
          shortTerm: vectorStats.shortTerm,
          episodic: vectorStats.episodic,
          longTerm: vectorStats.longTerm
        }}
        total={vectorStats.total}
      />
      {/* AGI SYSTEM ASSESSMENT SUMMARY */}
      <AGIAssessmentSummary assessment={systemAssessment} />
    </div>
  );
};

export default FunctionalAGIPage;
