
import { useState, useEffect, useCallback } from 'react';
import { createPersistenceService } from '@/services/PersistenceService';

export const usePersistence = <T>(
  key: string, 
  initialValue: T, 
  persistenceType: 'local' | 'supabase' = 'local'
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persistence = createPersistenceService(persistenceType);

  // Load initial value
  useEffect(() => {
    const loadInitialValue = async () => {
      try {
        setIsLoading(true);
        const savedValue = await persistence.loadState(key);
        if (savedValue !== null) {
          setValue(savedValue);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load state');
        console.error(`Failed to load ${key}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialValue();
  }, [key, persistenceType]);

  // Save value
  const saveValue = useCallback(async (newValue: T) => {
    try {
      setError(null);
      setValue(newValue);
      await persistence.saveState(key, newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save state');
      console.error(`Failed to save ${key}:`, err);
    }
  }, [key, persistence]);

  // Auto-save on value change
  useEffect(() => {
    if (!isLoading && value !== initialValue) {
      const timeoutId = setTimeout(() => {
        persistence.saveState(key, value).catch(err => {
          setError(err instanceof Error ? err.message : 'Failed to auto-save');
        });
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [value, key, persistence, isLoading, initialValue]);

  return {
    value,
    setValue: saveValue,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};

export const useAGIStatePersistence = () => {
  const { value: agents, setValue: setAgents, isLoading: agentsLoading } = usePersistence(
    'agi_agents', 
    [], 
    'supabase'
  );
  
  const { value: kpis, setValue: setKpis, isLoading: kpisLoading } = usePersistence(
    'agi_kpis', 
    { cycles: 0, errors: 0, loopSpeed: 1000 }, 
    'supabase'
  );
  
  const { value: projects, setValue: setProjects, isLoading: projectsLoading } = usePersistence(
    'agi_projects', 
    [], 
    'supabase'
  );

  const { value: systemState, setValue: setSystemState, isLoading: systemLoading } = usePersistence(
    'agi_system_state',
    { isRunning: false, lastUpdate: new Date().toISOString() },
    'supabase'
  );

  const isLoading = agentsLoading || kpisLoading || projectsLoading || systemLoading;

  return {
    agents,
    setAgents,
    kpis,
    setKpis,
    projects,
    setProjects,
    systemState,
    setSystemState,
    isLoading
  };
};
