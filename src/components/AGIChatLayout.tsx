import React, { useState, useRef, useEffect } from "react";
import { agiEngineX } from "@/services/AGIengineXService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAGIBusinessMetrics } from "@/hooks/useAGIBusinessMetrics";
import { Bot, User2 } from "lucide-react";
import AGIRoadmapHelper from "./AGIRoadmapHelper";

// --- Import AGI AUTO-START modules ---
import { unifiedAGI } from "@/agi/UnifiedAGICore";
import { autonomousLoop } from "@/loops/AutonomousLoop";

// Add: poll real AGI system state for progress & feedback
import { sendAGIChatCommand, fetchLiveAGIState } from "@/services/AGIChatOrchestrator";

export const AGIChatLayout: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      role: "agi",
      content:
        "🤖 Hello! I'm AGIengineX - your advanced AI business executive. All actions in this chat reflect real business execution.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- AUTOSTART FULL AGI AUTONOMY ON CHAT PAGE LOAD ---
  useEffect(() => {
    unifiedAGI.start();
    autonomousLoop.start();
    // Optionally: provide logging in dev tools
    // console.log("AGI systems auto-started on chat layout mount");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { metrics, loading: metricsLoading } = useAGIBusinessMetrics("agi_metrics");

  const [agiInfo, setAgiInfo] = useState<any>(null);
  const [optimisticAutonomy, setOptimisticAutonomy] = useState(72);

  // Poll backend for live AGI state every 10s
  useEffect(() => {
    let timer: NodeJS.Timeout;
    async function poll() {
      const state = await fetchLiveAGIState();
      if (state?.success !== false) setAgiInfo(state);
      timer = setTimeout(poll, 10000);
    }
    poll();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Derive autonomy percent from backend info if present
  const autonomyPercent = agiInfo?.autonomy_percent
    || agiInfo?.agiProgress
    || (agiInfo?.metrics && agiInfo.metrics.realAgentSuccessRate)
    || optimisticAutonomy;

  const breakthroughReached = autonomyPercent >= 95;
  const nearBreakthrough = autonomyPercent >= 90 && autonomyPercent < 95;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Route ALL chat via backend AGI orchestrator (edge function) for real execution
      const rawResult = await sendAGIChatCommand(input, { type: "chat" });
      const responseText = rawResult?.response
        || rawResult?.output
        || rawResult?.message
        || rawResult?.agent_used
        || "⚠️ No AGI response";

      setMessages((prev) => [...prev, { role: "agi", content: responseText }]);
      // Optimistically update autonomy if we got a result
      if (rawResult?.autonomy_percent > 0) setOptimisticAutonomy(rawResult.autonomy_percent);
      // Optionally, poll state now for more up-to-date info:
      fetchLiveAGIState().then((state) => {
        if (state?.success !== false) setAgiInfo(state);
      });
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "agi", content: "⚠️ No AGI response" },
      ]);
    }
    setLoading(false);
  };

  // Responsive, phone/desktop friendly chat UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 via-purple-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 p-1">
      {/* Roadmap helper only shows on chat route and is small/non-intrusive for admins */}
      <AGIRoadmapHelper />
      <div className="w-full max-w-md md:max-w-lg shadow-xl border border-slate-200 bg-white dark:bg-slate-800 rounded-xl flex flex-col min-h-[75dvh]">
        {/* --- ONLY CHAT -- removed assessment panel here --- */}
        <div className="flex items-center px-4 pt-6 pb-2 sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
          <Bot className="mr-2 h-7 w-7 text-purple-600" />
          <h1 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">
            AGIengineX Chat
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-2 pt-1 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg px-3 py-2 max-w-[80vw] md:max-w-[80%] shadow ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-100 text-gray-900 dark:bg-slate-700 dark:text-white rounded-bl-none"
                }`}
              >
                <div className="flex items-center gap-2">
                  {m.role === "agi" && (
                    <Bot className="inline h-5 w-5 text-purple-500 mr-1" />
                  )}
                  {m.role === "user" && (
                    <User2 className="inline h-5 w-5 text-gray-200 mr-1" />
                  )}
                  <span className="block text-sm whitespace-pre-wrap">{m.content}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="flex gap-2 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-b-xl"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            type="text"
            className="flex-1 text-base px-3 py-2 rounded-md shadow border border-slate-200 dark:border-slate-700"
            value={input}
            disabled={loading}
            placeholder={
              loading ? "Sending…" : "Type a business request or instruction..."
            }
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && handleSend()}
            autoFocus
          />
          <Button
            disabled={loading || !input.trim()}
            type="submit"
            className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white px-4 rounded-lg shadow hover:from-purple-600"
          >
            {loading ? "..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
};
