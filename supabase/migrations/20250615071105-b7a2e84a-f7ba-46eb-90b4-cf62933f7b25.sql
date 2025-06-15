
-- Ensure 'api' schema exists
CREATE SCHEMA IF NOT EXISTS api;

-- Move all AGI tables from public to api schema
ALTER TABLE IF EXISTS public.vector_memories SET SCHEMA api;
ALTER TABLE IF EXISTS public.agi_state SET SCHEMA api;
ALTER TABLE IF EXISTS public.agent_memory SET SCHEMA api;
ALTER TABLE IF EXISTS public.agi_goals_enhanced SET SCHEMA api;
ALTER TABLE IF EXISTS public.supervisor_queue SET SCHEMA api;
ALTER TABLE IF EXISTS public.leads SET SCHEMA api;
ALTER TABLE IF EXISTS public.email_campaigns SET SCHEMA api;
ALTER TABLE IF EXISTS public.email_logs SET SCHEMA api;
ALTER TABLE IF EXISTS public.follow_ups SET SCHEMA api;

-- Ensure permissions are correct for Supabase and RLS/Policies are preserved

-- Fix indexes for AGI state table if needed (recreate them in API schema)
DO $$
DECLARE
  idx TEXT;
BEGIN
  FOR idx IN SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename in (
    'vector_memories','agi_state','agent_memory','agi_goals_enhanced',
    'supervisor_queue','leads','email_campaigns','email_logs','follow_ups'
  )
  LOOP
    EXECUTE 'DROP INDEX IF EXISTS public.' || idx;
  END LOOP;
END$$;

-- Optional: Drop now-empty public tables (only if you're sure all app code is migrated!)
-- DROP TABLE IF EXISTS public.vector_memories CASCADE;
-- DROP TABLE IF EXISTS public.agi_state CASCADE;
-- DROP TABLE IF EXISTS public.agent_memory CASCADE;
-- DROP TABLE IF EXISTS public.agi_goals_enhanced CASCADE;
-- DROP TABLE IF EXISTS public.supervisor_queue CASCADE;
-- DROP TABLE IF EXISTS public.leads CASCADE;
-- DROP TABLE IF EXISTS public.email_campaigns CASCADE;
-- DROP TABLE IF EXISTS public.email_logs CASCADE;
-- DROP TABLE IF EXISTS public.follow_ups CASCADE;

-- Double-check: grant all privileges (for Supabase service role)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api TO authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA api TO service_role;

-- Enable RLS on key tables if required
ALTER TABLE api.vector_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.agi_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.agi_goals_enhanced ENABLE ROW LEVEL SECURITY;

-- You may need to recreate your RLS policies if they were not transferred. Review policies after migration!
