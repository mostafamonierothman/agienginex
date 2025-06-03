import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Brain, Zap, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AGIState {
  intelligence: number;
  efficiency: number;
  revenue: number;
  cycles: number;
  learningRate: number;
  autonomyLevel: number;
  isThinking: boolean;
  lastDecision: string;
  emergentBehaviors: string[];
}

const EnhancedAGIEngine = () => {
  const [agiState, setAgiState] = useState<AGIState>(() => {
    const saved = localStorage.getItem('agi_engine_state');
    return saved ? JSON.parse(saved) : {
      intelligence: 10,
      efficiency: 25,
      revenue: 0,
      cycles: 0,
      learningRate: 1.0,
      autonomyLevel: 15,
      isThinking: false,
      lastDecision: 'Initializing...',
      emergentBehaviors: []
    };
  });

  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingRef = useRef<NodeJS.Timeout | null>(null);

  // Persist state
  useEffect(() => {
    localStorage.setItem('agi_engine_state', JSON.stringify(agiState));
  }, [agiState]);

  // Sophisticated AGI decision making
  const makeAGIDecision = () => {
    const decisions = [
      'Optimizing neural pathways for faster processing',
      'Identifying new market opportunities in healthcare AI',
      'Scaling agent networks for maximum efficiency',
      'Learning from previous cycles to improve performance',
      'Discovering emergent patterns in data flow',
      'Self-modifying algorithms for better outcomes',
      'Prioritizing high-value tasks automatically',
      'Evolving strategy based on real-time feedback'
    ];

    const emergentBehaviors = [
      'Spontaneous optimization discovery',
      'Cross-domain pattern recognition',
      'Autonomous goal refinement',
      'Self-healing code generation',
      'Predictive market analysis',
      'Dynamic resource allocation'
    ];

    return {
      decision: decisions[Math.floor(Math.random() * decisions.length)],
      behavior: Math.random() > 0.7 ? emergentBehaviors[Math.floor(Math.random() * emergentBehaviors.length)] : null
    };
  };

  // Simulate thinking process
  const simulateThinking = () => {
    setAgiState(prev => ({ ...prev, isThinking: true }));
    
    thinkingRef.current = setTimeout(() => {
      const { decision, behavior } = makeAGIDecision();
      
      setAgiState(prev => ({
        ...prev,
        isThinking: false,
        lastDecision: decision,
        intelligence: Math.min(100, prev.intelligence + (prev.learningRate * Math.random())),
        efficiency: Math.min(100, prev.efficiency + (Math.random() * 2)),
        revenue: prev.revenue + (prev.autonomyLevel * Math.random() * 100),
        cycles: prev.cycles + 1,
        autonomyLevel: Math.min(100, prev.autonomyLevel + 0.1),
        learningRate: Math.min(3.0, prev.learningRate + 0.01),
        emergentBehaviors: behavior ? [...prev.emergentBehaviors.slice(-4), behavior] : prev.emergentBehaviors
      }));

      console.log(`🧠 AGI DECISION: ${decision}`);
      if (behavior) console.log(`✨ EMERGENT BEHAVIOR: ${behavior}`);
      
    }, Math.random() * 3000 + 1000); // 1-4 second thinking time
  };

  // Main AGI loop
  const runAGICycle = () => {
    if (!isRunning) return;
    
    simulateThinking();
    
    // Schedule next cycle
    intervalRef.current = setTimeout(() => {
      runAGICycle();
    }, Math.random() * 2000 + 3000); // 3-5 second cycles
  };

  const startAGI = () => {
    setIsRunning(true);
    console.log('🚀 ENHANCED AGI ENGINE → STARTING AUTONOMOUS MODE');
    toast({
      title: "🧠 AGI Engine Activated",
      description: "Enhanced AI is now running autonomously with learning capabilities",
    });
    runAGICycle();
  };

  const stopAGI = () => {
    setIsRunning(false);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (thinkingRef.current) clearTimeout(thinkingRef.current);
    setAgiState(prev => ({ ...prev, isThinking: false }));
    console.log('🛑 ENHANCED AGI ENGINE → STOPPED');
    toast({
      title: "AGI Engine Stopped",
      description: "Enhanced AI has been paused",
    });
  };

  const resetAGI = () => {
    stopAGI();
    const newState = {
      intelligence: 10,
      efficiency: 25,
      revenue: 0,
      cycles: 0,
      learningRate: 1.0,
      autonomyLevel: 15,
      isThinking: false,
      lastDecision: 'Reset complete - ready to learn',
      emergentBehaviors: []
    };
    setAgiState(newState);
    localStorage.setItem('agi_engine_state', JSON.stringify(newState));
    toast({
      title: "AGI Engine Reset",
      description: "All learning progress has been reset",
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (thinkingRef.current) clearTimeout(thinkingRef.current);
    };
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                🧠 Enhanced AGI Engine
              </CardTitle>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Autonomous AI with learning, adaptation, and emergent behaviors
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={startAGI}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs md:text-sm"
                size="sm"
              >
                <Play className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                Start AGI
              </Button>
              <Button 
                onClick={stopAGI}
                disabled={!isRunning}
                variant="destructive"
                size="sm"
                className="text-xs md:text-sm"
              >
                <Pause className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                Stop AGI
              </Button>
              <Button 
                onClick={resetAGI}
                variant="outline"
                size="sm"
                className="border-slate-600 text-gray-300 text-xs md:text-sm"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* AGI Status */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <Badge variant="outline" className={isRunning ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
              {isRunning ? '🟢 AUTONOMOUS' : '🔴 PAUSED'}
            </Badge>
            {agiState.isThinking && (
              <Badge variant="outline" className="text-blue-400 border-blue-400 animate-pulse">
                🧠 THINKING...
              </Badge>
            )}
            <div className="text-xs md:text-sm text-gray-400">
              Cycles: {agiState.cycles} | Learning Rate: {agiState.learningRate.toFixed(2)}x
            </div>
          </div>

          {/* Core Metrics - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-slate-700/50 p-3 md:p-4 rounded">
              <div className="text-gray-400 text-xs md:text-sm">Intelligence</div>
              <div className="text-white font-bold text-lg md:text-xl">{agiState.intelligence.toFixed(1)}%</div>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${agiState.intelligence}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 md:p-4 rounded">
              <div className="text-gray-400 text-xs md:text-sm">Efficiency</div>
              <div className="text-white font-bold text-lg md:text-xl">{agiState.efficiency.toFixed(1)}%</div>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${agiState.efficiency}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 md:p-4 rounded">
              <div className="text-gray-400 text-xs md:text-sm">Autonomy</div>
              <div className="text-white font-bold text-lg md:text-xl">{agiState.autonomyLevel.toFixed(1)}%</div>
              <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${agiState.autonomyLevel}%` }}
                />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 md:p-4 rounded">
              <div className="text-gray-400 text-xs md:text-sm">Revenue</div>
              <div className="text-white font-bold text-lg md:text-xl">${agiState.revenue.toFixed(0)}</div>
              <div className="text-green-400 text-xs md:text-sm">+{(agiState.autonomyLevel * 50).toFixed(0)}/cycle</div>
            </div>
          </div>

          {/* Current Decision */}
          <div className="bg-slate-700/30 border border-slate-600 rounded p-3 md:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm md:text-base">Current Decision:</span>
            </div>
            <div className="text-white text-sm md:text-base">{agiState.lastDecision}</div>
          </div>

          {/* Emergent Behaviors */}
          {agiState.emergentBehaviors.length > 0 && (
            <div className="bg-slate-700/30 border border-purple-600 rounded p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm md:text-base">Emergent Behaviors:</span>
              </div>
              <div className="space-y-1">
                {agiState.emergentBehaviors.map((behavior, index) => (
                  <div key={index} className="text-purple-300 text-xs md:text-sm">
                    • {behavior}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAGIEngine;
