
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, Target, Clock, RefreshCw } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDataStats = async () => {
    try {
      console.log('📊 Fetching data statistics...');
      setError(null);

      // Get supervisor queue count
      console.log('🔍 Querying supervisor_queue...');
      const { count: queueCount, error: queueError } = await supabase
        .from('supervisor_queue')
        .select('*', { count: 'exact', head: true });

      if (queueError) {
        console.error('Error fetching supervisor queue:', queueError);
        throw new Error(`Supervisor queue: ${queueError.message}`);
      }

      // Get agent memory count
      console.log('🔍 Querying agent_memory...');
      const { count: memoryCount, error: memoryError } = await supabase
        .from('agent_memory')
        .select('*', { count: 'exact', head: true });

      if (memoryError) {
        console.error('Error fetching agent memory:', memoryError);
        throw new Error(`Agent memory: ${memoryError.message}`);
      }

      // Get active goals count
      console.log('🔍 Querying agi_goals_enhanced...');
      const { count: goalsCount, error: goalsError } = await supabase
        .from('agi_goals_enhanced')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        throw new Error(`AGI goals: ${goalsError.message}`);
      }

      // Get recent activity (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      console.log('🔍 Querying recent activity since:', fiveMinutesAgo);
      
      const { count: recentCount, error: recentError } = await supabase
        .from('supervisor_queue')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', fiveMinutesAgo);

      if (recentError) {
        console.error('Error fetching recent activity:', recentError);
        throw new Error(`Recent activity: ${recentError.message}`);
      }

      const newStats = {
        supervisorQueue: queueCount || 0,
        agentMemory: memoryCount || 0,
        activeGoals: goalsCount || 0,
        recentActivity: recentCount || 0
      };

      console.log('📊 Data statistics updated:', newStats);
      setDataStats(newStats);
      setLastUpdate(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data stats:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDataStats();

    // Set up real-time subscriptions
    console.log('🔄 Setting up real-time subscriptions...');
    
    const queueChannel = supabase
      .channel('supervisor_queue_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'supervisor_queue'
      }, (payload) => {
        console.log('🔄 Supervisor queue changed:', payload);
        fetchDataStats();
      })
      .subscribe();

    const memoryChannel = supabase
      .channel('agent_memory_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agent_memory'
      }, (payload) => {
        console.log('🔄 Agent memory changed:', payload);
        fetchDataStats();
      })
      .subscribe();

    const goalsChannel = supabase
      .channel('agi_goals_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'agi_goals_enhanced'
      }, (payload) => {
        console.log('🔄 AGI goals changed:', payload);
        fetchDataStats();
      })
      .subscribe();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(fetchDataStats, 30000);

    // Cleanup subscriptions
    return () => {
      console.log('🧹 Cleaning up subscriptions...');
      supabase.removeChannel(queueChannel);
      supabase.removeChannel(memoryChannel);
      supabase.removeChannel(goalsChannel);
      clearInterval(refreshInterval);
    };
  }, []);

  if (error) {
    return (
      <Card className="bg-red-900/30 border border-red-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-300">
            <Activity className="h-5 w-5" />
            Data Monitor Error
          </CardTitle>
          <CardDescription className="text-red-200">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            onClick={fetchDataStats}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border border-slate-600/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-green-400" />
          Real-time Data Monitor
          {isLoading && <RefreshCw className="h-4 w-4 animate-spin ml-2" />}
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
