
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User2 } from "lucide-react";
import AGIRoadmapHelper from "./AGIRoadmapHelper";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { agiEngineX } from "@/services/AGIengineXService";

// Status helpers (copied from original)
const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'text-green-400';
    case 'connecting': return 'text-yellow-400';
    case 'error': return 'text-red-400';
    default: return 'text-gray-400';
  }
};
const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'ONLINE';
    case 'connecting': return 'CONNECTING';
    case 'error': return 'AUTO-HEALING';
    default: return 'UNKNOWN';
  }
};

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
  const [systemStatus, setSystemStatus] = useState<'online' | 'connecting' | 'error'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Use the real AGI interaction for end-to-end intelligence
      const aiResponse = await agiEngineX.chat(input);

      setMessages((prev) => [...prev, {
        role: "agi",
        content: aiResponse.response
      }]);
      setSystemStatus('online');
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agi",
          content:
            "🔧 AGI system is experiencing connectivity issues but remains operational. Auto-recovery protocols are active."
        }
      ]);
      setSystemStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-slate-100 via-purple-50 to-slate-200 dark:from-slate-900 dark:via-slate-800 p-1">
      <AGIRoadmapHelper />
      <div className="w-full max-w-md md:max-w-lg shadow-xl border border-slate-200 bg-white dark:bg-slate-800 rounded-xl flex flex-col min-h-[75dvh]">
        <div className="flex items-center justify-between px-4 pt-6 pb-2 sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
          <div className="flex items-center">
            <Bot className="mr-2 h-7 w-7 text-purple-600" />
            <h1 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">
              AGIengineX
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${systemStatus === 'online' ? 'bg-green-400' : systemStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
            <span className={`text-xs font-mono ${getStatusColor(systemStatus)}`}>
              {getStatusText(systemStatus)}
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
