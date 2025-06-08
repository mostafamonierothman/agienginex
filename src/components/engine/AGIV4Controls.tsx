
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Brain, Play, Pause, RotateCcw, Zap, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AGIV4Controls = () => {
  const [isV4Active, setIsV4Active] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [learningRate, setLearningRate] = useState([3]);
  const [coordinationLevel, setCoordinationLevel] = useState([75]);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [systemHealth, setSystemHealth] = useState(95);
  const [activeAgentCount, setActiveAgentCount] = useState(0);

  useEffect(() => {
    if (isV4Active) {
      const interval = setInterval(updateSystemStatus, 5000);
      startAutonomousLoop();
      return () => clearInterval(interval);
    }
  }, [isV4Active, autonomousMode, learningRate[0]]);

  const updateSystemStatus = async () => {
    try {
      // Get recent activity
      const { data: recentLogs } = await supabase
        .from('supervisor_queue')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (recentLogs && recentLogs.length > 0) {
        setLastActivity(recentLogs[0].output);
      }

      // Update system health (simulate)
      setSystemHealth(90 + Math.random() * 10);
      setActiveAgentCount(Math.floor(Math.random() * 6) + 1);

    } catch (error) {
      console.error('Error updating system status:', error);
    }
  };

  const startAutonomousLoop = async () => {
    if (!autonomousMode) return;

    console.log('🚀 V4 Autonomous loop starting...');
    
    // Run a random agent every few seconds based on learning rate
    const agents = ['next_move_agent', 'opportunity_agent', 'learning_agent', 'coordination_agent', 'memory_agent', 'critic_agent'];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];

    try {
      await supabase.functions.invoke('agi-v4-core/run_agent', {
        method: 'POST',
        body: {
          agent_name: randomAgent,
          input: null,
          user_id: 'autonomous_system',
          context: { mode: 'autonomous', learning_rate: learningRate[0] }
        }
      });

      console.log(`🤖 V4 Autonomous execution: ${randomAgent}`);
    } catch (error) {
      console.error('Autonomous loop error:', error);
    }

    // Schedule next execution
    if (isV4Active && autonomousMode) {
      setTimeout(startAutonomousLoop, learningRate[0] * 1000);
    }
  };

  const startV4System = async () => {
    setIsV4Active(true);
    console.log('🚀 AGI V4 System activated');
    
    // Initial system check
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
    
    // Clear recent activity
    setTimeout(() => {
      setIsV4Active(true);
    }, 1000);
  };

  const runEmergencyProtocol = async () => {
    console.log('🚨 V4 Emergency protocol activated');
    
    try {
      // Run critic agent for system evaluation
      await supabase.functions.invoke('agi-v4-core/run_agent', {
        method: 'POST',
        body: {
          agent_name: 'critic_agent',
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
        <div className="flex items-center gap-4 mt-2">
          <Badge 
            variant="outline" 
            className={isV4Active ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}
          >
            {isV4Active ? '🟢 V4 ACTIVE' : '🔴 V4 OFFLINE'}
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Health: {systemHealth.toFixed(0)}%
          </Badge>
          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
            Agents: {activeAgentCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={startV4System}
            disabled={isV4Active}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Start V4
          </Button>
          <Button 
            onClick={stopV4System}
            disabled={!isV4Active}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <Pause className="w-4 h-4 mr-2" />
            Stop V4
          </Button>
          <Button 
            onClick={resetV4System}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset V4
          </Button>
        </div>

        {/* Advanced Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-400">Autonomous Mode</label>
            <Switch 
              checked={autonomousMode}
              onCheckedChange={setAutonomousMode}
              disabled={!isV4Active}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Learning Rate: {learningRate[0]}s intervals
            </label>
            <Slider
              value={learningRate}
              onValueChange={setLearningRate}
              max={10}
              min={1}
              step={1}
              className="w-full"
              disabled={!isV4Active}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Coordination Level: {coordinationLevel[0]}%
            </label>
            <Slider
              value={coordinationLevel}
              onValueChange={setCoordinationLevel}
              max={100}
              min={10}
              step={5}
              className="w-full"
              disabled={!isV4Active}
            />
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="border-t border-slate-600 pt-4">
          <Button 
            onClick={runEmergencyProtocol}
            disabled={!isV4Active}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            🚨 Emergency Protocol
          </Button>
        </div>

        {/* System Status */}
        {lastActivity && (
          <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
            <h4 className="text-white text-sm font-medium mb-2">Latest V4 Activity</h4>
            <p className="text-gray-300 text-xs">{lastActivity}</p>
          </div>
        )}

        {/* V4 Features Status */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">Agent Registry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">Vector Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">Learning Loop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-400">Multi-Agent Coordination</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AGIV4Controls;
