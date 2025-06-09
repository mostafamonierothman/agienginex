
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Eye, Tooth, Users, Target, Clock, CheckCircle, Activity, AlertCircle, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { toast } from '@/hooks/use-toast';

interface AgentStatus {
  id: string;
  name: string;
  specialty: 'eye_surgery' | 'dental_procedures';
  status: 'deploying' | 'active' | 'completed' | 'disappeared';
  leads_generated: number;
  leads_target: number;
  target_countries: string[];
  deployment_time: string;
  completion_time?: string;
}

const MedicalTourismAgentsPage = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [missionStatus, setMissionStatus] = useState<'not_started' | 'deploying' | 'active' | 'completed'>('not_started');
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadAgentStatus = async () => {
    try {
      // Load agent status from supervisor_queue and agent_memory tables
      const { data: supervisorData } = await supabase
        .from('supervisor_queue')
        .select('*')
        .ilike('agent_name', '%Agent%')
        .eq('action', 'emergency_deployment')
        .order('timestamp', { ascending: false });

      const { data: memoryData } = await supabase
        .from('agent_memory')
        .select('*')
        .eq('memory_key', 'lead_generation_knowledge')
        .order('timestamp', { ascending: false });

      // Load actual leads count
      const { data: leadsData } = await supabase
        .from('leads')
        .select('id, industry')
        .in('industry', ['eye surgery', 'dental procedures']);

      const eyeLeads = leadsData?.filter(l => l.industry === 'eye surgery').length || 0;
      const dentalLeads = leadsData?.filter(l => l.industry === 'dental procedures').length || 0;
      setTotalLeads(eyeLeads + dentalLeads);

      // Parse agent data from memory and supervisor logs
      const agentMap = new Map();
      
      // Process memory data for completed agents
      memoryData?.forEach(memory => {
        try {
          const knowledgeData = JSON.parse(memory.memory_value);
          agentMap.set(memory.agent_name, {
            id: memory.agent_name,
            name: memory.agent_name,
            specialty: knowledgeData.specialty,
            status: 'completed',
            leads_generated: knowledgeData.leads_generated || 0,
            leads_target: 2000,
            target_countries: knowledgeData.countries_searched || [],
            deployment_time: memory.timestamp,
            completion_time: knowledgeData.completion_time
          });
        } catch (e) {
          console.warn('Failed to parse agent memory:', e);
        }
      });

      // Process supervisor data for active/deploying agents
      supervisorData?.forEach(log => {
        if (!agentMap.has(log.agent_name)) {
          try {
            const inputData = JSON.parse(log.input || '{}');
            agentMap.set(log.agent_name, {
              id: log.agent_name,
              name: log.agent_name,
              specialty: inputData.specialty || 'eye_surgery',
              status: log.status === 'active' ? 'active' : 'deploying',
              leads_generated: 0,
              leads_target: inputData.leads_target || 2000,
              target_countries: inputData.target_countries || [],
              deployment_time: log.timestamp
            });
          } catch (e) {
            console.warn('Failed to parse supervisor log:', e);
          }
        }
      });

      const agentArray = Array.from(agentMap.values());
      setAgents(agentArray);

      // Determine mission status
      if (agentArray.length === 0) {
        setMissionStatus('not_started');
      } else if (agentArray.some(a => a.status === 'active')) {
        setMissionStatus('active');
      } else if (agentArray.every(a => a.status === 'completed' || a.status === 'disappeared')) {
        setMissionStatus('completed');
      } else {
        setMissionStatus('deploying');
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load agent status:', error);
    }
  };

  useEffect(() => {
    loadAgentStatus();
    const interval = setInterval(loadAgentStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const deployAgents = async () => {
    setIsLoading(true);
    try {
      const result = await ExecutionAgentRunner({
        input: { 
          task: "Generate 50 agents to find medical tourism leads for 100,000 total leads targeting Europe", 
          mode: 'real_execution' 
        },
        user_id: 'medical_tourism_monitor'
      });

      if (result.success) {
        toast({
          title: "🚨 Emergency Deployment Started",
          description: "50 specialized agents are being deployed for medical tourism lead generation",
        });
        setMissionStatus('deploying');
      } else {
        toast({
          title: "❌ Deployment Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "❌ Deployment Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    return specialty === 'eye_surgery' ? <Eye className="h-4 w-4" /> : <Tooth className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deploying': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'active': return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disappeared': return <Zap className="h-4 w-4 text-purple-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deploying': return 'bg-yellow-500 text-white';
      case 'active': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'disappeared': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const eyeSurgeryAgents = agents.filter(a => a.specialty === 'eye_surgery');
  const dentalAgents = agents.filter(a => a.specialty === 'dental_procedures');
  const completedAgents = agents.filter(a => a.status === 'completed' || a.status === 'disappeared').length;
  const totalProgress = agents.length > 0 ? Math.round((totalLeads / 100000) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Medical Tourism Lead Generation Mission</h1>
          <p className="text-gray-300 text-sm">50 Specialized Agents • Target: 100,000 European Medical Tourism Leads</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={`${
            missionStatus === 'active' ? 'text-blue-400 border-blue-400' :
            missionStatus === 'completed' ? 'text-green-400 border-green-400' :
            missionStatus === 'deploying' ? 'text-yellow-400 border-yellow-400' :
            'text-gray-400 border-gray-400'
          }`}>
            {missionStatus.toUpperCase().replace('_', ' ')}
          </Badge>
          <Button
            onClick={deployAgents}
            disabled={isLoading || missionStatus === 'active'}
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Deploying...' : '🚨 Deploy Emergency Squad'}
          </Button>
        </div>
      </div>

      {/* Mission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{agents.length}/50</div>
            <div className="text-sm text-gray-400">Agents Deployed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{totalLeads.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Leads Generated</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{completedAgents}</div>
            <div className="text-sm text-gray-400">Missions Complete</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{totalProgress}%</div>
            <div className="text-sm text-gray-400">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Mission Progress: {totalLeads.toLocaleString()} / 100,000 Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={totalProgress} className="h-3" />
          <div className="text-sm text-gray-400 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Agent Squads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eye Surgery Specialists */}
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-400" />
              Eye Surgery Specialists ({eyeSurgeryAgents.length}/25)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {eyeSurgeryAgents.map((agent) => (
                  <div key={agent.id} className="p-3 bg-muted/30 rounded border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                          {agent.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {agent.leads_generated}/{agent.leads_target} leads
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{agent.name}</div>
                    <div className="text-xs text-gray-400">
                      Targets: {agent.target_countries.slice(0, 3).join(', ')}
                      {agent.target_countries.length > 3 && '...'}
                    </div>
                    <Progress 
                      value={(agent.leads_generated / agent.leads_target) * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                ))}
                {eyeSurgeryAgents.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No eye surgery agents deployed yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Dental Procedure Specialists */}
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Tooth className="h-5 w-5 text-green-400" />
              Dental Procedure Specialists ({dentalAgents.length}/25)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {dentalAgents.map((agent) => (
                  <div key={agent.id} className="p-3 bg-muted/30 rounded border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(agent.status)}
                        <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                          {agent.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {agent.leads_generated}/{agent.leads_target} leads
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{agent.name}</div>
                    <div className="text-xs text-gray-400">
                      Targets: {agent.target_countries.slice(0, 3).join(', ')}
                      {agent.target_countries.length > 3 && '...'}
                    </div>
                    <Progress 
                      value={(agent.leads_generated / agent.leads_target) * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                ))}
                {dentalAgents.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Tooth className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No dental agents deployed yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalTourismAgentsPage;
