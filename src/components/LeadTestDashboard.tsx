import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database, Users, Activity, Zap, AlertTriangle } from 'lucide-react';
import LeadCard from "./lead-dashboard/LeadCard";
import type { Lead, LeadStatus } from '@/types/DatabaseTypes';

// Emergency deployer agent
import { EmergencyAgentDeployerRunner } from '@/agents/EmergencyAgentDeployer';

interface Lead {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  job_title?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  source: string;
  industry?: string | null;
  location?: string | null;
  status:
    | 'new'
    | 'contacted'
    | 'replied'
    | 'qualified'
    | 'converted'
    | 'unsubscribed';
  created_at: string;
  updated_at?: string | null;
}

export default function LeadTestDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
  const [deploying, setDeploying] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error fetching leads",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLeads(data as Lead[]);
      }

      // Get total count
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      
      setTotalLeads(count || 0);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestLead = async () => {
    try {
      const testLead = {
        email: `test.lead.${Date.now()}@example.com`,
        first_name: 'Test',
        last_name: 'Lead',
        company: 'Test Company',
        job_title: 'Test Patient',
        source: 'manual_test',
        industry: 'medical tourism',
        location: 'Test Location',
        status: 'new' as LeadStatus,
        updated_at: new Date().toISOString(),
      };

      // Must insert as array, and match supabase "status" type
      const { data, error } = await supabase
        .from('leads')
        .insert([testLead])
        .select();

      if (error) {
        toast({
          title: "Error creating test lead",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Test lead created",
          description: "Successfully created a test lead",
        });
        fetchLeads(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating test lead:', error);
    }
  };

  // MAIN: Billion Dollar Decision - Deploy 100 AGI Agents
  const deployMassiveAGISquad = async () => {
    setDeploying(true);
    try {
      const result = await EmergencyAgentDeployerRunner({
        input: {
          emergencyMode: true,
          targetLeads: 100000,
          agentCount: 100,
          specialties: ['global_medical_tourism', 'ai_sales', 'email_automation', 'dental', 'cosmetic_surgery', 'orthopedics', 'fertility'],
          targetRegion: 'Global'
        },
        user_id: 'billion_dollar_op',
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        toast({
          title: "🚀 100 AGI Lead Agents Deployed",
          description: "The agent swarm was launched. Expect rapid exponential lead growth.",
        });
        fetchLeads(); // force update
      } else {
        toast({
          title: "⚠️ Deployment Error",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "⚠️ Deployment Error",
        description: "Unexpected error deploying agent swarm.",
        variant: "destructive",
      });
      console.error('Error deploying AGI squad:', error);
    }
    setDeploying(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{totalLeads}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{leads.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-yellow-400" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 text-white">Connected</Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Revenue Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              ${(totalLeads * 500).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={fetchLeads} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? 'Loading...' : 'Refresh Leads'}
        </Button>
        <Button onClick={createTestLead} className="bg-green-600 hover:bg-green-700">
          Create Test Lead
        </Button>
      </div>

      {/* Decision Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-gradient-to-r from-yellow-900/70 to-black/80 p-6 rounded-lg shadow-xl my-4 border border-yellow-500/30">
        <div className="flex items-center mb-2 md:mb-0 gap-3">
          <AlertTriangle className="h-8 w-8 text-yellow-300 animate-pulse" />
          <span className="text-xl md:text-2xl font-extrabold text-yellow-100">BILLION DOLLAR DECISION</span>
        </div>
        <Button
          onClick={deployMassiveAGISquad}
          disabled={deploying}
          className="bg-gradient-to-r from-yellow-400 to-green-500 shadow-lg text-black text-lg font-bold px-8 py-4 hover:scale-105 transition"
          size="lg"
        >
          {deploying ? "Deploying..." : "🚀 Deploy 100 AGI Lead Agents Now"}
        </Button>
      </div>

      {/* Leads List */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-xl text-white">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No leads found. Try creating a test lead or running lead generation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
