
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { supabase } from '@/integrations/supabase/client';

export class SecurityAgent {
  private blockedKeywords = [
    'delete', 'drop', 'truncate', 'destroy', 'remove', 'wipe',
    'shutdown', 'terminate', 'kill', 'stop', 'halt',
    'password', 'secret', 'token', 'key', 'credential'
  ];

  scanAction(agentName: string, action: string): { allowed: boolean; reason?: string } {
    const actionLower = action.toLowerCase();
    
    for (const keyword of this.blockedKeywords) {
      if (actionLower.includes(keyword)) {
        return {
          allowed: false,
          reason: `Action blocked: contains restricted keyword "${keyword}"`
        };
      }
    }

    // Check for suspicious patterns
    if (actionLower.includes('sudo') || actionLower.includes('admin')) {
      return {
        allowed: false,
        reason: 'Action blocked: potential privilege escalation attempt'
      };
    }

    if (actionLower.match(/\.(exe|bat|sh|ps1)$/)) {
      return {
        allowed: false,
        reason: 'Action blocked: executable file execution not allowed'
      };
    }

    return { allowed: true };
  }

  async scanRecentActivity(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('supervisor_queue')
        .select('agent_name, action, status, timestamp')
        .gte('timestamp', new Date(Date.now() - 1800000).toISOString()) // Last 30 minutes
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const suspiciousActivity = [];
      const agentActivity = new Map<string, number>();

      data?.forEach(activity => {
        // Track agent activity frequency
        const count = agentActivity.get(activity.agent_name) || 0;
        agentActivity.set(activity.agent_name, count + 1);

        // Check for suspicious patterns
        const scanResult = this.scanAction(activity.agent_name, activity.action || '');
        if (!scanResult.allowed) {
          suspiciousActivity.push({
            agent: activity.agent_name,
            action: activity.action,
            reason: scanResult.reason,
            timestamp: activity.timestamp
          });
        }
      });

      // Detect unusual activity patterns
      const highActivityAgents = Array.from(agentActivity.entries())
        .filter(([, count]) => count > 50) // More than 50 actions in 30 minutes
        .map(([agent, count]) => ({ agent, count }));

      return {
        suspiciousActivity,
        highActivityAgents,
        totalScanned: data?.length || 0,
        securityLevel: suspiciousActivity.length === 0 ? 'SECURE' : 'ALERT'
      };
    } catch (error) {
      return {
        error: error.message,
        securityLevel: 'UNKNOWN'
      };
    }
  }
}

export async function SecurityAgentRunner(context: AgentContext): Promise<AgentResponse> {
  try {
    const securityAgent = new SecurityAgent();
    const scanResult = await securityAgent.scanRecentActivity();

    // Log to supervisor queue
    await supabase
      .from('supervisor_queue')
      .insert({
        user_id: context.user_id || 'security_agent',
        agent_name: 'security_agent',
        action: 'security_scan',
        input: JSON.stringify({ action: 'scan_recent_activity' }),
        status: 'completed',
        output: `Security scan: ${scanResult.securityLevel} - ${scanResult.totalScanned} activities scanned`
      });

    return {
      success: true,
      message: `🛡️ SecurityAgent scan: ${scanResult.securityLevel} - ${scanResult.suspiciousActivity?.length || 0} alerts, ${scanResult.highActivityAgents?.length || 0} high-activity agents`,
      data: scanResult,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ SecurityAgent error: ${error.message}`
    };
  }
}
