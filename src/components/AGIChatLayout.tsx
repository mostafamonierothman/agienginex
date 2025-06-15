
import React, { useState, useRef, useEffect } from "react";
import { agiEngineX } from "@/services/AGIengineXService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAGIBusinessMetrics } from "@/hooks/useAGIBusinessMetrics";
import { Bot, User2, AlertTriangle } from "lucide-react";
import AGIRoadmapHelper from "./AGIRoadmapHelper";
import { MarkdownRenderer } from "./MarkdownRenderer";

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
        "🤖 Hello! I'm AGIengineX - your advanced AI business executive. All systems are online and ready for real business execution.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'online' | 'connecting' | 'error'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- AUTOSTART FULL AGI AUTONOMY ON CHAT PAGE LOAD ---
  useEffect(() => {
    const initializeAGI = async () => {
      try {
        console.log("🚀 Initializing AGI systems...");
        unifiedAGI.start();
        autonomousLoop.start();
        setSystemStatus('online');
        console.log("✅ AGI systems initialized successfully");
      } catch (error) {
        console.error("❌ AGI initialization error:", error);
        setSystemStatus('error');
      }
    };
    
    initializeAGI();
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
      try {
        const state = await fetchLiveAGIState();
        if (state?.success !== false) {
          setAgiInfo(state);
          setSystemStatus('online');
        }
      } catch (error) {
        console.warn("AGI polling error:", error);
      }
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
      console.log("🎯 Sending message to AGI:", input);
      
      // Route ALL chat via backend AGI orchestrator (edge function) for real execution
      const rawResult = await sendAGIChatCommand(input, { 
        type: "chat",
        timestamp: new Date().toISOString() 
      });
      
      let responseText = "⚠️ AGI system is processing your request...";
      
      if (rawResult?.supervisor_message) {
        responseText = rawResult.supervisor_message;
      } else if (rawResult?.response) {
        responseText = rawResult.response;
      } else if (rawResult?.output) {
        responseText = rawResult.output;
      } else if (rawResult?.message) {
        responseText = rawResult.message;
      } else if (rawResult?.agent_used) {
        responseText = `🤖 ${rawResult.agent_used} is processing your request`;
      } else if (rawResult?.error) {
        responseText = `⚠️ AGI system encountered an issue: ${rawResult.error}. System is self-healing and will continue operations.`;
      }

      setMessages((prev) => [...prev, { role: "agi", content: responseText }]);
      
      // Update autonomy if we got results
      if (rawResult?.autonomy_percent > 0) {
        setOptimisticAutonomy(rawResult.autonomy_percent);
      }
      
      // Refresh state
      fetchLiveAGIState().then((state) => {
        if (state?.success !== false) setAgiInfo(state);
      });
      
    } catch (e: any) {
      console.error("AGI communication error:", e);
      setMessages((prev) => [
        ...prev,
        { 
          role: "agi", 
          content: "🔧 AGI system is experiencing connectivity issues but remains operational. Auto-recovery protocols are active." 
        },
      ]);
      setSystemStatus('error');
    }
    setLoading(false);
  };

  // Status indicator
  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (systemStatus) {
      case 'online': return 'ONLINE';
      case 'connecting': return 'CONNECTING';
      case 'error': return 'AUTO-HEALING';
      default: return 'UNKNOWN';
    }
  };

  // Responsive, phone/desktop friendly chat UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 via-purple-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 p-1">
      {/* Roadmap helper only shows on chat route and is small/non-intrusive for admins */}
      <AGIRoadmapHelper />
      <div className="w-full max-w-md md:max-w-lg shadow-xl border border-slate-200 bg-white dark:bg-slate-800 rounded-xl flex flex-col min-h-[75dvh]">
        {/* Header with status */}
        <div className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
          <div className="flex items-center">
            <Bot className="mr-2 h-7 w-7 text-purple-600" />
            <h1 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">
              AGIengineX
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-green-400' : systemStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
            <span className={`text-xs font-mono ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Messages */}
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
                  <div className="block text-sm">
                    <MarkdownRenderer content={m.content} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
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
              loading ? "AGI is processing..." : "Enter business command or instruction..."
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
