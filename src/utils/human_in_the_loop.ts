
import { supabase } from '@/integrations/supabase/client';

export interface ApprovalRequest {
  id?: string;
  user_id: string;
  agent_name: string;
  request_type: 'goal_proposal' | 'action_approval' | 'resource_request' | 'collaboration';
  description: string;
  proposed_action: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  created_at?: string;
}

export class HumanInTheLoopManager {
  static async submitForApproval(request: ApprovalRequest): Promise<string> {
    // Store approval request in supervisor_queue for now since approval_requests table doesn't exist
    const { data, error } = await supabase
      .from('supervisor_queue')
      .insert({
        user_id: request.user_id,
        agent_name: request.agent_name,
        action: 'approval_request',
        input: JSON.stringify({
          request_type: request.request_type,
          description: request.description,
          proposed_action: request.proposed_action,
          urgency: request.urgency
        }),
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Failed to submit approval request:', error);
      throw error;
    }

    console.log(`📋 Approval request submitted: ${request.agent_name} → ${request.description}`);
    return data.id;
  }

  static async approveRequest(requestId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('supervisor_queue')
      .update({ status: 'approved' })
      .eq('id', requestId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to approve request:', error);
      throw error;
    }

    console.log(`✅ Request approved: ${requestId}`);
  }

  static async rejectRequest(requestId: string, userId: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('supervisor_queue')
      .update({ 
        status: 'rejected',
        output: reason || 'User rejected'
      })
      .eq('id', requestId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to reject request:', error);
      throw error;
    }

    console.log(`❌ Request rejected: ${requestId}`);
  }

  static async getPendingApprovals(userId: string): Promise<ApprovalRequest[]> {
    const { data, error } = await supabase
      .from('supervisor_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('action', 'approval_request')
      .eq('status', 'pending')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Failed to fetch pending approvals:', error);
      return [];
    }

    // Transform supervisor_queue data to ApprovalRequest format
    return (data || []).map(item => {
      const input = item.input ? JSON.parse(item.input) : {};
      return {
        id: item.id,
        user_id: item.user_id || '',
        agent_name: item.agent_name || '',
        request_type: input.request_type || 'action_approval',
        description: input.description || 'Agent action request',
        proposed_action: input.proposed_action || 'Unknown action',
        urgency: input.urgency || 'medium',
        status: item.status as any || 'pending',
        created_at: item.timestamp
      };
    });
  }

  static async requiresHumanApproval(
    agentName: string,
    action: string,
    context: any
  ): Promise<boolean> {
    // Define rules for when human approval is required
    const highRiskActions = [
      'delete_data',
      'external_api_call',
      'financial_transaction',
      'system_modification',
      'user_communication'
    ];

    const actionType = context.action_type || 'unknown';
    const resourceValue = context.resource_value || 0;
    const userImpact = context.user_impact || 'low';

    return (
      highRiskActions.includes(actionType) ||
      resourceValue > 1000 ||
      userImpact === 'high' ||
      userImpact === 'critical'
    );
  }
}
