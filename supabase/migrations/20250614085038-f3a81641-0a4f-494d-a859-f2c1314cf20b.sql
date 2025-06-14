
-- 1. ENUMS FOR STATUS FIELDS
DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'replied', 'qualified', 'converted', 'unsubscribed');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE public.campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE public.email_status AS ENUM ('sent', 'delivered', 'opened', 'replied', 'bounced', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE public.follow_up_type AS ENUM ('email', 'call', 'meeting', 'note');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
  CREATE TYPE public.goal_status AS ENUM ('active', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. DROP EXISTING RELEVANT TABLES (preserving Supabase reserved schemas)
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.email_campaigns CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.agent_memory CASCADE;
DROP TABLE IF EXISTS public.agi_state CASCADE;
DROP TABLE IF EXISTS public.agi_goals_enhanced CASCADE;
DROP TABLE IF EXISTS public.supervisor_queue CASCADE;

-- 3. RECREATE TABLES WITH STRICTER SCHEMA

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  linkedin_url TEXT,
  source TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT NOT NULL,
  target_industry TEXT,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  emails_sent INT DEFAULT 0,
  emails_opened INT DEFAULT 0,
  replies_received INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status public.email_status NOT NULL DEFAULT 'sent',
  resend_email_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  opened_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ
);

CREATE TABLE public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  type public.follow_up_type NOT NULL,
  content TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  agent_name TEXT,
  memory_key TEXT,
  memory_value TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.agi_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  state JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.agi_goals_enhanced (
  goal_id SERIAL PRIMARY KEY,
  goal_text TEXT,
  status public.goal_status NOT NULL DEFAULT 'active',
  priority INT DEFAULT 5,
  progress_percentage INT DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.supervisor_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  agent_name TEXT,
  action TEXT,
  input TEXT,
  status TEXT,
  output TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_email_logs_lead_id ON public.email_logs (lead_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON public.email_logs (campaign_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups (lead_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_name ON public.agent_memory (agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_memory_memory_key ON public.agent_memory (memory_key);
CREATE INDEX IF NOT EXISTS idx_agi_goals_enhanced_status ON public.agi_goals_enhanced (status);

-- 5. ROW LEVEL SECURITY - Enable RLS, allow all for now
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agi_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agi_goals_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_queue ENABLE ROW LEVEL SECURITY;

-- Public access policies (you can update later for restricting by user)
CREATE POLICY "Allow all on leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow all on email_campaigns" ON public.email_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all on email_logs" ON public.email_logs FOR ALL USING (true);
CREATE POLICY "Allow all on follow_ups" ON public.follow_ups FOR ALL USING (true);
CREATE POLICY "Allow all on agent_memory" ON public.agent_memory FOR ALL USING (true);
CREATE POLICY "Allow all on agi_state" ON public.agi_state FOR ALL USING (true);
CREATE POLICY "Allow all on agi_goals_enhanced" ON public.agi_goals_enhanced FOR ALL USING (true);
CREATE POLICY "Allow all on supervisor_queue" ON public.supervisor_queue FOR ALL USING (true);

