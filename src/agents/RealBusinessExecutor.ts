
import { sendChatUpdate } from '@/utils/sendChatUpdate';

export class RealBusinessExecutor {
  async executeBusinessTask(taskType: string, parameters: any) {
    try {
      await sendChatUpdate(`💼 RealBusinessExecutor: Starting ${taskType} with real business integration...`);
      
      // Call the real-business-executor edge function
      const response = await fetch('/functions/v1/real-business-executor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType,
          parameters
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await sendChatUpdate(`✅ RealBusinessExecutor: ${result.message}`);
        await sendChatUpdate(`📊 Business Metrics: ${JSON.stringify(result.data)}`);
        
        return {
          success: true,
          message: result.message,
          data: {
            actualRevenue: result.data?.revenue_potential || 0,
            leadsGenerated: result.data?.leads_generated || 0,
            emailsSent: result.data?.emails_sent || 0,
            result: result.data
          }
        };
      } else {
        throw new Error(result.message || 'Business execution failed');
      }

    } catch (error) {
      await sendChatUpdate(`❌ RealBusinessExecutor: Failed - ${error.message}`);
      return {
        success: false,
        message: `Business execution failed: ${error.message}`
      };
    }
  }
}

export const realBusinessExecutor = new RealBusinessExecutor();
