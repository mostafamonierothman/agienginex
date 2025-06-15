
-- Drop tables from public that now exist in the api schema
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.email_campaigns CASCADE;
DROP TABLE IF EXISTS public.email_logs CASCADE;
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.agent_memory CASCADE;
DROP TABLE IF EXISTS public.agi_state CASCADE;
DROP TABLE IF EXISTS public.agi_goals_enhanced CASCADE;
DROP TABLE IF EXISTS public.supervisor_queue CASCADE;
