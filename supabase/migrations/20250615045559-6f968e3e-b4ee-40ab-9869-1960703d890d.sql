
-- Table for agent management and live registry
CREATE TABLE IF NOT EXISTS public.agent_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  agent_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'stopped', -- running/stopped/failed
  last_started_at TIMESTAMPTZ,
  last_stopped_at TIMESTAMPTZ,
  performance_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for versioned agent code and changes
CREATE TABLE IF NOT EXISTS public.agent_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agent_registry(id),
  file_path TEXT NOT NULL,
  code TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  commit_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (optional, leave open if programmatic control only is needed)
ALTER TABLE public.agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_versions ENABLE ROW LEVEL SECURITY;

-- Very open policy for system control (adjust as needed)
CREATE POLICY "Allow all agent registry access" ON public.agent_registry FOR ALL USING (true);
CREATE POLICY "Allow all agent versioning access" ON public.agent_versions FOR ALL USING (true);
