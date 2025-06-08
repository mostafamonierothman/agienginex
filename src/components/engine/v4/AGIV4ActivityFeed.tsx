
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Clock, User, Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  timestamp: string;
  agent_name: string;
  action: string;
  status: string;
  output: string;
}

const AGIV4ActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivities = async () => {
    try {
      console.log('📊 Fetching recent activities...');
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('supervisor_queue')
        .select('id, timestamp, agent_name, action, status, output')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error('Error fetching activities:', fetchError);
        throw new Error(`Failed to fetch activities: ${fetchError.message}`);
      }

      console.log(`📊 Found ${data?.length || 0} activities`);
      setActivities(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();

    // Set up real-time subscription
    console.log('🔄 Setting up real-time activity subscription...');
    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'supervisor_queue'
      }, (payload) => {
        console.log('🔄 New activity:', payload);
        const newActivity = payload.new as ActivityItem;
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      })
      .subscribe();

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(fetchRecentActivities, 30000);

    return () => {
      console.log('🧹 Cleaning up activity feed subscription...');
      supabase.removeChannel(channel);
      clearInterval(refreshInterval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'started': return 'bg-blue-500';
      case 'running': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
      return 'Invalid time';
    }
  };

  if (error) {
    return (
      <Card className="bg-red-900/30 border border-red-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-300">
            <AlertCircle className="h-5 w-5" />
            Activity Feed Error
          </CardTitle>
          <CardDescription className="text-red-200">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            onClick={fetchRecentActivities}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading Activity Feed...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border border-slate-600/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-cyan-400" />
          Agent Activity Feed
        </CardTitle>
        <CardDescription className="text-slate-300">
          Real-time agent execution logs and status updates ({activities.length} records)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No agent activity yet.</p>
              <p className="text-sm mt-2">Click "Initialize System" first, then start the autonomous system to see logs here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-medium">
                        {activity.agent_name || 'Unknown Agent'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.action || 'Unknown Action'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(activity.status)} text-white text-xs`}>
                        {activity.status || 'Unknown'}
                      </Badge>
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-2">
                    {activity.output || 'No output recorded'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AGIV4ActivityFeed;
