
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { sendAGIChatCommand } from "@/services/AGIChatOrchestrator";

// Phase definitions (summary from your roadmap)
const PHASES = [
  {
    key: "phase1",
    label: "Phase 1: System Activation",
    description: [
      "Execute optimization plan (populate vector memory, lead gen, system integration)",
      "Launch initial revenue campaigns"
    ],
    chatCommand:
      "Start full AGI system activation and execute the optimization plan (populate vector memories, launch medical tourism leads, test workflows, and start revenue generation)."
  },
  {
    key: "phase2",
    label: "Phase 2: Business Validation",
    description: [
      "Generate first $10K+ AGI revenue",
      "Prove 95%+ completion through metrics",
      "Document AGI innovations, start partnership pipeline"
    ],
    chatCommand:
      "Validate AGI in real business: generate first $10,000 in revenue, log partnership leads, and show 95%+ completion via core KPI metrics."
  },
  {
    key: "phase3",
    label: "Phase 3: Market Leadership",
    description: [
      "Launch AGI-as-a-Service",
      "Expand industries, begin AGI research partnerships"
    ],
    chatCommand:
      "Begin AGI-as-a-Service launch, target $1M ARR, expand to finance/manufacturing, and reach out to universities for partnership."
  },
  {
    key: "phase4",
    label: "Phase 4: Global Expansion",
    description: [
      "Scale to $10M ARR, multi-industry",
      "AGI platform for third parties, global regulatory leadership"
    ],
    chatCommand:
      "Scale AGI platform globally, target $10M revenue, support third-party AGI dev, and lead AGI regulatory frameworks and research."
  }
];

export default function AGIRoadmapHelper() {
  const location = useLocation();
  const [loadingPhase, setLoadingPhase] = useState<string | null>(null);
  const [lastTriggered, setLastTriggered] = useState<string | null>(null);

  // Only show if we're on /agi-chat route
  if (!location.pathname.startsWith("/agi-chat")) return null;

  const sendPhase = async (phase: typeof PHASES[0]) => {
    setLoadingPhase(phase.key);
    try {
      await sendAGIChatCommand(phase.chatCommand, {type: "chat"});
      toast({
        title: `Phase trigger sent to AGI: ${phase.label}`,
        description: `Chat command executed.`,
        variant: "default"
      });
      setLastTriggered(phase.key);
    } catch (e) {
      toast({
        title: "Failed to send phase trigger to AGI.",
        description: String(e)
      });
    }
    setLoadingPhase(null);
  };

  return (
    <div className="max-w-lg mx-auto mt-3 mb-2 p-4 rounded-lg shadow border bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 ">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="text-purple-500" />
        <span className="font-bold text-purple-700 dark:text-purple-300">AGI Roadmap Helper</span>
      </div>
      <div className="text-xs mb-3 text-gray-700 dark:text-gray-300">
        <span>
          <strong>Phased AGI Execution:</strong> Click any phase below to trigger its execution through chat and begin the next step on your AGI roadmap. All actions run through real backend agents and display progress here as well as in chat results.
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {PHASES.map((phase, idx) => (
          <div key={phase.key} className={`p-2 rounded border
            ${lastTriggered === phase.key ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-slate-300 dark:border-slate-800"}
          `}>
            <div className="font-semibold text-purple-700 mb-1 dark:text-purple-300">{phase.label}</div>
            <ul className="ml-3 list-disc text-xs text-gray-700 dark:text-gray-200">
              {phase.description.map((d, i) => (<li key={i}>{d}</li>))}
            </ul>
            <Button
              size="sm"
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => sendPhase(phase)}
              disabled={loadingPhase !== null}
            >
              {loadingPhase === phase.key
                ? "Activating…"
                : `Activate ${phase.label}`}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
