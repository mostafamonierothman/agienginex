
-- Create the missing agi_state table for cross-agent state persistence

CREATE TABLE IF NOT EXISTS public.agi_state (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  state jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.agi_state ENABLE ROW LEVEL SECURITY;

-- Allow ALL for now (for agents and system use; you should restrict in future)
CREATE POLICY "Allow all agi_state" ON public.agi_state
  FOR ALL USING (true);

