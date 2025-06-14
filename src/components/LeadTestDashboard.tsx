
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database, Users, Activity, Zap } from 'lucide-react';

interface Lead {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  industry: string;
  location: string;
  source: string;
  status: string;
  created_at: string;
}

export default function LeadTestDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);

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
        setLeads(data || []);
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
        status: 'new'
      };

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
                <div key={lead.id} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {lead.first_name} {lead.last_name}
                      </h3>
                      <p className="text-gray-300">{lead.email}</p>
                    </div>
                    <Badge className={`${
                      lead.status === 'new' ? 'bg-green-500' : 
                      lead.status === 'contacted' ? 'bg-blue-500' : 'bg-gray-500'
                    } text-white`}>
                      {lead.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Company: </span>
                      <span className="text-white">{lead.company || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Industry: </span>
                      <span className="text-blue-400">{lead.industry || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Location: </span>
                      <span className="text-green-400">{lead.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Source: </span>
                      <span className="text-purple-400">{lead.source}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(lead.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
