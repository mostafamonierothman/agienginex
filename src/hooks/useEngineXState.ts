
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface EngineState {
  timestamp: string;
  overall_status: string;
  tasks_completed_last_sec: number;
  learning_loop_progress_percent: number;
  latency_loop_current_latency_ms: number;
  pipeline_optimizer_efficiency_percent: number;
  active_agents: number;
  current_revenue: {
    medjourney_main: number;
    geo_expansion: number;
    waiting_list_targeting: number;
    billionaire_path: number;
    agi_healthcare: number;
    sweden_health: number;
    sweden_crime: number;
  };
  loop_status: {
    learning_loop: string;
    latency_optimizer_loop: string;
    pipeline_optimizer_loop: string;
    hardware_optimizer_loop: string;
    self_prioritizer_loop: string;
    opportunity_seeker_loop: string;
    self_rewrite_loop: string;
  };
  estimated_time_to_1_sec_finish_sec: number;
  estimated_days_to_10M_path: number;
  engine_cycle_rate_sec: number;
  femto_aspiration_gap_percent: number;
}

export const useEngineXState = () => {
  const [engineState, setEngineState] = useState<EngineState | null>(null);
  const [apiUrl, setApiUrl] = useState('https://api.agienginex.ai');
  const [apiKey, setApiKey] = useState('');
  const [taskName, setTaskName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('agienginex_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('agienginex_api_key', apiKey);
    }
  }, [apiKey]);

  // Fetch engine state every 5 seconds
  useEffect(() => {
    const fetchEngineState = async () => {
      if (!apiKey) {
        console.log('No API key provided, using demo data');
        setEngineState({
          timestamp: new Date().toISOString(),
          overall_status: "demo_mode",
          tasks_completed_last_sec: Math.floor(Math.random() * 200) + 50,
          learning_loop_progress_percent: Math.floor(Math.random() * 100),
          latency_loop_current_latency_ms: Math.floor(Math.random() * 50) + 10,
          pipeline_optimizer_efficiency_percent: Math.floor(Math.random() * 30),
          active_agents: Math.floor(Math.random() * 200) + 100,
          current_revenue: {
            medjourney_main: 0,
            geo_expansion: 0,
            waiting_list_targeting: 0,
            billionaire_path: 0,
            agi_healthcare: 0,
            sweden_health: 0,
            sweden_crime: 0
          },
          loop_status: {
            learning_loop: "active",
            latency_optimizer_loop: "building",
            pipeline_optimizer_loop: "queued",
            hardware_optimizer_loop: "queued",
            self_prioritizer_loop: "queued",
            opportunity_seeker_loop: "active",
            self_rewrite_loop: "planned"
          },
          estimated_time_to_1_sec_finish_sec: 7.5,
          estimated_days_to_10M_path: 8,
          engine_cycle_rate_sec: 1,
          femto_aspiration_gap_percent: 88.3
        });
        setIsConnected(false);
        return;
      }

      try {
        console.log('Fetching engine state from:', `${apiUrl}/engine_state`);
        const response = await fetch(`${apiUrl}/engine_state`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setEngineState(data);
          setIsConnected(true);
          setLastUpdate(new Date());
          console.log('Engine state updated:', data);
        } else if (response.status === 401) {
          throw new Error('Invalid API key');
        } else {
          throw new Error('Failed to fetch engine state');
        }
      } catch (error) {
        console.error('Error fetching engine state:', error);
        setIsConnected(false);
        toast({
          title: "Connection Error",
          description: error instanceof Error ? error.message : "Failed to connect to Engine X",
          variant: "destructive",
        });
      }
    };

    fetchEngineState();
    const interval = setInterval(fetchEngineState, 5000);
    return () => clearInterval(interval);
  }, [apiUrl, apiKey]);

  const triggerTask = async () => {
    if (!taskName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task name",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter your API key first",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Triggering task:', taskName);
      const response = await fetch(`${apiUrl}/trigger_task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_name: taskName }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Task Triggered",
          description: `Task "${taskName}" has been sent to AGI Engine X`,
        });
        setTaskName('');
        console.log('Task triggered successfully:', result);
      } else if (response.status === 401) {
        throw new Error('Invalid API key');
      } else {
        throw new Error('Failed to trigger task');
      }
    } catch (error) {
      console.error('Error triggering task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to trigger task",
        variant: "destructive",
      });
    }
  };

  return {
    engineState,
    apiUrl,
    setApiUrl,
    apiKey,
    setApiKey,
    taskName,
    setTaskName,
    isConnected,
    lastUpdate,
    triggerTask
  };
};
