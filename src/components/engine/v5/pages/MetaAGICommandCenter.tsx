
import React, { useEffect, useState } from "react";
import { agentRegistry } from "@/config/AgentRegistry";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Bot, BarChart, RefreshCw, Info, ArrowUpRightFromCircle, Upload, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import UniversalAgentBusLog from "../components/UniversalAgentBusLog";
import MetaFeedbackPanel from "../components/MetaFeedbackPanel";

// Helper fetch for meta-agent recommendations
const fetchMetaInsights = async () => {
  let metaText = "Thinking...";
  try {
    const { data, error } = await supabase
      .from("supervisor_queue")
      .select("output, agent_name, timestamp")
      .order("timestamp", { ascending: false })
      .limit(10);
    if (error) throw error;
    if (data && data.length > 0) {
      metaText = data
        .filter((d) => d.agent_name && d.output && (d.agent_name.includes("meta_agent") || d.agent_name.includes("nexus_ai") || d.agent_name.includes("supervisor")))
        .map((d) => `[${d.agent_name}] ${d.output}`)
        .join("\n\n") || metaText;
    }
  } catch (e) {
    metaText = "No meta-agent output found.";
  }
  return metaText;
};

const MetaAGICommandCenter = () => {
  const [agents, setAgents] = useState(agentRegistry.getAllAgents());
  const [metaInsights, setMetaInsights] = useState("Thinking...");
  const [loading, setLoading] = useState(false);

  // NEW: Track registry update state for reloads
  const [registryUpdated, setRegistryUpdated] = useState(Date.now());

  const refreshAgents = () => {
    setAgents(agentRegistry.getAllAgents());
  };

  const refreshMeta = async () => {
    setLoading(true);
    setMetaInsights(await fetchMetaInsights());
    setLoading(false);
  };

  // Dynamic AgentRegistry Reload (simulate hot-reload)
  const reloadDynamicAgentRegistry = () => {
    // In future, could scan and re-import new agents; here just trigger update & toast
    agentRegistry.updateSystemStatus();
    setRegistryUpdated(Date.now());
    setAgents(agentRegistry.getAllAgents());
    toast({
      title: "Agent Registry Reloaded",
      description: "All registered agents have been refreshed for new capabilities.",
    });
  };

  // Refresh agents and meta-insights periodically
  useEffect(() => {
    refreshMeta();
    const interval = setInterval(() => {
      refreshAgents();
      refreshMeta();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Trigger next agent (demo: run a random agent with dummy input)
  const handleRunRandomAgent = async () => {
    setLoading(true);
    try {
      const fakeContext = { input: { prompt: "Advance AGI synergistically!" } };
      const response = await agentRegistry.runRandomAgent(fakeContext);
      toast({
        title: response.success ? "Agent Executed" : "Agent Error",
        description: response.message,
        variant: response.success ? "default" : "destructive",
      });
      refreshMeta();
    } catch (e) {
      toast({ title: "Error", description: (e as any)?.message || "Unknown error", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-900/60 to-purple-900/80 border-cyan-400/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <BarChart className="h-7 w-7 text-cyan-400" />
            Meta AGI Command Center
          </CardTitle>
          <CardDescription className="text-gray-300">
            View integrated AGI system live status, meta-recommendations, universal agent bus, and participate in evolution: registry reload, feedback loop, workflows—all in one console.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <Button variant="default" onClick={refreshAgents} className="bg-cyan-700 hover:bg-cyan-800 text-white">
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh Agents
            </Button>
            <Button variant="outline" onClick={refreshMeta} className="border-cyan-400 text-cyan-300">
              <Zap className="w-4 h-4 mr-1" /> Refresh Insights
            </Button>
            <Button variant="secondary" disabled={loading} onClick={handleRunRandomAgent} className="ml-auto">
              <Brain className="w-4 h-4 mr-1" /> Trigger Next Agent
            </Button>
            <Button variant="outline" onClick={reloadDynamicAgentRegistry} className="border-green-400 text-green-300">
              <Upload className="w-4 h-4 mr-1" /> Reload Agent Registry
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AGI Agents */}
        <Card className="bg-slate-800/50 border-slate-700 col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center gap-2">
              <Bot className="h-5 w-5 text-cyan-300" /> Registered Agents
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              {agents.length} agents currently loaded and ready for action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map((agent) => (
                <div key={agent.name} className="flex flex-col p-3 bg-slate-900/70 rounded border border-cyan-900/30 mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`bg-cyan-800 text-cyan-200 mr-2`}>{agent.category}</Badge>
                    <span className="font-semibold text-white">{agent.name}</span>
                  </div>
                  <span className="text-xs text-gray-300 mb-1">{agent.description}</span>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span>Status: <span className="text-green-400">{agent.status}</span></span>
                    <span className="text-gray-400">v{agent.version}</span>
                  </div>
                  <div className="mt-1 text-xs text-purple-400">{agent.lastAction}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meta-AGI Intelligence */}
        <Card className="bg-slate-900/90 border-cyan-800 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300 text-xl">
              <Info className="h-5 w-5" /> AGI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-cyan-100 text-sm max-h-72 overflow-y-auto" style={{ minHeight: "170px" }}>
              {metaInsights}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Universal Agent Bus Viewer + Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UniversalAgentBusLog key={registryUpdated} />
        <MetaFeedbackPanel />
      </div>

      {/* Future: AGI Feedback/Experiments area */}
      <Card className="bg-cyan-950/50 border-cyan-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-50 text-lg">
            <ArrowUpRightFromCircle className="h-5 w-5" /> Experimental Evolution (Coming Soon)
          </CardTitle>
          <CardDescription className="text-cyan-200">
            AGIengineX will soon propose, test, and implement core system upgrades (cognitive swarms, registry rewrites, agent self-editing) from this Meta Command Center.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default MetaAGICommandCenter;
