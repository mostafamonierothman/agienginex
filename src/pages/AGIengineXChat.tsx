
import React, { useState, useRef, useEffect } from "react";
import { agiEngineX } from "@/services/AGIengineXService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = { role: "user" | "agi"; content: string };

const AGIengineXChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agi", content: "👋 Hello! I'm AGIengineX. Ask me anything about goals, opportunities, or strategic planning." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing connection...");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Test AGI connection on component mount
    const testConnection = async () => {
      const result = await agiEngineX.testConnection();
      setConnectionStatus(result.message);
    };
    
    testConnection();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    
    try {
      console.log("💬 Sending message to AGI:", input);
      const res = await agiEngineX.chat(input);
      console.log("🤖 AGI response:", res);
      
      setMessages(prev => [
        ...prev,
        { role: "agi", content: res.response }
      ]);
    } catch (e) {
      console.error("❌ Chat error:", e);
      setMessages(prev => [
        ...prev,
        { role: "agi", content: "⚠️ Sorry, I'm having trouble connecting. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus("Testing...");
    const result = await agiEngineX.testConnection();
    setConnectionStatus(result.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow border border-slate-200 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-3 text-center text-purple-700">
          AGIengineX Chat
        </h1>
        
        {/* Connection Status */}
        <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex justify-between items-center">
            <span>Status: {connectionStatus}</span>
            <Button 
              onClick={handleTestConnection} 
              variant="outline" 
              size="sm"
              className="text-xs px-2 py-1 h-6"
            >
              Test
            </Button>
          </div>
        </div>
        
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
              </span>{" "}
              {m.content}
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
            placeholder="Ask about goals, opportunities, strategy..."
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
        Powered by AGIengineX · Advanced AGI with autonomous agents
        <br />
        Features: Strategic Planning • Opportunity Detection • Self-Reflection
      </div>
    </div>
  );
};

export default AGIengineXChat;
