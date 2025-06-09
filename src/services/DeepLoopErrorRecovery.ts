
import { ErrorRecoveryAgent } from '@/agents/ErrorRecoveryAgent';
import { SupervisorAgent } from '@/agents/SupervisorAgent';

export class DeepLoopErrorRecovery {
  private supervisorAgent: SupervisorAgent;
  private errorRecoveryAgent: ErrorRecoveryAgent;
  private consecutiveErrors: number = 0;
  private errorRecoveryMode: boolean = false;

  constructor() {
    this.supervisorAgent = new SupervisorAgent();
    this.errorRecoveryAgent = new ErrorRecoveryAgent();
  }

  async checkAndRecoverErrors(cycle: number, setLogs: Function): Promise<{
    errorRecoveryMode: boolean;
    consecutiveErrors: number;
    newLoopSpeed?: number;
  }> {
    try {
      console.log('[ERROR RECOVERY] Running error detection and recovery...');
      
      const supervisorResponse = await this.supervisorAgent.runner({
        user_id: 'deep_loop_supervisor',
        input: { 
          cycle,
          errorRecoveryMode: this.errorRecoveryMode,
          consecutiveErrors: this.consecutiveErrors
        }
      });

      if (supervisorResponse.data?.errors_detected > 0) {
        this.errorRecoveryMode = true;
        
        setLogs(prev => [...prev, {
          agent: 'SupervisorAgent',
          action: 'Error Recovery',
          result: `Detected ${supervisorResponse.data.errors_detected} errors - initiating recovery`
        }]);

        // Execute error recovery
        try {
          const recoveryResponse = await this.errorRecoveryAgent.runner({
            user_id: 'deep_loop_recovery',
            input: {
              errorType: 'system_error',
              errorDetails: supervisorResponse.data
            }
          });

          setLogs(prev => [...prev, {
            agent: 'ErrorRecoveryAgent',
            action: 'System Recovery',
            result: recoveryResponse.message || 'Recovery completed'
          }]);

          // Reset consecutive errors on successful recovery
          this.consecutiveErrors = Math.max(0, this.consecutiveErrors - 1);
        } catch (recoveryError) {
          console.error('[ERROR RECOVERY] Recovery failed:', recoveryError);
          this.consecutiveErrors++;
        }

        return {
          errorRecoveryMode: this.errorRecoveryMode,
          consecutiveErrors: this.consecutiveErrors,
          newLoopSpeed: 8000 // Slow down during recovery
        };
      } else {
        this.errorRecoveryMode = false;
        this.consecutiveErrors = 0;
        
        return {
          errorRecoveryMode: this.errorRecoveryMode,
          consecutiveErrors: this.consecutiveErrors,
          newLoopSpeed: 1000 // Speed up after recovery
        };
      }
    } catch (supervisorError) {
      console.error('[ERROR RECOVERY] Supervisor error:', supervisorError);
      this.errorRecoveryMode = true;
      this.consecutiveErrors++;
      
      return {
        errorRecoveryMode: this.errorRecoveryMode,
        consecutiveErrors: this.consecutiveErrors
      };
    }
  }

  handleAgentError(agentName: string, error: any, agentPriority: Record<string, number>): void {
    console.error(`[ERROR RECOVERY] Agent ${agentName} error:`, error);
    
    this.consecutiveErrors++;
    this.errorRecoveryMode = true;
    
    // Reduce agent priority on error
    agentPriority[agentName] = Math.max(1, (agentPriority[agentName] || 1) - 2);
    
    // Trigger error recovery mode
    if (this.consecutiveErrors >= 3) {
      console.log('[ERROR RECOVERY] Entering error recovery mode due to consecutive failures');
    }
  }

  getErrorRecoveryMode(): boolean {
    return this.errorRecoveryMode;
  }

  getConsecutiveErrors(): number {
    return this.consecutiveErrors;
  }
}
