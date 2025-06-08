
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Target, Clock } from 'lucide-react';

interface DataStats {
  supervisorQueue: number;
  agentMemory: number;
  activeGoals: number;
  recentActivity: number;
}

const AGIV4DataMonitor = () => {
  const [dataStats, setDataStats] = useState<DataStats>({
    supervisorQueue: 0,
    agentMemory: 0,
    activeGoals: 0,
    recentActivity: 0
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchDataStats = async () => {
    try {
      // Get supervisor queue count
      const { count: queueCount } = await supabase
        .from('supervisor_queue')
        .select('*', { count: 'exact', head: true });

      // Get agent memory count
      const { count: memoryCount } = await supabase
        .from('agent_memory')
        .select('*', { count: 'exact', head: true });

      // Get active goals count
      const { count: goalsCount } = await supabase
        .from('agi_goals_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get recent activity (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { count: recentCount } = await supabase
        .from('supervisor_queue')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', fiveMinutesAgo);

      setDataStats({
        supervisorQueue: queueCount || 0,
        agentMemory: memoryCount || 0,
        activeGoals: goalsCount || 0,
        recentActivity: recentCount || 0
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data stats:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDataStats();

    // Set up real-time subscriptions
    const queueChannel = supabase
      .channel('supervisor_queue_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'supervisor_queue'
      }, () => {
        fetchDataStats();
      })
      .subscribe();

    const memoryChannel = supabase
      .channel('agent_memory_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agent_memory'
      }, () => {
        fetchDataStats();
      })
      .subscribe();

    const goalsChannel = supabase
      .channel('agi_goals_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agi_goals_enhanced'
      }, () => {
        fetchDataStats();
      })
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(queueChannel);
      supabase.removeChannel(memoryChannel);
      supabase.removeChannel(goalsChannel);
    };
  }, []);

  return (
    <Card className="bg-slate-800/50 border border-slate-600/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-green-400" />
          Real-time Data Monitor
        </CardTitle>
        <CardDescription className="text-slate-300">
          Live database activity tracking • Last updated: {lastUpdate.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-slate-200 text-sm">Supervisor Queue</span>
            </div>
            <Badge className="bg-blue-500 text-white">
              {dataStats.supervisorQueue}
            </Badge>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-slate-200 text-sm">Agent Memory</span>
            </div>
            <Badge className="bg-purple-500 text-white">
              {dataStats.agentMemory}
            </Badge>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-400" />
              <span className="text-slate-200 text-sm">Active Goals</span>
            </div>
            <Badge className="bg-green-500 text-white">
              {dataStats.activeGoals}
            </Badge>
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-400" />
              <span className="text-slate-200 text-sm">Recent (5m)</span>
            </div>
            <Badge className="bg-orange-500 text-white">
              {dataStats.recentActivity}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AGIV4DataMonitor;
