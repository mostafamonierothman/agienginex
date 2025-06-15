
-- 1. supervisor_queue (logs all agent actions)
CREATE TABLE IF NOT EXISTS public.supervisor_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text,
  agent_name text,
  action text,
  input text,
  status text,
  output text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.supervisor_queue ENABLE ROW LEVEL SECURITY;

-- Allow ALL for now (for system agents; you can refine later)
CREATE POLICY "Allow all supervisor_queue" ON public.supervisor_queue
  FOR ALL USING (true);

-- 2. leads (basic CRM leads table)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  last_name text,
  company text,
  job_title text,
  phone text,
  linkedin_url text,
  source text,
  industry text,
  location text,
  status text DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all leads" ON public.leads
  FOR ALL USING (true);

-- 3. agent_memory (persistent key-value memory for agents)
CREATE TABLE IF NOT EXISTS public.agent_memory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text,
  agent_name text,
  memory_key text,
  memory_value text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all agent_memory" ON public.agent_memory
  FOR ALL USING (true);

-- 4. agi_goals_enhanced (goal-management table, improved version)
CREATE TABLE IF NOT EXISTS public.agi_goals_enhanced (
  goal_id serial PRIMARY KEY,
  goal_text text,
  status text NOT NULL DEFAULT 'active',
  priority integer NOT NULL DEFAULT 5,
  progress_percentage integer NOT NULL DEFAULT 0,
  timestamp timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agi_goals_enhanced ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all agi_goals_enhanced" ON public.agi_goals_enhanced
  FOR ALL USING (true);
