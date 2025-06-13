
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Zap, TrendingUp, Bell, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { agentRegistry } from '@/config/AgentRegistry';
import { toast } from '@/hooks/use-toast';
import { leadMonitoringService } from '@/services/LeadMonitoringService';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeadStats = async () => {
    try {
      setError(null);
      console.log('📊 Loading lead statistics...');
      
      const { data: allLeads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error loading leads:', error);
        setError('Unable to load leads from database');
        return;
      }

      const leads = allLeads || [];
      console.log(`📊 Loaded ${leads.length} leads from database`);
      
      const eyeSurgeryLeads = leads.filter(l => l.industry === 'eye surgery').length;
      const dentalLeads = leads.filter(l => l.industry === 'dental procedures').length;
      const newLeads = leads.filter(l => l.status === 'new').length;
      const contactedLeads = leads.filter(l => l.status === 'contacted').length;
      const convertedLeads = leads.filter(l => l.status === 'converted').length;
      
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
        estimatedRevenue: leads.length * 500
      });
      
      setLastUpdate(new Date());

      if (leads.length >= 100) {
        await sendNotification();
      }

      if (leads.length > 0) {
        console.log(`✅ Lead Stats: ${leads.length} total leads (${eyeSurgeryLeads} eye surgery, ${dentalLeads} dental)`);
      }
      
    } catch (error) {
      console.error('❌ Failed to load lead stats:', error);
      setError('Failed to load lead statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('lead-notification', {
        body: { action: 'milestone_check' }
      });
      
      if (error) {
        console.error('Notification error:', error);
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
          description: "50 agents now generating leads. Auto-monitoring will track progress.",
        });
        
        if (!leadMonitoringService.isMonitoring()) {
          leadMonitoringService.startMonitoring((status) => {
            setSystemStatus(status);
            if (status.leadsGenerated !== leadStats.totalLeads) {
              loadLeadStats();
            }
          });
          setIsMonitoring(true);
        }
        
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
        
        if (!leadMonitoringService.isMonitoring()) {
          leadMonitoringService.startMonitoring((status) => {
            setSystemStatus(status);
            if (status.leadsGenerated !== leadStats.totalLeads) {
              loadLeadStats();
            }
          });
          setIsMonitoring(true);
        }
        
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
        
        if (status.leadsGenerated !== leadStats.totalLeads) {
          loadLeadStats();
        }
      });
      setIsMonitoring(true);
      
      toast({
        title: "🔍 Monitoring Started",
        description: "System will auto-check every 5 minutes and attempt recovery",
      });
    }
  };

  useEffect(() => {
    loadLeadStats();
    
    const wasResumed = leadMonitoringService.checkAndResumeMonitoring();
    
    if (!wasResumed) {
      leadMonitoringService.startMonitoring((status) => {
        setSystemStatus(status);
      });
    }
    
    setIsMonitoring(leadMonitoringService.isMonitoring());
    
    const interval = setInterval(() => {
      loadLeadStats();
      
      if (!leadMonitoringService.isMonitoring()) {
        console.log('🔄 Auto-restarting monitoring service...');
        leadMonitoringService.startMonitoring((status) => {
          setSystemStatus(status);
        });
        setIsMonitoring(true);
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Lead Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-red-900/20 border-red-500/20 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Dashboard Error</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
              Reload Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              🚀 Lead Generation Dashboard
            </h1>
            <p className="text-sm sm:text-base text-blue-200">
              Real-time medical tourism lead generation system
            </p>
            {systemStatus && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Activity className="h-4 w-4" />
                <span className={`text-xs sm:text-sm ${getHealthColor(systemStatus.systemHealth)}`}>
                  System: {systemStatus.systemHealth} | {systemStatus.agentsActive} agents active
                </span>
              </div>
            )}
          </div>
          
          {/* Control Buttons - Mobile Optimized */}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            <Button 
              onClick={toggleMonitoring}
              variant={isMonitoring ? "destructive" : "outline"}
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
            >
              {isMonitoring ? '🛑 Stop Monitoring' : '🔍 Start Monitoring'}
            </Button>
            <Button 
              onClick={runSingleLeadAgent}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm"
            >
              {isGenerating ? 'Running...' : '🧪 Test Single Agent'}
            </Button>
            <Button
              onClick={deployEmergencySquad}
              disabled={isGenerating}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg text-xs sm:text-sm"
            >
              {isGenerating ? 'Deploying...' : '🚨 Deploy Emergency Squad (50 Agents)'}
            </Button>
          </div>
        </div>

        {/* Main Stats - Mobile Optimized Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/20 text-white">
            <CardContent className="p-3 sm:p-6 text-center">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-lg sm:text-2xl font-bold">{leadStats.totalLeads.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-blue-200">Total Leads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500/20 text-white">
            <CardContent className="p-3 sm:p-6 text-center">
              <Zap className="h-5 w-5 sm:h-8 sm:w-8 mx-auto mb-2 text-yellow-200" />
              <div className="text-lg sm:text-2xl font-bold">{leadStats.leadsPerMinute}</div>
              <div className="text-xs sm:text-sm text-yellow-200">Leads/Min</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500/20 text-white">
            <CardContent className="p-3 sm:p-6 text-center">
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 mx-auto mb-2 text-green-200" />
              <div className="text-lg sm:text-2xl font-bold">${leadStats.estimatedRevenue.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-green-200">Est. Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500/20 text-white">
            <CardContent className="p-3 sm:p-6 text-center">
              <Target className="h-5 w-5 sm:h-8 sm:w-8 mx-auto mb-2 text-purple-200" />
              <div className="text-lg sm:text-2xl font-bold">{progressToTarget.toFixed(1)}%</div>
              <div className="text-xs sm:text-sm text-purple-200">Progress to 100K</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Progress to 100,000 Lead Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressToTarget} className="h-2 sm:h-3 mb-2 bg-white/20" />
            <div className="flex justify-between text-xs sm:text-sm text-blue-200">
              <span>{leadStats.totalLeads.toLocaleString()} leads generated</span>
              <span>Target: 100,000 leads</span>
            </div>
          </CardContent>
        </Card>

        {/* Lead Categories - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
                👁️ Eye Surgery Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-xs sm:text-sm">LASIK/LASEK Procedures</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-300 text-xs">
                    {leadStats.eyeSurgeryLeads}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-blue-300">
                  Target: European patients seeking affordable eye surgery
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
                🦷 Dental Procedure Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 text-xs sm:text-sm">Veneers & Major Work</span>
                  <Badge variant="outline" className="border-blue-300 text-blue-300 text-xs">
                    {leadStats.dentalLeads}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-blue-300">
                  Target: Patients seeking cosmetic dental procedures abroad
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown - Mobile Optimized */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm sm:text-base">Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">{leadStats.newLeads}</div>
                <div className="text-xs sm:text-sm text-blue-200">New Leads</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-orange-400">{leadStats.contactedLeads}</div>
                <div className="text-xs sm:text-sm text-blue-200">Contacted</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-400">{leadStats.convertedLeads}</div>
                <div className="text-xs sm:text-sm text-blue-200">Converted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status - Mobile Optimized */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-base">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              System Status & Auto-Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-medium text-white text-sm sm:text-base">
                    Deployment Status: {deploymentStatus}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-300">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </div>
                  {systemStatus && (
                    <div className="text-xs sm:text-sm text-blue-300 mt-1">
                      System Health: <span className={getHealthColor(systemStatus.systemHealth)}>{systemStatus.systemHealth}</span>
                      {systemStatus.errors.length > 0 && ` (${systemStatus.errors.length} issues)`}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={deploymentStatus === '50 Agents Active' ? 'default' : 'secondary'} className="text-xs">
                    {deploymentStatus}
                  </Badge>
                  {isMonitoring && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      <Activity className="h-3 w-3 mr-1" />
                      Auto-Monitoring
                    </Badge>
                  )}
                  {leadStats.totalLeads >= 100 && (
                    <Badge className="bg-green-600 text-white text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      Milestone Reached
                    </Badge>
                  )}
                </div>
              </div>
              
              {systemStatus?.errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-500/20 rounded p-3">
                  <div className="text-red-300 text-xs sm:text-sm font-medium mb-1">System Issues:</div>
                  <ul className="text-red-200 text-xs sm:text-sm space-y-1">
                    {systemStatus.errors.slice(0, 3).map((error, i) => (
                      <li key={i} className="break-words">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadGenerationDashboard;
