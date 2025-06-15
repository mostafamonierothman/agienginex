
-- Create agi_goals table to fix schema mismatch (parity with agi_goals_enhanced)

CREATE TABLE IF NOT EXISTS public.agi_goals (
  id SERIAL PRIMARY KEY,
  goal_text TEXT,
  status public.goal_status NOT NULL DEFAULT 'active',
  priority INT DEFAULT 5,
  progress_percentage INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_agi_goals_status ON public.agi_goals (status);

-- Enable Row Level Security and allow all for now (update as needed)
ALTER TABLE public.agi_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on agi_goals" ON public.agi_goals FOR ALL USING (true);

