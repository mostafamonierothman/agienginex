
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, Clock, User, Zap } from 'lucide-react';

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

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('id, timestamp, agent_name, action, status, output')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();

    // Set up real-time subscription
    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'supervisor_queue'
      }, (payload) => {
        const newActivity = payload.new as ActivityItem;
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'started': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
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
          Real-time agent execution logs and status updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No agent activity yet. Start the autonomous system to see logs here.</p>
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
                        {activity.agent_name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(activity.status)} text-white text-xs`}>
                        {activity.status}
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
