
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Zap, TrendingUp, Bell, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';
import { leadMonitoringService } from '@/services/LeadMonitoringService';

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

interface SystemStatus {
  leadsGenerated: number;
  agentsActive: number;
  lastUpdate: string;
  errors: string[];
  systemHealth: 'healthy' | 'degraded' | 'critical';
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
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const loadLeadStats = async () => {
    try {
      console.log('📊 Loading lead statistics...');
      
      // Get total leads with better error handling
      const { data: allLeads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error loading leads:', error);
        
        // Show user-friendly error message
        toast({
          title: "⚠️ Database Connection Issue",
          description: "Unable to load leads. System is attempting recovery...",
          variant: "destructive"
        });
        
        return;
      }

      const leads = allLeads || [];
      console.log(`📊 Loaded ${leads.length} leads from database`);
      
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

      // Check for milestone notifications
      if (leads.length >= 100) {
        await sendNotification();
      }

      // Log progress to console
      if (leads.length > 0) {
        console.log(`✅ Lead Stats: ${leads.length} total leads (${eyeSurgeryLeads} eye surgery, ${dentalLeads} dental)`);
      }
      
    } catch (error) {
      console.error('❌ Failed to load lead stats:', error);
      
      toast({
        title: "❌ Error Loading Data",
        description: "System error occurred. Auto-recovery is active.",
        variant: "destructive"
      });
    }
  };

  const sendNotification = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('lead-notification', {
        body: { action: 'milestone_check' }
      });
      
      if (error) {
        console.error('Notification error:', error);
      } else {
        console.log('Notification check completed:', data);
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const deployEmergencySquad = async () => {
    setIsGenerating(true);
    setDeploymentStatus('Deploying 50 Agents...');
    
    try {
      console.log('🚨 Starting emergency deployment of 50 agents...');
      
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
        console.log('✅ Emergency squad deployed successfully');
        
        toast({
          title: "✅ Emergency Squad Deployed",
          description: "50 agents now generating leads. Refresh to see results.",
        });
        
        // Refresh stats immediately
        setTimeout(loadLeadStats, 2000);
      } else {
        setDeploymentStatus('Deployment Failed');
        console.error('❌ Emergency deployment failed:', result.message);
        
        toast({
          title: "❌ Deployment Failed",
          description: result.message || 'Unknown deployment error',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Deployment error:', error);
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
      console.log('🧪 Running single test agent...');
      
      const result = await agentRegistry.runAgent('lead_generation_master_agent', {
        input: { 
          keyword: 'LASIK surgery abroad UK',
          agentId: `single_agent_${Date.now()}`
        },
        user_id: 'lead_dashboard'
      });

      if (result.success) {
        console.log(`✅ Single agent completed: ${result.data?.leadsGenerated || 0} leads generated`);
        
        toast({
          title: "✅ Single Agent Complete",
          description: `Generated ${result.data?.leadsGenerated || 0} leads`,
        });
        
        setTimeout(loadLeadStats, 1000);
      } else {
        console.error('❌ Single agent failed:', result.message);
        
        toast({
          title: "❌ Agent Failed",
          description: result.message || 'Agent execution failed',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Single agent error:', error);
      
      toast({
        title: "❌ Agent Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      leadMonitoringService.stopMonitoring();
      setIsMonitoring(false);
      
      toast({
        title: "🛑 Monitoring Stopped",
        description: "Auto-monitoring disabled",
      });
    } else {
      leadMonitoringService.startMonitoring((status) => {
        setSystemStatus(status);
        
        // Update lead stats if leads changed
        if (status.leadsGenerated !== leadStats.totalLeads) {
          loadLeadStats();
        }
      });
      setIsMonitoring(true);
      
      toast({
        title: "🔍 Monitoring Started",
        description: "System will auto-check every 5 minutes",
      });
    }
  };

  useEffect(() => {
    // Load initial stats
    loadLeadStats();
    
    // Start monitoring immediately
    leadMonitoringService.startMonitoring((status) => {
      setSystemStatus(status);
    });
    setIsMonitoring(true);
    
    // Set up regular updates
    const interval = setInterval(loadLeadStats, 10000); // Update every 10 seconds
    
    return () => {
      clearInterval(interval);
      leadMonitoringService.stopMonitoring();
    };
  }, []);

  const progressToTarget = Math.min((leadStats.totalLeads / 100000) * 100, 100);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">🚀 Lead Generation Dashboard</h1>
          <p className="text-blue-200">Real-time medical tourism lead generation system</p>
          {systemStatus && (
            <div className="flex items-center gap-2 mt-2">
              <Activity className="h-4 w-4" />
              <span className={`text-sm ${getHealthColor(systemStatus.systemHealth)}`}>
                System: {systemStatus.systemHealth} | {systemStatus.agentsActive} agents active
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-end">
          <Button 
            onClick={toggleMonitoring}
            variant={isMonitoring ? "destructive" : "outline"}
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isMonitoring ? '🛑 Stop Monitoring' : '🔍 Start Monitoring'}
          </Button>
          <Button 
            onClick={runSingleLeadAgent}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {isGenerating ? 'Running...' : '🧪 Test Single Agent'}
          </Button>
          <Button
            onClick={deployEmergencySquad}
            disabled={isGenerating}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
          >
            {isGenerating ? 'Deploying...' : '🚨 Deploy Emergency Squad (50 Agents)'}
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/20 text-white">
          <CardContent className="p-4 md:p-6 text-center">
            <Users className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-blue-200" />
            <div className="text-xl md:text-2xl font-bold">{leadStats.totalLeads.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-blue-200">Total Leads</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500/20 text-white">
          <CardContent className="p-4 md:p-6 text-center">
            <Zap className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-yellow-200" />
            <div className="text-xl md:text-2xl font-bold">{leadStats.leadsPerMinute}</div>
            <div className="text-xs md:text-sm text-yellow-200">Leads/Minute</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500/20 text-white">
          <CardContent className="p-4 md:p-6 text-center">
            <TrendingUp className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-green-200" />
            <div className="text-xl md:text-2xl font-bold">${leadStats.estimatedRevenue.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-green-200">Est. Revenue</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500/20 text-white">
          <CardContent className="p-4 md:p-6 text-center">
            <Target className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-purple-200" />
            <div className="text-xl md:text-2xl font-bold">{progressToTarget.toFixed(1)}%</div>
            <div className="text-xs md:text-sm text-purple-200">Progress to 100K</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5" />
            Progress to 100,000 Lead Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressToTarget} className="h-3 mb-2 bg-white/20" />
          <div className="flex justify-between text-sm text-blue-200">
            <span>{leadStats.totalLeads.toLocaleString()} leads generated</span>
            <span>Target: 100,000 leads</span>
          </div>
        </CardContent>
      </Card>

      {/* Lead Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              👁️ Eye Surgery Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-200">LASIK/LASEK Procedures</span>
                <Badge variant="outline" className="border-blue-300 text-blue-300">
                  {leadStats.eyeSurgeryLeads}
                </Badge>
              </div>
              <div className="text-sm text-blue-300">
                Target: European patients seeking affordable eye surgery
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              🦷 Dental Procedure Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-200">Veneers & Major Work</span>
                <Badge variant="outline" className="border-blue-300 text-blue-300">
                  {leadStats.dentalLeads}
                </Badge>
              </div>
              <div className="text-sm text-blue-300">
                Target: Patients seeking cosmetic dental procedures abroad
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Lead Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{leadStats.newLeads}</div>
              <div className="text-sm text-blue-200">New Leads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{leadStats.contactedLeads}</div>
              <div className="text-sm text-blue-200">Contacted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{leadStats.convertedLeads}</div>
              <div className="text-sm text-blue-200">Converted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5" />
            System Status & Auto-Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="font-medium text-white">Deployment Status: {deploymentStatus}</div>
                <div className="text-sm text-blue-300">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
                {systemStatus && (
                  <div className="text-sm text-blue-300 mt-1">
                    System Health: <span className={getHealthColor(systemStatus.systemHealth)}>{systemStatus.systemHealth}</span>
                    {systemStatus.errors.length > 0 && ` (${systemStatus.errors.length} issues)`}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={deploymentStatus === '50 Agents Active' ? 'default' : 'secondary'}>
                  {deploymentStatus}
                </Badge>
                {isMonitoring && (
                  <Badge className="bg-blue-600 text-white">
                    <Activity className="h-3 w-3 mr-1" />
                    Auto-Monitoring
                  </Badge>
                )}
                {leadStats.totalLeads >= 100 && (
                  <Badge className="bg-green-600 text-white">
                    <Bell className="h-3 w-3 mr-1" />
                    Milestone Reached
                  </Badge>
                )}
              </div>
            </div>
            
            {systemStatus?.errors.length > 0 && (
              <div className="bg-red-900/20 border border-red-500/20 rounded p-3">
                <div className="text-red-300 text-sm font-medium mb-1">System Issues:</div>
                <ul className="text-red-200 text-sm space-y-1">
                  {systemStatus.errors.slice(0, 3).map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadGenerationDashboard;
