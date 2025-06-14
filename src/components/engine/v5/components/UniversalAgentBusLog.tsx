import React, { useEffect, useState } from "react";
import { agentCommunicationBus } from "@/services/AgentCommunicationBus";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const UniversalAgentBusLog: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "errors" | "status">("all");

  useEffect(() => {
    // Simulate polling (since the bus is a singleton in-memory)
    const fetchBus = () => {
      try {
        const systemMsgs = agentCommunicationBus.getMessageHistory();
        setMessages(systemMsgs.slice(-20).reverse());
      } catch (e) {
        setMessages([]);
      }
    };
    fetchBus();
    const interval = setInterval(fetchBus, 2000);
    return () => clearInterval(interval);
  }, []);

  let filteredMsgs = messages;
  if (activeTab === "errors") {
    filteredMsgs = messages.filter((msg) => (msg.messageType || "").includes("error"));
  }
  if (activeTab === "status") {
    filteredMsgs = messages.filter((msg) => (msg.messageType || "").includes("status"));
  }

  return (
    <Card className="bg-slate-900/80 border-purple-800 flex flex-col h-full min-h-[230px]">
      <CardHeader className="pb-2 flex-row items-center flex justify-between gap-2">
        <CardTitle className="text-purple-300 text-md flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Agent Communication Bus (Live)
        </CardTitle>
        <div className="flex gap-2">
          <button className={`px-2 rounded text-xs ${activeTab === "all" ? "bg-purple-700 text-white" : "text-purple-200"}`} onClick={()=>setActiveTab("all")}>All</button>
          <button className={`px-2 rounded text-xs ${activeTab === "errors" ? "bg-red-700 text-white" : "text-red-200"}`} onClick={()=>setActiveTab("errors")}>Errors</button>
          <button className={`px-2 rounded text-xs ${activeTab === "status" ? "bg-cyan-700 text-white" : "text-cyan-200"}`} onClick={()=>setActiveTab("status")}>Status</button>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-purple-200 overflow-y-auto max-h-44 flex flex-col gap-1">
        {filteredMsgs.length === 0 ? (
          <div className="italic text-purple-300">No messages yet.</div>
        ) : (
          filteredMsgs.map((msg, i) => (
            <div key={i} className="rounded bg-purple-950/50 border border-purple-800 px-2 py-1 mb-1">
              <span className="font-bold">{msg.fromAgent}</span>
              <span className="mx-1">&rarr;</span>
              <span className="font-bold">{msg.toAgent}</span>
              <span className="ml-2 text-yellow-400">{msg.messageType}</span>{" "}
              <span className="ml-2">{msg.payload?.error ? `[${msg.payload.error}]` : ""}</span>
              <div className="truncate text-purple-400">{msg.payload && typeof msg.payload === "string" ? msg.payload : JSON.stringify(msg.payload)}</div>
              <div className="text-right text-xs text-gray-500">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UniversalAgentBusLog;
