
-- Step 1: Create the missing vector_memories table (for vector memory storage)

CREATE TABLE IF NOT EXISTS public.vector_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id text NOT NULL,
  content text NOT NULL,
  embedding jsonb NOT NULL,
  source text,
  importance float DEFAULT 0.5,
  tags text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Index for fast access by agent_id
CREATE INDEX IF NOT EXISTS idx_vector_memories_agent_id ON public.vector_memories(agent_id);

-- Index for full text search (optional)
CREATE INDEX IF NOT EXISTS idx_vector_memories_content ON public.vector_memories USING GIN (to_tsvector('english', content));

-- (Optional) You may enable RLS later if implementing authentication.
