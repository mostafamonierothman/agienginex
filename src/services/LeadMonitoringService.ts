
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
  private consecutiveFailures = 0;
  private maxFailures = 3;

  startMonitoring(callback?: (status: SystemStatus) => void) {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    this.statusCallback = callback || null;
    
    // Save monitoring state to localStorage for persistence
    localStorage.setItem('leadMonitoringActive', 'true');
    localStorage.setItem('leadMonitoringStartTime', new Date().toISOString());
    
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
      localStorage.removeItem('leadMonitoringActive');
      console.log('🛑 Lead monitoring service stopped');
    }
  }

  // Check if monitoring should auto-resume from localStorage
  checkAndResumeMonitoring() {
    const isActive = localStorage.getItem('leadMonitoringActive') === 'true';
    const startTime = localStorage.getItem('leadMonitoringStartTime');
    
    if (isActive && startTime) {
      const timeSinceStart = Date.now() - new Date(startTime).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (timeSinceStart < maxAge) {
        console.log('🔄 Resuming lead monitoring from previous session');
        this.startMonitoring();
        return true;
      } else {
        localStorage.removeItem('leadMonitoringActive');
        localStorage.removeItem('leadMonitoringStartTime');
      }
    }
    return false;
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
        errors: status.errors.length,
        consecutiveFailures: this.consecutiveFailures
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
        this.consecutiveFailures = 0; // Reset failure counter on success
      } else if (status.leadsGenerated === this.lastLeadCount) {
        this.consecutiveFailures++;
        
        if (status.leadsGenerated === 0) {
          console.log(`⚠️ [Auto-Monitor] No leads generated yet - failure count: ${this.consecutiveFailures}/${this.maxFailures}`);
          
          if (this.consecutiveFailures >= this.maxFailures) {
            console.log('🚨 [Auto-Monitor] Max failures reached - triggering aggressive recovery...');
            await this.triggerAggressiveRecovery();
          } else {
            await this.attemptRecovery();
          }
        }
      }

      // Handle critical errors
      if (status.systemHealth === 'critical') {
        console.log('🚨 [Auto-Monitor] Critical system issues detected:', status.errors);
        
        toast({
          title: "🚨 System Alert",
          description: `Critical issues: ${status.errors.slice(0, 2).join(', ')}`,
          variant: "destructive"
        });
        
        await this.triggerAggressiveRecovery();
      }

      // Call status callback if provided
      if (this.statusCallback) {
        this.statusCallback(status);
      }

    } catch (error) {
      console.error('❌ [Auto-Monitor] Monitoring error:', error);
      this.consecutiveFailures++;
      
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
    
    if (errors.length > 2 || this.consecutiveFailures >= this.maxFailures) {
      systemHealth = 'critical';
    } else if (errors.length > 0 || (leadsGenerated === 0 && agentsActive === 0) || this.consecutiveFailures > 0) {
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
      // Try to trigger emergency lead generation
      const recoveryResult = await this.triggerEmergencyLeadGeneration();
      
      if (recoveryResult.success) {
        console.log('✅ [Auto-Monitor] Recovery successful - emergency agents deployed');
        
        toast({
          title: "🔧 Auto-Recovery",
          description: "Emergency lead generation agents deployed",
        });
      } else {
        console.log('❌ [Auto-Monitor] Recovery failed:', recoveryResult.error);
      }
      
    } catch (error) {
      console.error('❌ [Auto-Monitor] Recovery attempt failed:', error);
    }
  }

  private async triggerAggressiveRecovery() {
    console.log('🚨 [Auto-Monitor] Triggering aggressive recovery after multiple failures...');
    
    try {
      // Clear any stuck tasks
      localStorage.removeItem('agent_tasks');
      
      // Trigger emergency deployment
      const { EmergencyAgentDeployerRunner } = await import('@/agents/EmergencyAgentDeployer');
      
      const deploymentResult = await EmergencyAgentDeployerRunner({
        input: {
          emergencyMode: true,
          targetLeads: 50,
          agentCount: 10,
          specialties: ['eye_surgery', 'dental_procedures'],
          targetRegion: 'Europe'
        }
      });

      if (deploymentResult.success) {
        console.log('✅ [Auto-Monitor] Aggressive recovery successful - emergency squad deployed');
        
        toast({
          title: "🚨 Emergency Recovery",
          description: "Emergency squad deployed after system failures",
        });
        
        this.consecutiveFailures = 0; // Reset failure counter
      } else {
        console.log('❌ [Auto-Monitor] Aggressive recovery failed:', deploymentResult.message);
        
        toast({
          title: "❌ Recovery Failed",
          description: "Manual intervention required",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ [Auto-Monitor] Aggressive recovery failed:', error);
    }
  }

  private async triggerEmergencyLeadGeneration(): Promise<{ success: boolean; error?: string }> {
    try {
      // Import and run emergency deployment
      const { agentTaskQueue } = await import('@/services/AgentTaskQueue');
      
      // Add emergency lead generation tasks
      const taskIds = await agentTaskQueue.addEmergencyLeadGenerationTasks(3);
      
      console.log(`🔧 [Auto-Recovery] Queued ${taskIds.length} emergency lead generation tasks`);
      return { success: true };
      
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Get current status without waiting for interval
  async getCurrentStatus(): Promise<SystemStatus> {
    return await this.getDetailedStatus();
  }

  // Check if monitoring is currently active
  isMonitoring(): boolean {
    return this.monitoringInterval !== null;
  }
}

export const leadMonitoringService = new LeadMonitoringService();

// Auto-resume monitoring on service load if it was previously active
leadMonitoringService.checkAndResumeMonitoring();
