
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class TimelineAgent {
  getCurrentTime(): string {
    return new Date().toISOString();
  }

  getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  }

  async scheduleEvent(eventName: string, scheduledTime: string): Promise<string> {
    try {
      // Store scheduled event in agent memory
      await supabase
        .from('agent_memory')
        .insert({
          user_id: 'timeline_agent',
          agent_name: 'timeline_agent',
          memory_key: `scheduled_event_${Date.now()}`,
          memory_value: JSON.stringify({
            eventName,
            scheduledTime,
            createdAt: this.getCurrentTime(),
            status: 'scheduled'
          })
        });

      return `Event "${eventName}" scheduled for ${scheduledTime}`;
    } catch (error) {
      return `Failed to schedule event: ${error.message}`;
    }
  }

  async getUpcomingEvents(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('agent_memory')
        .select('memory_value')
        .eq('user_id', 'timeline_agent')
        .eq('agent_name', 'timeline_agent')
        .like('memory_key', 'scheduled_event_%')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return data?.map(item => {
        try {
          return JSON.parse(item.memory_value);
        } catch {
          return null;
        }
      }).filter(event => event && event.status === 'scheduled') || [];
    } catch (error) {
      console.error('Failed to get upcoming events:', error);
      return [];
    }
  }

  async analyzeSystemUptime(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('timestamp')
        .order('timestamp', { ascending: true })
        .limit(1);

      if (error || !data || data.length === 0) {
        return { error: 'No system activity found' };
      }

      const firstActivity = new Date(data[0].timestamp);
      const now = new Date();
      const uptimeMs = now.getTime() - firstActivity.getTime();
      
      const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));

      return {
        firstActivity: firstActivity.toISOString(),
        currentTime: now.toISOString(),
        uptimeMs,
        uptimeFormatted: `${days}d ${hours}h ${minutes}m`,
        systemAge: days
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export async function TimelineAgentRunner(context: AgentContext): Promise<AgentResponse> {
  try {
    const timelineAgent = new TimelineAgent();
    const currentTime = timelineAgent.getFormattedTime();
    const uptime = await timelineAgent.analyzeSystemUptime();
    const upcomingEvents = await timelineAgent.getUpcomingEvents();

    // Log to supervisor queue
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'timeline_agent',
        agent_name: 'timeline_agent',
        action: 'time_analysis',
        input: JSON.stringify({ action: 'analyze_time_and_events' }),
        status: 'completed',
        output: `Current: ${currentTime}. Uptime: ${uptime.uptimeFormatted || 'Unknown'}. Events: ${upcomingEvents.length}`
      });

    return {
      success: true,
      message: `⏰ TimelineAgent: ${currentTime} | Uptime: ${uptime.uptimeFormatted || 'Unknown'} | ${upcomingEvents.length} scheduled events`,
      data: { currentTime, uptime, upcomingEvents },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ TimelineAgent error: ${error.message}`
    };
  }
}
