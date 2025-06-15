
-- Create vector_memories table for AGI memory storage
CREATE TABLE IF NOT EXISTS public.vector_memories (
  id BIGSERIAL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agi_state table for persistent AGI state
CREATE TABLE IF NOT EXISTS public.agi_state (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create supervisor_queue table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.supervisor_queue (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  action TEXT NOT NULL,
  input TEXT,
  status TEXT NOT NULL,
  output TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  source TEXT,
  industry TEXT,
  location TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vector_memories_agent_id ON public.vector_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_vector_memories_created_at ON public.vector_memories(created_at);
CREATE INDEX IF NOT EXISTS idx_agi_state_key ON public.agi_state(key);
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_user_id ON public.supervisor_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_created_at ON public.supervisor_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.vector_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agi_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (AGI system needs full access)
CREATE POLICY "Allow all operations on vector_memories" ON public.vector_memories FOR ALL USING (true);
CREATE POLICY "Allow all operations on agi_state" ON public.agi_state FOR ALL USING (true);
CREATE POLICY "Allow all operations on supervisor_queue" ON public.supervisor_queue FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true);
