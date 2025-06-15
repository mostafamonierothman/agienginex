import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { supabase } from '@/integrations/supabase/client';
import { llmService } from '@/utils/llm';
import { EnhancedExecutiveAgentData } from './helpers/EnhancedExecutiveAgentData';
import { getFallbackActionPlan } from './helpers/EnhancedExecutiveAgentFallback';

export class EnhancedExecutiveAgent {
  async runner(context: AgentContext): Promise<AgentResponse> {
    try {
      const task = context.input?.task || context.input?.goal || 'Strategic planning and revenue generation';
      
      await sendChatUpdate('🎯 ExecutiveAgent: Analyzing connected systems and generating prioritized action plan...');
      
      // Analyze connected systems
      const connectedSystems = await this.analyzeConnectedSystems();
      const currentData = await this.gatherCurrentData();
      
      // Generate strategic action plan
      const actionPlan = await this.generatePrioritizedActionPlan(task, connectedSystems, currentData);
      
      await sendChatUpdate('📋 ExecutiveAgent: Strategic action plan generated with immediate revenue opportunities');
      
      return {
        success: true,
        message: `🎯 ExecutiveAgent Strategic Action Plan: ${actionPlan.summary}`,
        data: {
          actionPlan,
          connectedSystems,
          currentData,
          implementationSteps: actionPlan.steps,
          revenueProjections: actionPlan.revenueProjections
        },
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('EnhancedExecutiveAgent error:', error);
      return {
        success: false,
        message: `❌ ExecutiveAgent error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async analyzeConnectedSystems() {
    return {
      supabase: {
        status: 'connected',
        capabilities: ['Database', 'Authentication', 'Edge Functions', 'Email integration'],
        currentData: {
          leads: await EnhancedExecutiveAgentData.getLeadsCount(),
          campaigns: await EnhancedExecutiveAgentData.getCampaignsCount(),
          revenue: await EnhancedExecutiveAgentData.getTotalRevenue()
        }
      },
      openai: {
        status: 'connected',
        capabilities: ['Content generation', 'Lead qualification', 'Email personalization', 'Market analysis']
      },
      paypal: {
        status: 'configured',
        capabilities: ['Payment processing', 'Revenue collection', 'Transaction tracking']
      },
      cloudflare: {
        status: 'connected',
        capabilities: ['Global CDN', 'Edge computing', 'Security', 'Performance optimization']
      },
      resend: {
        status: 'configured',
        capabilities: ['Email delivery', 'Campaign management', 'Automated sequences']
      },
      hunter: {
        status: 'configured',
        capabilities: ['Lead discovery', 'Email verification', 'Contact enrichment']
      }
    };
  }

  private async gatherCurrentData() {
    return EnhancedExecutiveAgentData.gatherCurrentData();
  }

  private async generatePrioritizedActionPlan(task: string, systems: any, data: any) {
    const prompt = `
As an AI Executive Agent, create a PRIORITIZED ACTION PLAN for immediate lead generation and revenue today.

TASK: ${task}

CONNECTED SYSTEMS:
- Supabase (Database, Auth, Edge Functions) - ${data.totalLeads} leads
- OpenAI (Content generation, AI assistance)
- PayPal (Payment processing)
- Cloudflare (Edge computing, global reach)
- Resend (Email delivery) - ${data.activeCampaigns} active campaigns
- Hunter API (Lead discovery and verification)

CURRENT STATUS:
- Total leads in database: ${data.totalLeads}
- Active email campaigns: ${data.activeCampaigns}
- Recent business executions: ${data.recentExecutions}

Generate a JSON response with this structure:
{
  "summary": "Brief executive summary",
  "immediateActions": [
    {
      "priority": 1,
      "action": "Specific action to take",
      "system": "Which system to use",
      "timeframe": "How long it takes",
      "revenueImpact": "Expected revenue impact",
      "implementation": "How to execute"
    }
  ],
  "revenueProjections": {
    "today": "Expected revenue today",
    "week": "Expected revenue this week",
    "month": "Expected revenue this month"
  },
  "keyMetrics": ["metric1", "metric2", "metric3"]
}

Focus on IMMEDIATE actions that can generate leads and revenue TODAY using the available systems.
`;

    try {
      const response = await llmService.fetchLLMResponse(prompt, 'gpt-4o-mini');
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Error generating action plan:', error);
      return getFallbackActionPlan(data);
    }
  }
}

export async function EnhancedExecutiveAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const agent = new EnhancedExecutiveAgent();
  return await agent.runner(context);
}
