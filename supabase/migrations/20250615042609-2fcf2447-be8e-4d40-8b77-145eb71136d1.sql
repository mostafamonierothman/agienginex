
-- Step 2: Memory Migration to Supabase - Create a new vector_memories table for persistent vector memory.

CREATE TABLE IF NOT EXISTS public.vector_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding JSONB NOT NULL,
  source TEXT,
  importance FLOAT DEFAULT 0.5,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index agent_id for fast query
CREATE INDEX IF NOT EXISTS idx_vector_memories_agent_id ON public.vector_memories(agent_id);

-- Index content for search (future optimization)
CREATE INDEX IF NOT EXISTS idx_vector_memories_content ON public.vector_memories USING GIN (to_tsvector('english', content));

-- Enable RLS for future security if needed (currently allow open access for backend operations)
-- ALTER TABLE public.vector_memories ENABLE ROW LEVEL SECURITY;

-- (You may enable INSERT/SELECT/UPDATE policies after authentication is implemented)

