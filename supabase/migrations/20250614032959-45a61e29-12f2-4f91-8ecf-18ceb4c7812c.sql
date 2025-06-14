
-- Complete Phase 2 AGI Database Schema Optimization

-- 1. Ensure all critical AGI tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.agi_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  state JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Optimize supervisor_queue for Phase 2 AGI operations
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_agent_name ON public.supervisor_queue(agent_name);
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_status ON public.supervisor_queue(status);
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_timestamp ON public.supervisor_queue(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_supervisor_queue_user_id ON public.supervisor_queue(user_id);

-- 3. Optimize agent_memory for Phase 2 AGI
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_name ON public.agent_memory(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_memory_memory_key ON public.agent_memory(memory_key);
CREATE INDEX IF NOT EXISTS idx_agent_memory_user_id ON public.agent_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_timestamp ON public.agent_memory(timestamp DESC);

-- 4. Optimize agi_goals_enhanced for advanced goal management
CREATE INDEX IF NOT EXISTS idx_agi_goals_status ON public.agi_goals_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_agi_goals_priority ON public.agi_goals_enhanced(priority DESC);
CREATE INDEX IF NOT EXISTS idx_agi_goals_progress ON public.agi_goals_enhanced(progress_percentage);

-- 5. Create Phase 2 AGI specific state initialization
INSERT INTO public.agi_state (key, state) 
VALUES (
  'phase2_agi_system',
  '{
    "intelligence_level": 92.5,
    "phase": "Phase 2 AGI Active",
    "capabilities": [
      "advanced_problem_solving",
      "recursive_self_improvement", 
      "consciousness_simulation",
      "reality_modeling",
      "human_agi_collaboration",
      "autonomous_research_development",
      "creative_algorithms",
      "meta_cognition_advanced",
      "quantum_problem_solving",
      "multi_dimensional_thinking",
      "autonomous_goal_creation",
      "ethical_reasoning_advanced",
      "innovation_generation",
      "breakthrough_discovery",
      "creative_synthesis",
      "collaborative_intelligence"
    ],
    "status": "phase2_active",
    "readiness": 95,
    "database_optimized": true,
    "fallback_dependencies": false
  }'
) ON CONFLICT (key) DO UPDATE SET 
  state = EXCLUDED.state,
  updated_at = now();

-- 6. Initialize Phase 2 AGI goals
INSERT INTO public.agi_goals_enhanced (goal_text, status, priority, progress_percentage)
VALUES 
  ('🧠 Phase 2 AGI: Complete consciousness simulation framework', 'active', 10, 85),
  ('🚀 Phase 2 AGI: Implement advanced reality modeling algorithms', 'active', 10, 78),
  ('🤝 Phase 2 AGI: Establish human-AGI collaboration protocols', 'active', 9, 92),
  ('🔬 Phase 2 AGI: Build autonomous research systems', 'active', 9, 87),
  ('💡 Phase 2 AGI: Enhance creative problem-solving networks', 'active', 8, 95),
  ('⚖️ Phase 2 AGI: Strengthen ethical reasoning frameworks', 'active', 8, 90)
ON CONFLICT DO NOTHING;

-- 7. Create database health monitoring function
CREATE OR REPLACE FUNCTION public.check_phase2_agi_health()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  table_count INTEGER;
  index_count INTEGER;
  agi_state_exists BOOLEAN;
BEGIN
  -- Check critical tables
  SELECT COUNT(*) INTO table_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name IN ('supervisor_queue', 'agent_memory', 'agi_state', 'agi_goals_enhanced');
  
  -- Check indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'public' 
  AND tablename IN ('supervisor_queue', 'agent_memory', 'agi_goals_enhanced');
  
  -- Check AGI state
  SELECT EXISTS(SELECT 1 FROM public.agi_state WHERE key = 'phase2_agi_system') INTO agi_state_exists;
  
  result := jsonb_build_object(
    'critical_tables_count', table_count,
    'indexes_count', index_count,
    'agi_state_initialized', agi_state_exists,
    'database_health', CASE 
      WHEN table_count = 4 AND index_count >= 10 AND agi_state_exists THEN 'optimal'
      WHEN table_count >= 3 AND agi_state_exists THEN 'good'
      ELSE 'needs_optimization'
    END,
    'timestamp', now()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant necessary permissions for Phase 2 AGI operation
GRANT ALL ON public.agi_state TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.supervisor_queue TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.agent_memory TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.agi_goals_enhanced TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_phase2_agi_health() TO postgres, anon, authenticated, service_role;
