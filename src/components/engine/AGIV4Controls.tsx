
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AGIV4SystemStatus from './v4/AGIV4SystemStatus';
import AGIV4ControlButtons from './v4/AGIV4ControlButtons';
import AGIV4Settings from './v4/AGIV4Settings';
import AGIV4FeatureStatus from './v4/AGIV4FeatureStatus';

const AGIV4Controls = () => {
  const [isV4Active, setIsV4Active] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [learningRate, setLearningRate] = useState([3]);
  const [coordinationLevel, setCoordinationLevel] = useState([75]);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [systemHealth, setSystemHealth] = useState(95);
  const [activeAgentCount, setActiveAgentCount] = useState(12);
  const [openAIEnabled, setOpenAIEnabled] = useState(false);

  const getCoreAgentCount = () => {
    const coreAgents = [
      'SupervisorAgent', 'ResearchAgent', 'LearningAgentV2', 'FactoryAgent',
      'CriticAgent', 'LLMAgent', 'CoordinationAgent', 'MemoryAgent',
      'StrategicAgent', 'OpportunityAgent', 'EvolutionAgent', 'CollaborationAgent'
    ];
    return coreAgents.length;
  };

  useEffect(() => {
    checkOpenAIStatus();
    setActiveAgentCount(getCoreAgentCount());
    
    if (isV4Active) {
      const interval = setInterval(updateSystemStatus, 5000);
      startAutonomousLoop();
      return () => clearInterval(interval);
    }
  }, [isV4Active, autonomousMode, learningRate[0]]);

  const checkOpenAIStatus = async () => {
    try {
      const { data } = await supabase.functions.invoke('agi-v4-core');
      if (data?.openai_enabled) {
        setOpenAIEnabled(true);
        console.log('🧠 OpenAI integration detected and active');
      }
    } catch (error) {
      console.error('Error checking OpenAI status:', error);
    }
  };

  const updateSystemStatus = async () => {
    try {
      const { data: recentLogs } = await supabase
        .from('supervisor_queue')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (recentLogs && recentLogs.length > 0) {
        setLastActivity(recentLogs[0].output);
      }

      setSystemHealth(90 + Math.random() * 10);
      setActiveAgentCount(getCoreAgentCount());

    } catch (error) {
      console.error('Error updating system status:', error);
    }
  };

  const startAutonomousLoop = async () => {
    if (!autonomousMode) return;

    console.log('🚀 V4 Autonomous loop starting...');
    
    const agents = [
      'SupervisorAgent', 'ResearchAgent', 'LearningAgentV2', 'FactoryAgent',
      'CriticAgent', 'LLMAgent', 'CoordinationAgent', 'MemoryAgent',
      'StrategicAgent', 'OpportunityAgent', 'EvolutionAgent', 'CollaborationAgent'
    ];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];

    try {
      await supabase.functions.invoke('agi-v4-core/run_agent', {
        method: 'POST',
        body: {
          agent_name: randomAgent,
          input: null,
          user_id: 'autonomous_system',
          context: { 
            mode: 'autonomous', 
            learning_rate: learningRate[0],
            openai_enhanced: openAIEnabled
          }
        }
      });

      console.log(`🤖 V4 Autonomous execution: ${randomAgent} (OpenAI: ${openAIEnabled})`);
    } catch (error) {
      console.error('Autonomous loop error:', error);
    }

    if (isV4Active && autonomousMode) {
      setTimeout(startAutonomousLoop, learningRate[0] * 1000);
    }
  };

  const startV4System = async () => {
    setIsV4Active(true);
    console.log('🚀 AGI V4 System activated');
    
    await checkOpenAIStatus();
    
    try {
      const { data } = await supabase.functions.invoke('agi-v4-core');
      console.log('V4 System status:', data);
    } catch (error) {
      console.error('V4 System startup error:', error);
    }
  };

  const stopV4System = () => {
    setIsV4Active(false);
    setAutonomousMode(false);
    console.log('🛑 AGI V4 System deactivated');
  };

  const resetV4System = async () => {
    setIsV4Active(false);
    setAutonomousMode(true);
    setLearningRate([3]);
    setCoordinationLevel([75]);
    setLastActivity('');
    
    console.log('🔄 AGI V4 System reset');
    
    setTimeout(() => {
      setIsV4Active(true);
    }, 1000);
  };

  const runEmergencyProtocol = async () => {
    console.log('🚨 V4 Emergency protocol activated');
    
    try {
      await supabase.functions.invoke('agi-v4-core/run_agent', {
        method: 'POST',
        body: {
          agent_name: 'CriticAgent',
          input: 'emergency_evaluation',
          user_id: 'emergency_system',
          context: { protocol: 'emergency' }
        }
      });
    } catch (error) {
      console.error('Emergency protocol error:', error);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          🎛️ AGI V4 Control Center
        </CardTitle>
        <AGIV4SystemStatus 
          isV4Active={isV4Active}
          openAIEnabled={openAIEnabled}
          systemHealth={systemHealth}
          activeAgentCount={activeAgentCount}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {openAIEnabled && (
          <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
            <h4 className="text-blue-400 text-sm font-medium mb-2">🧠 OpenAI Enhanced Intelligence</h4>
            <p className="text-gray-300 text-xs">
              All {activeAgentCount} V4 agents are now powered by GPT-4 for real strategic thinking, opportunity detection, and learning insights.
            </p>
          </div>
        )}

        <AGIV4ControlButtons
          isV4Active={isV4Active}
          startV4System={startV4System}
          stopV4System={stopV4System}
          resetV4System={resetV4System}
          runEmergencyProtocol={runEmergencyProtocol}
        />

        <AGIV4Settings
          isV4Active={isV4Active}
          autonomousMode={autonomousMode}
          setAutonomousMode={setAutonomousMode}
          learningRate={learningRate}
          setLearningRate={setLearningRate}
          coordinationLevel={coordinationLevel}
          setCoordinationLevel={setCoordinationLevel}
        />

        {lastActivity && (
          <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
            <h4 className="text-white text-sm font-medium mb-2">Latest V4 Activity</h4>
            <p className="text-gray-300 text-xs">{lastActivity}</p>
          </div>
        )}

        <AGIV4FeatureStatus 
          activeAgentCount={activeAgentCount}
          openAIEnabled={openAIEnabled}
        />
      </CardContent>
    </Card>
  );
};

export default AGIV4Controls;
