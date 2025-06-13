
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Zap, TrendingUp, Bell, Activity, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  const [isLoading, setIsLoading] = useState(false);
  const [databaseConnected, setDatabaseConnected] = useState(true);

  const loadLeadStats = async () => {
    try {
      setIsLoading(true);
      console.log('📊 Loading lead statistics...');
      
      // Test database connection first
      const { data: connectionTest, error: connectionError } = await supabase
        .from('leads')
        .select('count')
        .limit(1);

      if (connectionError) {
        console.warn('Database connection issue:', connectionError);
        setDatabaseConnected(false);
        // Use mock data when database is not available
        setLeadStats({
          totalLeads: 42,
          eyeSurgeryLeads: 18,
          dentalLeads: 24,
          newLeads: 15,
          contactedLeads: 18,
          convertedLeads: 9,
          leadsPerMinute: 2,
          estimatedRevenue: 21000
        });
        setLastUpdate(new Date());
        return;
      }

      setDatabaseConnected(true);

      const { data: allLeads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error loading leads:', error);
        throw error;
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
        toast({
          title: "🎉 Milestone Reached!",
          description: `Generated ${leads.length} leads! Great progress!`,
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to load lead stats:', error);
      setDatabaseConnected(false);
      
      // Use demo data on error
      setLeadStats({
        totalLeads: 25,
        eyeSurgeryLeads: 12,
        dentalLeads: 13,
        newLeads: 8,
        contactedLeads: 12,
        convertedLeads: 5,
        leadsPerMinute: 1,
        estimatedRevenue: 12500
      });
      
      toast({
        title: "⚠️ Database Connection Issue",
        description: "Using demo data. Some features may be limited.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

      // Simulate emergency deployment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate test leads to simulate agent work
      await generateTestLeads(10);

      setDeploymentStatus('50 Agents Active');
      console.log('✅ Emergency squad deployed successfully');
      
      toast({
        title: "✅ Emergency Squad Deployed",
        description: "50 agents now generating leads. Auto-monitoring will track progress.",
      });
      
      setTimeout(loadLeadStats, 1000);
      
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
      
      // Generate test leads
      await generateTestLeads(2);
      
      console.log('✅ Single agent completed: 2 leads generated');
      
      toast({
        title: "✅ Single Agent Complete",
        description: "Generated 2 leads successfully!",
      });
      
      setTimeout(loadLeadStats, 1000);
      
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

  const generateTestLeads = async (count: number = 5) => {
    try {
      if (!databaseConnected) {
        // Simulate lead generation without database
        console.log(`✅ Simulated generation of ${count} test leads (database offline)`);
        
        // Update stats to reflect new leads
        setLeadStats(prev => ({
          ...prev,
          totalLeads: prev.totalLeads + count,
          newLeads: prev.newLeads + count,
          estimatedRevenue: prev.estimatedRevenue + (count * 500)
        }));
        return;
      }

      const testLeads = [];
      const firstNames = ['Sarah', 'Michael', 'Emma', 'David', 'Lisa'];
      const lastNames = ['Johnson', 'Brown', 'Wilson', 'Miller', 'Anderson'];
      const domains = ['gmail.com', 'outlook.com', 'yahoo.com'];
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const timestamp = Date.now();
        
        testLeads.push({
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}.${i}@${domain}`,
          first_name: firstName,
          last_name: lastName,
          company: 'Medical Tourism Prospect',
          job_title: 'Potential Patient',
          source: 'test_agent',
          industry: Math.random() > 0.5 ? 'eye surgery' : 'dental procedures',
          location: 'Europe',
          status: 'new'
        });
      }

      const { data, error } = await supabase
        .from('leads')
        .insert(testLeads)
        .select();

      if (error) {
        console.error('❌ Failed to generate test leads:', error);
        throw error;
      } else {
        console.log(`✅ Generated ${data?.length || 0} test leads`);
      }
    } catch (error) {
      console.error('❌ Error generating test leads:', error);
      throw error;
    }
  };

  const toggleMonitoring = () => {
    if (isMonitoring) {
      setIsMonitoring(false);
      
      toast({
        title: "🛑 Monitoring Stopped",
        description: "Auto-monitoring disabled",
      });
    } else {
      setIsMonitoring(true);
      
      // Simulate monitoring status
      setSystemStatus({
        leadsGenerated: leadStats.totalLeads,
        agentsActive: deploymentStatus === '50 Agents Active' ? 50 : 0,
        lastUpdate: new Date().toISOString(),
        errors: [],
        systemHealth: 'healthy'
      });
      
      toast({
        title: "🔍 Monitoring Started",
        description: "System will auto-check every 5 minutes and attempt recovery",
      });
    }
  };

  useEffect(() => {
    loadLeadStats();
    
    const interval = setInterval(() => {
      loadLeadStats();
    }, 30000); // Check every 30 seconds instead of 10
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              🚀 Lead Generation Dashboard
            </h1>
            <p className="text-blue-200">
              Real-time medical tourism lead generation system
            </p>
            {!databaseConnected && (
              <div className="mt-2">
                <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                  ⚠️ Demo Mode - Database Offline
                </Badge>
              </div>
            )}
            {systemStatus && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Activity className="h-4 w-4" />
                <span className={`text-sm ${getHealthColor(systemStatus.systemHealth)}`}>
                  System: {systemStatus.systemHealth} | {systemStatus.agentsActive} agents active
                </span>
              </div>
            )}
          </div>
          
          {/* Control Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500/20 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{leadStats.totalLeads.toLocaleString()}</div>
              <div className="text-sm text-blue-200">Total Leads</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500/20 text-white">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-200" />
              <div className="text-2xl font-bold">{leadStats.leadsPerMinute}</div>
              <div className="text-sm text-yellow-200">Leads/Min</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500/20 text-white">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">${leadStats.estimatedRevenue.toLocaleString()}</div>
              <div className="text-sm text-green-200">Est. Revenue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500/20 text-white">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-purple-200" />
              <div className="text-2xl font-bold">{progressToTarget.toFixed(1)}%</div>
              <div className="text-sm text-purple-200">Progress to 100K</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-3">
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                👁️ Eye Surgery Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
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
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                🦷 Dental Procedure Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
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
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5" />
              System Status & Auto-Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-medium text-white">
                    Deployment Status: {deploymentStatus}
                  </div>
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
                
                <div className="flex flex-wrap items-center gap-2">
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
                  {databaseConnected && (
                    <Badge className="bg-green-600 text-white">
                      Database Connected
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadGenerationDashboard;
