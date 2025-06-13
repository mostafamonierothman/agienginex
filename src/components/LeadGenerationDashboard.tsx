
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Zap, TrendingUp, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';

interface LeadStats {
  totalLeads: number;
  eyeSurgeryLeads: number;
  dentalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  leadsPerMinute: number;
  estimatedRevenue: number;
}

const LeadGenerationDashboard = () => {
  const [leadStats, setLeadStats] = useState<LeadStats>({
    totalLeads: 0,
    eyeSurgeryLeads: 0,
    dentalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    leadsPerMinute: 0,
    estimatedRevenue: 0
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('Ready');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadLeadStats = async () => {
    try {
      // Get total leads
      const { data: allLeads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error('Error loading leads:', error);
        return;
      }

      const leads = allLeads || [];
      
      // Calculate stats
      const eyeSurgeryLeads = leads.filter(l => l.industry === 'eye surgery').length;
      const dentalLeads = leads.filter(l => l.industry === 'dental procedures').length;
      const newLeads = leads.filter(l => l.status === 'new').length;
      const contactedLeads = leads.filter(l => l.status === 'contacted').length;
      const convertedLeads = leads.filter(l => l.status === 'converted').length;
      
      // Calculate leads per minute based on recent activity
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const recentLeads = leads.filter(l => new Date(l.created_at) > oneMinuteAgo);
      
      setLeadStats({
        totalLeads: leads.length,
        eyeSurgeryLeads,
        dentalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        leadsPerMinute: recentLeads.length,
        estimatedRevenue: leads.length * 500 // $500 potential per lead
      });
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load lead stats:', error);
    }
  };

  const deployEmergencySquad = async () => {
    setIsGenerating(true);
    setDeploymentStatus('Deploying 50 Agents...');
    
    try {
      toast({
        title: "🚨 Emergency Deployment Starting",
        description: "Deploying 50 specialized medical tourism lead generation agents...",
      });

      // Deploy the emergency agent squad
      const result = await agentRegistry.runAgent('emergency_agent_deployer', {
        input: {
          targetLeads: 100000,
          agentCount: 50,
          specialties: ['eye_surgery', 'dental_procedures'],
          targetRegion: 'Europe',
          emergencyMode: true
        },
        user_id: 'lead_dashboard'
      });

      if (result.success) {
        setDeploymentStatus('50 Agents Active');
        toast({
          title: "✅ Emergency Squad Deployed",
          description: "50 agents now generating leads. Refresh to see results.",
        });
        
        // Refresh stats immediately
        setTimeout(loadLeadStats, 2000);
      } else {
        setDeploymentStatus('Deployment Failed');
        toast({
          title: "❌ Deployment Failed",
          description: result.message || 'Unknown deployment error',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('Error');
      toast({
        title: "❌ Deployment Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const runSingleLeadAgent = async () => {
    setIsGenerating(true);
    try {
      const result = await agentRegistry.runAgent('lead_generation_master_agent', {
        input: { 
          keyword: 'LASIK surgery abroad UK',
          agentId: `single_agent_${Date.now()}`
        },
        user_id: 'lead_dashboard'
      });

      if (result.success) {
        toast({
          title: "✅ Single Agent Complete",
          description: `Generated ${result.data?.leadsGenerated || 0} leads`,
        });
        setTimeout(loadLeadStats, 1000);
      }
    } catch (error) {
      console.error('Single agent error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadLeadStats();
    const interval = setInterval(loadLeadStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const progressToTarget = Math.min((leadStats.totalLeads / 100000) * 100, 100);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lead Generation Dashboard</h1>
          <p className="text-gray-600">Real-time medical tourism lead generation system</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runSingleLeadAgent}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? 'Running...' : 'Test Single Agent'}
          </Button>
          <Button
            onClick={deployEmergencySquad}
            disabled={isGenerating}
            className="bg-red-600 hover:bg-red-700"
          >
            {isGenerating ? 'Deploying...' : '🚨 Deploy Emergency Squad (50 Agents)'}
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{leadStats.totalLeads.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Leads</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{leadStats.leadsPerMinute}</div>
            <div className="text-sm text-gray-600">Leads/Minute</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">${leadStats.estimatedRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Est. Revenue</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{progressToTarget.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Progress to 100K</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progress to 100,000 Lead Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressToTarget} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{leadStats.totalLeads.toLocaleString()} leads generated</span>
            <span>Target: 100,000 leads</span>
          </div>
        </CardContent>
      </Card>

      {/* Lead Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👁️ Eye Surgery Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>LASIK/LASEK Procedures</span>
                <Badge variant="outline">{leadStats.eyeSurgeryLeads}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Target: European patients seeking affordable eye surgery
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🦷 Dental Procedure Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Veneers & Major Work</span>
                <Badge variant="outline">{leadStats.dentalLeads}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                Target: Patients seeking cosmetic dental procedures abroad
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{leadStats.newLeads}</div>
              <div className="text-sm text-gray-600">New Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{leadStats.contactedLeads}</div>
              <div className="text-sm text-gray-600">Contacted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{leadStats.convertedLeads}</div>
              <div className="text-sm text-gray-600">Converted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Deployment Status: {deploymentStatus}</div>
              <div className="text-sm text-gray-600">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
            <Badge variant={deploymentStatus === '50 Agents Active' ? 'default' : 'secondary'}>
              {deploymentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadGenerationDashboard;
