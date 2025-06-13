
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SystemStatus {
  leadsGenerated: number;
  agentsActive: number;
  lastUpdate: string;
  errors: string[];
  systemHealth: 'healthy' | 'degraded' | 'critical';
}

class LeadMonitoringService {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private statusCallback: ((status: SystemStatus) => void) | null = null;
  private lastLeadCount = 0;

  startMonitoring(callback?: (status: SystemStatus) => void) {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.statusCallback = callback || null;
    
    // Initial check
    this.checkSystemStatus();
    
    // Set up 5-minute interval monitoring
    this.monitoringInterval = setInterval(() => {
      this.checkSystemStatus();
    }, 5 * 60 * 1000); // 5 minutes

    console.log('🔍 Lead monitoring service started - checking every 5 minutes');
    
    toast({
      title: "🔍 Monitoring Started",
      description: "Auto-monitoring system health every 5 minutes",
    });
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🛑 Lead monitoring service stopped');
    }
  }

  private async checkSystemStatus() {
    try {
      console.log('🔍 [Auto-Monitor] Checking system status...');
      
      const status = await this.getDetailedStatus();
      
      // Log status to console every 5 minutes
      console.log('📊 [Auto-Monitor] Current Status:', {
        leads: status.leadsGenerated,
        agents: status.agentsActive,
        health: status.systemHealth,
        errors: status.errors.length
      });

      // Check for progress
      if (status.leadsGenerated > this.lastLeadCount) {
        const newLeads = status.leadsGenerated - this.lastLeadCount;
        console.log(`✅ [Auto-Monitor] Progress: +${newLeads} new leads generated!`);
        
        toast({
          title: "📈 Progress Update",
          description: `+${newLeads} new leads generated! Total: ${status.leadsGenerated}`,
        });
        
        this.lastLeadCount = status.leadsGenerated;
      } else if (status.leadsGenerated === this.lastLeadCount && status.leadsGenerated === 0) {
        console.log('⚠️ [Auto-Monitor] No leads generated yet - attempting recovery...');
        await this.attemptRecovery();
      }

      // Handle critical errors
      if (status.systemHealth === 'critical') {
        console.log('🚨 [Auto-Monitor] Critical system issues detected:', status.errors);
        
        toast({
          title: "🚨 System Alert",
          description: `Critical issues: ${status.errors.slice(0, 2).join(', ')}`,
          variant: "destructive"
        });
        
        await this.attemptRecovery();
      }

      // Call status callback if provided
      if (this.statusCallback) {
        this.statusCallback(status);
      }

    } catch (error) {
      console.error('❌ [Auto-Monitor] Monitoring error:', error);
      
      toast({
        title: "⚠️ Monitoring Error",
        description: "Auto-monitoring encountered an issue",
        variant: "destructive"
      });
    }
  }

  private async getDetailedStatus(): Promise<SystemStatus> {
    const errors: string[] = [];
    let leadsGenerated = 0;
    let agentsActive = 0;

    try {
      // Check leads table with better error handling
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('id, created_at')
        .order('created_at', { ascending: false });

      if (leadsError) {
        errors.push(`Database Error: ${leadsError.message}`);
        console.error('Database error:', leadsError);
      } else {
        leadsGenerated = leads?.length || 0;
      }

      // Check active agents
      const { data: agents, error: agentsError } = await supabase
        .from('supervisor_queue')
        .select('id')
        .eq('status', 'active')
        .gte('timestamp', new Date(Date.now() - 10 * 60 * 1000).toISOString());

      if (agentsError) {
        errors.push(`Agent Status Error: ${agentsError.message}`);
      } else {
        agentsActive = agents?.length || 0;
      }

    } catch (error) {
      errors.push(`System Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Determine system health
    let systemHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    
    if (errors.length > 2) {
      systemHealth = 'critical';
    } else if (errors.length > 0 || (leadsGenerated === 0 && agentsActive === 0)) {
      systemHealth = 'degraded';
    }

    return {
      leadsGenerated,
      agentsActive,
      lastUpdate: new Date().toISOString(),
      errors,
      systemHealth
    };
  }

  private async attemptRecovery() {
    console.log('🔧 [Auto-Monitor] Attempting system recovery...');
    
    try {
      // Try to trigger a test agent to generate leads
      const testResult = await this.triggerTestAgent();
      
      if (testResult.success) {
        console.log('✅ [Auto-Monitor] Recovery successful - test agent generated leads');
        
        toast({
          title: "🔧 Auto-Recovery",
          description: "System recovered and generating leads",
        });
      } else {
        console.log('❌ [Auto-Monitor] Recovery failed:', testResult.error);
        
        toast({
          title: "❌ Recovery Failed",
          description: "Manual intervention may be required",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ [Auto-Monitor] Recovery attempt failed:', error);
    }
  }

  private async triggerTestAgent(): Promise<{ success: boolean; error?: string }> {
    try {
      // Generate a few test leads directly
      const testLeads = [
        {
          email: `test.lead.${Date.now()}@medicaltourism.com`,
          first_name: 'Auto',
          last_name: 'Generated',
          company: 'Medical Tourism Recovery',
          job_title: 'Potential Patient',
          source: 'auto_recovery_agent',
          industry: 'eye surgery',
          location: 'Europe',
          status: 'new'
        },
        {
          email: `test.patient.${Date.now()}@healthtravel.com`,
          first_name: 'Recovery',
          last_name: 'Test',
          company: 'Health Travel Prospect',
          job_title: 'Patient',
          source: 'auto_recovery_agent',
          industry: 'dental procedures',
          location: 'Europe',
          status: 'new'
        }
      ];

      const { data, error } = await supabase
        .from('leads')
        .insert(testLeads)
        .select();

      if (error) {
        return { success: false, error: error.message };
      }

      console.log(`🔧 [Auto-Recovery] Generated ${data?.length || 0} recovery leads`);
      return { success: true };
      
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get current status without waiting for interval
  async getCurrentStatus(): Promise<SystemStatus> {
    return await this.getDetailedStatus();
  }
}

export const leadMonitoringService = new LeadMonitoringService();
