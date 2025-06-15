
-- Fix vector_memories schema & seed core agent and goal, with disambiguated variable names

-- (Keep previous ALTER and UPDATE statements: unchanged)

-- Step 2: Seed system with a basic autonomous agent if table is empty
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.agent_registry) = 0 THEN
    INSERT INTO public.agent_registry (agent_name, agent_type, status)
    VALUES 
      ('core_loop_agent', 'autonomous_core', 'stopped');
  END IF;
END $$;

-- Version row for core agent (disambiguate variable in query)
DO $$
DECLARE v_agent_id UUID;
BEGIN
  SELECT id INTO v_agent_id FROM public.agent_registry WHERE agent_name = 'core_loop_agent' LIMIT 1;
  IF v_agent_id IS NOT NULL AND (SELECT COUNT(*) FROM public.agent_versions WHERE agent_id = v_agent_id) = 0 THEN
    INSERT INTO public.agent_versions (agent_id, file_path, code, version_number, commit_message)
    VALUES (
      v_agent_id, 
      'agents/core_loop_agent.ts', 
      'export class CoreLoopAgent { run() { /* ... */ } stop() { /* ... */ } status() { return \"idle\"; } }', 
      1, 
      'Seed initial core_loop_agent'
    );
  END IF;
END $$;

-- Seed at least one AGI goal
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.agi_goals) = 0 THEN
    INSERT INTO public.agi_goals (goal_text, status, priority, progress_percentage)
    VALUES ('Build a functional AGI business system', 'active', 1, 0);
  END IF;
END $$;
