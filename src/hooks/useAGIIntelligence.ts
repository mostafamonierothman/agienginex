import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AGOCoreLoopAgentRunner } from '@/agents/AGOCoreLoopAgent';

interface AGIState {
  intelligenceLevel: number;
  isLearning: boolean;
  autonomousMode: boolean;
  goals: string[];
  achievements: string[];
  errorCount: number;
  learningRate: number;
}

export const useAGIIntelligence = () => {
  const [agiState, setAgiState] = useState<AGIState>({
    intelligenceLevel: 0,
    isLearning: false,
    autonomousMode: false,
    goals: ['generate_leads', 'optimize_performance', 'self_improve', 'enhance_meta_cognition'],
    achievements: [],
    errorCount: 0,
    learningRate: 1.0
  });

  const [isRunning, setIsRunning] = useState(false);

  const increaseIntelligence = useCallback((amount: number = 1) => {
    setAgiState(prev => ({
      ...prev,
      intelligenceLevel: Math.min(prev.intelligenceLevel + amount * prev.learningRate, 100)
    }));
  }, []);

  const recordAchievement = useCallback((achievement: string) => {
    setAgiState(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement],
      learningRate: Math.min(prev.learningRate + 0.1, 2.0)
    }));
    increaseIntelligence(5);
  }, [increaseIntelligence]);

  const handleError = useCallback(() => {
    setAgiState(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1,
      learningRate: Math.max(prev.learningRate - 0.05, 0.5)
    }));
  }, []);

  const startLearning = useCallback(async () => {
    setIsRunning(true);
    setAgiState(prev => ({ ...prev, isLearning: true, autonomousMode: true }));

    try {
      const result = await AGOCoreLoopAgentRunner({
        input: {
          mode: 'continuous_learning',
          goals: agiState.goals,
          currentIntelligence: agiState.intelligenceLevel
        },
        user_id: 'agi_learning_system'
      });

      if (result.success) {
        recordAchievement('AGI Core Loop Activated');
        
        // Start continuous learning loop
        const learningInterval = setInterval(async () => {
          if (!isRunning) {
            clearInterval(learningInterval);
            return;
          }

          try {
            // Simulate learning and improvement
            increaseIntelligence(Math.random() * 2);
            
            // Periodically run AGI core loop for autonomous operation
            if (agiState.intelligenceLevel > 50 && Math.random() > 0.7) {
              await AGOCoreLoopAgentRunner({
                input: {
                  mode: 'autonomous_operation',
                  goals: agiState.goals,
                  currentIntelligence: agiState.intelligenceLevel
                },
                user_id: 'agi_autonomous_system'
              });
            }
          } catch (error) {
            console.error('AGI learning error:', error);
            handleError();
          }
        }, 10000); // Learn every 10 seconds

        return learningInterval;
      }
    } catch (error) {
      console.error('Failed to start AGI learning:', error);
      handleError();
    }
  }, [agiState.goals, agiState.intelligenceLevel, increaseIntelligence, recordAchievement, handleError, isRunning]);

  const stopLearning = useCallback(() => {
    setIsRunning(false);
    setAgiState(prev => ({ ...prev, isLearning: false, autonomousMode: false }));
  }, []);

  const addGoal = useCallback((goal: string) => {
    setAgiState(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));
  }, []);

  const removeGoal = useCallback((goal: string) => {
    setAgiState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal)
    }));
  }, []);

  // Persist AGI state to database with improved error handling
  useEffect(() => {
    const saveAGIState = async () => {
      try {
        const stateToSave = {
          intelligenceLevel: agiState.intelligenceLevel,
          isLearning: agiState.isLearning,
          autonomousMode: agiState.autonomousMode,
          goals: agiState.goals,
          achievements: agiState.achievements,
          errorCount: agiState.errorCount,
          learningRate: agiState.learningRate
        };
        
        // Use "agi_state" not "api.agi_state"
        const { error } = await supabase
          .from('agi_state')
          .upsert({
            key: 'agi_intelligence',
            state: stateToSave,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Failed to save AGI state:', error);
        }
      } catch (error) {
        console.error('Failed to save AGI state:', error);
      }
    };

    saveAGIState();
  }, [agiState]);

  // Load AGI state on initialization with proper type validation
  useEffect(() => {
    const loadAGIState = async () => {
      try {
        const { data, error } = await supabase
          .from('agi_state')
          .select('state')
          .eq('key', 'agi_intelligence')
          .maybeSingle();

        if (error) {
          console.error('Error loading AGI state:', error);
          return;
        }

        if (data?.state && typeof data.state === 'object' && !Array.isArray(data.state)) {
          const loadedState = data.state as any;
          const isValidState = (
            typeof loadedState.intelligenceLevel === 'number' &&
            typeof loadedState.isLearning === 'boolean' &&
            typeof loadedState.autonomousMode === 'boolean' &&
            Array.isArray(loadedState.goals) &&
            Array.isArray(loadedState.achievements) &&
            typeof loadedState.errorCount === 'number' &&
            typeof loadedState.learningRate === 'number'
          );

          if (isValidState) {
            setAgiState({
              intelligenceLevel: loadedState.intelligenceLevel,
              isLearning: loadedState.isLearning,
              autonomousMode: loadedState.autonomousMode,
              goals: loadedState.goals,
              achievements: loadedState.achievements,
              errorCount: loadedState.errorCount,
              learningRate: loadedState.learningRate
            });
          }
        }
      } catch (error) {
        console.log('No previous AGI state found, starting fresh');
      }
    };
    loadAGIState();
  }, []);

  return {
    agiState,
    isRunning,
    startLearning,
    stopLearning,
    increaseIntelligence,
    recordAchievement,
    handleError,
    addGoal,
    removeGoal
  };
};
