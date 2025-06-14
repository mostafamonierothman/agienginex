
/**
 * Main application DB types based on latest schema rebuild (2025-06-14)
 */

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'replied'
  | 'qualified'
  | 'converted'
  | 'unsubscribed';

export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  linkedin_url?: string;
  source: string;
  industry?: string;
  location?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  target_industry?: string;
  status: CampaignStatus;
  emails_sent: number;
  emails_opened: number;
  replies_received: number;
  created_at: string;
  updated_at: string;
}

export type EmailStatus = 'sent' | 'delivered' | 'opened' | 'replied' | 'bounced' | 'failed';

export interface EmailLog {
  id: string;
  lead_id: string;
  campaign_id: string;
  email: string;
  subject: string;
  content: string;
  status: EmailStatus;
  resend_email_id?: string;
  sent_at: string;
  opened_at?: string;
  replied_at?: string;
}

export type FollowUpType = 'email' | 'call' | 'meeting' | 'note';

export interface FollowUp {
  id: string;
  lead_id: string;
  type: FollowUpType;
  content: string;
  scheduled_for?: string;
  completed_at?: string;
  created_at: string;
}

export interface AgentMemory {
  id: string;
  user_id?: string;
  agent_name?: string;
  memory_key?: string;
  memory_value?: string;
  timestamp: string;
}

export type GoalStatus = 'active' | 'completed';

export interface AGIGoalEnhanced {
  goal_id: number;
  goal_text?: string;
  status: GoalStatus;
  priority: number;
  progress_percentage: number;
  timestamp: string;
}

export interface AGIState {
  id: string;
  key: string;
  state: Record<string, any>;
  updated_at: string;
}

export interface SupervisorQueue {
  id: string;
  user_id?: string;
  agent_name?: string;
  action?: string;
  input?: string;
  status?: string;
  output?: string;
  timestamp: string;
}
