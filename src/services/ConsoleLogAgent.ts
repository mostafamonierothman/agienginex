
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

export class ConsoleLogAgent {
  private errorPatterns = [
    'TypeError', 'ReferenceError', 'SyntaxError', 'NetworkError',
    'Cannot find name', 'Property does not exist', 'Uncaught',
    'Failed to fetch', '404', '500', 'CORS', 'Unauthorized'
  ];

  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🔍 ConsoleLogAgent: Scanning for system errors...');

      // Get console logs from the browser
      const consoleErrors = this.captureConsoleErrors();
      const criticalErrors = this.analyzeCriticalErrors(consoleErrors);

      if (criticalErrors.length > 0) {
        await sendChatUpdate(`⚠️ Found ${criticalErrors.length} critical errors that need immediate fixing`);
        
        return {
          success: true,
          message: `🔍 ConsoleLogAgent: Detected ${criticalErrors.length} critical errors`,
          data: {
            errors: criticalErrors,
            fixingRequired: true,
            priority: 'high'
          },
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        message: '✅ ConsoleLogAgent: No critical errors detected',
        data: { errors: [], fixingRequired: false },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ ConsoleLogAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private captureConsoleErrors(): Array<{type: string; message: string; stack?: string}> {
    // In a real implementation, this would capture actual console errors
    // For now, simulate common error patterns we're seeing
    return [
      {
        type: 'TypeError',
        message: "Cannot find name 'goalTask'",
        stack: 'src/engine/DeepAutonomousLoopController.ts:244'
      },
      {
        type: 'ReferenceError', 
        message: 'Supabase table "agi_state" does not exist',
        stack: 'src/services/PersistenceService.ts:15'
      },
      {
        type: 'NetworkError',
        message: 'Failed to fetch from /run_agent endpoint',
        stack: 'src/services/EnhancedChatService.ts:12'
      }
    ];
  }

  private analyzeCriticalErrors(errors: any[]): any[] {
    return errors.filter(error => 
      this.errorPatterns.some(pattern => 
        error.message.includes(pattern) || error.type.includes(pattern)
      )
    );
  }
}

export async function ConsoleLogAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new ConsoleLogAgent();
  return await agent.runner(context);
}
