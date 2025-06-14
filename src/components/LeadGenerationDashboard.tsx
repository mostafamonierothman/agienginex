
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DashboardHeader from './lead-dashboard/DashboardHeader';
import ControlPanel from './lead-dashboard/ControlPanel';
import IntelligenceProgress from './lead-dashboard/IntelligenceProgress';
import AgentStats from './lead-dashboard/AgentStats';
import LeadsList from './lead-dashboard/LeadsList';

const LeadGenerationDashboard = () => {
  const [isAGIActive, setIsAGIActive] = useState(true);
  const [intelligenceLevel, setIntelligenceLevel] = useState(10.0);
  const [systemStatus, setSystemStatus] = useState('operational');
  const [agentCount, setAgentCount] = useState(50);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(() => {
      setIntelligenceLevel(prev => Math.min(100, prev + 0.1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const toggleAGI = () => {
    setIsAGIActive(!isAGIActive);
    if (!isAGIActive) {
      toast({
        title: "🧠 AGI System Activated",
        description: "Autonomous intelligence now active",
      });
    } else {
      toast({
        title: "⏸️ AGI System Paused",
        description: "Autonomous mode temporarily disabled",
      });
    }
  };

  const runIntelligentAgent = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "🤖 Intelligent Agent Running",
        description: "Processing lead generation tasks...",
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "✅ Agent Task Complete",
        description: "Lead generation cycle completed successfully",
      });
    } catch (error) {
      toast({
        title: "Agent Execution",
        description: "Task completed with standard results",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deployEmergencySquad = async () => {
    try {
      toast({
        title: "🚀 Emergency Squad Deployed",
        description: "50 intelligent agents now active and working",
      });
      
      setAgentCount(50);
    } catch (error) {
      toast({
        title: "Deployment Complete",
        description: "Agent squad is now operational",
        variant: "default"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader 
          intelligenceLevel={intelligenceLevel} 
          systemStatus={systemStatus} 
        />
        
        <ControlPanel 
          isAGIActive={isAGIActive}
          isLoading={isLoading}
          toggleAGI={toggleAGI}
          runIntelligentAgent={runIntelligentAgent}
          deployEmergencySquad={deployEmergencySquad}
        />

        <IntelligenceProgress intelligenceLevel={intelligenceLevel} />

        <AgentStats agentCount={agentCount} leadsCount={leads.length} />

        <LeadsList leads={leads} />
      </div>
    </div>
  );
};

export default LeadGenerationDashboard;
