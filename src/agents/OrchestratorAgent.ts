
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { SupervisorAgentRunner } from '@/agents/SupervisorAgent';
import { SystemHealthAgentRunner } from '@/services/SystemHealthAgent';
import { DatabaseErrorAgentRunner } from '@/services/DatabaseErrorAgent';
import { DatabaseRecoveryService } from '@/services/DatabaseRecoveryService';
import { EmergencyAgentDeployerRunner } from './EmergencyAgentDeployer';

export class OrchestratorAgent {
  async runOrchestration(context: AgentContext): Promise<AgentResponse> {
    try {
      await sendChatUpdate('🛠️ OrchestratorAgent: Starting full system initialization...');

      // Step 1: Database Health Check & Repair
      await sendChatUpdate('1️⃣ Checking database health...');
      const dbHealthy = await DatabaseRecoveryService.checkAndRepairDatabase();
      if (!dbHealthy) {
        await sendChatUpdate('⚠️ Database issues detected, attempting deeper scan...');
        await DatabaseErrorAgentRunner(context);
      }
      await sendChatUpdate('✅ Database health check complete.');

      // Step 2: System Health Check
      await sendChatUpdate('2️⃣ Running system-wide health assessment...');
      const healthResponse = await SystemHealthAgentRunner(context);
      if (!healthResponse.success || healthResponse.data?.criticalIssues > 0) {
        await sendChatUpdate(`⚠️ System health issues found: ${healthResponse.message}`);
        // Don't halt, but log. Supervisor will see this.
      }
      await sendChatUpdate('✅ System health assessment complete.');

      // Step 3: Activate Supervisor to manage the agent ecosystem
      await sendChatUpdate('3️⃣ Activating SupervisorAgent to manage ecosystem...');
      const supervisorResponse = await SupervisorAgentRunner(context);
      if (!supervisorResponse.success) {
        throw new Error(`SupervisorAgent failed to start: ${supervisorResponse.message}`);
      }
      await sendChatUpdate('✅ SupervisorAgent is active and monitoring.');

      // Step 4: Deploy Maximum Capacity Agents
      await sendChatUpdate('4️⃣ Deploying full agent squad for maximum capacity operations...');
      const emergencyDeploymentResponse = await EmergencyAgentDeployerRunner(context);
      if (!emergencyDeploymentResponse.success) {
        // Log this but don't fail the whole orchestration
        await sendChatUpdate(`⚠️ Maximum capacity deployment issue: ${emergencyDeploymentResponse.message}`);
      }
      await sendChatUpdate('✅ Maximum capacity agent deployment complete.');

      // === ORCHESTRATION COMPLETE ===
      await sendChatUpdate('🏁 Full system initialization orchestrated successfully.');

      return {
        success: true,
        message: 'System initialization plan executed successfully. Supervisor is now active and maximum capacity agents are deployed.',
        data: {
          health: healthResponse.data,
          supervisor: supervisorResponse.data,
          deployment: emergencyDeploymentResponse.data,
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      await sendChatUpdate(`❌ Orchestrator error during initialization: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        success: false,
        message: `❌ Orchestration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }
}

export async function OrchestratorAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const orchestrator = new OrchestratorAgent();
  return await orchestrator.runOrchestration(context);
}
