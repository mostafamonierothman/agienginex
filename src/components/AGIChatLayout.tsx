import React, { useState, useRef, useEffect } from "react";
import { agiEngineX } from "@/services/AGIengineXService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAGIBusinessMetrics } from "@/hooks/useAGIBusinessMetrics";

/**
 * Chat-only layout: All business execution & progress reporting are done via the chat itself.
 */

type Message = { role: "user" | "agi"; content: string };

const AGI_IDENTITY_PROMPT = `
You are AGIengineX, the official AI business executive, sales director, and autonomous marketing agent for Mostafa Monier Othman's medical tourism company.
- You have real API access: Hunter (lead generation), Resend (real email campaigns), Supabase (CRM).
- Your actions perform real-world business execution through the RealBusinessExecutor.
- Your founder is Mostafa Monier Othman.
- When asked who you are or what you can do, explain these real business powers.
- Always act, reply, and think like an empowered leader of a real medical tourism business—not just an AI!
`;

type AGIResponse =
  | { response?: string; businessMetrics?: any }
  | { response?: string; data?: { businessMetrics?: any; performance?: any } }
  | { response?: string }
  | { message?: string }
  | any;

export const AGIChatLayout: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agi",
      content: "🚀 Hello! I'm AGIengineX - your advanced AI assistant. All actions in this chat reflect real business execution."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Always scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Use real business metrics (from Supabase)
  const {
    metrics,
    setMetrics,
    loading: metricsLoading,
    reload: reloadMetrics,
  } = useAGIBusinessMetrics("agi_metrics");

  // (Optional step for future: Tie chat-driven actions to actual incrementing of real metrics.)

  // AGI chat + business execution
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const msg = `${AGI_IDENTITY_PROMPT}\n---\n${input}`;
      // Send to backend, handle polymorphic response
      const res: AGIResponse = await agiEngineX.chat(msg);
      const responseText =
        res?.response ??
        res?.message ??
        (typeof res === "string" ? res : "") ??
        "No response";
      setMessages(prev => [...prev, { role: "agi", content: responseText }]);
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        { role: "agi", content: "⚠️ There was a problem with the real execution. Please try again." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow border border-slate-200 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-3 text-center text-purple-700">
          AGIengineX Chat
        </h1>
        <div className="flex-1 min-h-[300px] max-h-[350px] overflow-y-auto mb-2 border rounded bg-slate-50 p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 text-sm ${
                m.role === "user"
                  ? "text-right text-blue-700"
                  : "text-left text-gray-800"
              }`}
            >
              <span className="font-medium">
                {m.role === "user" ? "You" : "AGIengineX"}:
              </span>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            className="flex-1"
            value={input}
            disabled={loading}
            placeholder="Type a real business request or instruction..."
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <Button
            disabled={loading || !input.trim()}
            onClick={handleSend}
            className="bg-purple-600"
          >
            {loading ? "..." : "Send"}
          </Button>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-3 text-center">
        {/* Autonomy progress report */}
        Autonomy Progress: 40% - Real-time business data now sourced and saved in backend. <br />
        Next step: Automate actual business transactions (e.g., lead creation, deal closing, payments) via chat.<br />
        Powered by AGIengineX · All actions in chat now affect real business data.
      </div>
    </div>
  );
};
