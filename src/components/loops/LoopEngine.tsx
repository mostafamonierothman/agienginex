
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square } from 'lucide-react';

interface LoopState {
  isRunning: boolean;
  cycles: number;
  lastUpdate: Date | null;
  status: string;
  metrics: Record<string, any>;
}

interface LoopEngineProps {
  engineState: any;
}

const LoopEngine = ({ engineState }: LoopEngineProps) => {
  const [loops, setLoops] = useState<Record<string, LoopState>>({
    learning_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { progress: 0 } },
    latency_optimizer_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { latency: 50 } },
    pipeline_optimizer_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { efficiency: 30 } },
    hardware_optimizer_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { utilization: 70 } },
    self_prioritizer_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { tasks_prioritized: 0 } },
    opportunity_seeker_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { opportunities_found: 0 } },
    self_rewrite_loop: { isRunning: false, cycles: 0, lastUpdate: null, status: 'stopped', metrics: { optimizations: 0 } }
  });

  const intervalRefs = useRef<Record<string, NodeJS.Timeout>>({});

  // Learning Loop Implementation
  const runLearningLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        learning_loop: {
          ...prev.learning_loop,
          cycles: prev.learning_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            progress: Math.min(prev.learning_loop.metrics.progress + Math.random() * 2, 100)
          }
        }
      }));
      console.log('🧠 LEARNING LOOP → agents getting smarter...');
    }, 1000);
  };

  // Latency Optimizer Loop Implementation
  const runLatencyLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        latency_optimizer_loop: {
          ...prev.latency_optimizer_loop,
          cycles: prev.latency_optimizer_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            latency: Math.max(prev.latency_optimizer_loop.metrics.latency - Math.random() * 1, 5)
          }
        }
      }));
      console.log('⚡ LATENCY LOOP → minimizing response time...');
    }, 1000);
  };

  // Pipeline Optimizer Loop Implementation
  const runPipelineLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        pipeline_optimizer_loop: {
          ...prev.pipeline_optimizer_loop,
          cycles: prev.pipeline_optimizer_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            efficiency: Math.min(prev.pipeline_optimizer_loop.metrics.efficiency + Math.random() * 1.5, 100)
          }
        }
      }));
      console.log('🚀 PIPELINE LOOP → optimizing task flow...');
    }, 1000);
  };

  // Hardware Optimizer Loop Implementation
  const runHardwareLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        hardware_optimizer_loop: {
          ...prev.hardware_optimizer_loop,
          cycles: prev.hardware_optimizer_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            utilization: Math.min(prev.hardware_optimizer_loop.metrics.utilization + Math.random() * 0.5, 95)
          }
        }
      }));
      console.log('🖥️ HARDWARE LOOP → optimizing compute resources...');
    }, 1000);
  };

  // Self Prioritizer Loop Implementation
  const runPrioritizerLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        self_prioritizer_loop: {
          ...prev.self_prioritizer_loop,
          cycles: prev.self_prioritizer_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            tasks_prioritized: prev.self_prioritizer_loop.metrics.tasks_prioritized + Math.floor(Math.random() * 5)
          }
        }
      }));
      console.log('🎯 PRIORITIZER LOOP → optimizing task priorities...');
    }, 1000);
  };

  // Opportunity Seeker Loop Implementation
  const runOpportunityLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        opportunity_seeker_loop: {
          ...prev.opportunity_seeker_loop,
          cycles: prev.opportunity_seeker_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            opportunities_found: prev.opportunity_seeker_loop.metrics.opportunities_found + (Math.random() > 0.8 ? 1 : 0)
          }
        }
      }));
      console.log('🔍 OPPORTUNITY LOOP → scanning for opportunities...');
    }, 1000);
  };

  // Self Rewrite Loop Implementation (slower cycle)
  const runSelfRewriteLoop = () => {
    return setInterval(() => {
      setLoops(prev => ({
        ...prev,
        self_rewrite_loop: {
          ...prev.self_rewrite_loop,
          cycles: prev.self_rewrite_loop.cycles + 1,
          lastUpdate: new Date(),
          status: 'active',
          metrics: {
            optimizations: prev.self_rewrite_loop.metrics.optimizations + (Math.random() > 0.7 ? 1 : 0)
          }
        }
      }));
      console.log('🔧 SELF-REWRITE LOOP → optimizing own code...');
    }, 5000); // 5 second cycle for safety
  };

  const loopImplementations = {
    learning_loop: runLearningLoop,
    latency_optimizer_loop: runLatencyLoop,
    pipeline_optimizer_loop: runPipelineLoop,
    hardware_optimizer_loop: runHardwareLoop,
    self_prioritizer_loop: runPrioritizerLoop,
    opportunity_seeker_loop: runOpportunityLoop,
    self_rewrite_loop: runSelfRewriteLoop
  };

  const startLoop = (loopName: string) => {
    if (intervalRefs.current[loopName]) return;
    
    const implementation = loopImplementations[loopName as keyof typeof loopImplementations];
    if (implementation) {
      intervalRefs.current[loopName] = implementation();
      setLoops(prev => ({
        ...prev,
        [loopName]: { ...prev[loopName], isRunning: true, status: 'starting' }
      }));
    }
  };

  const stopLoop = (loopName: string) => {
    if (intervalRefs.current[loopName]) {
      clearInterval(intervalRefs.current[loopName]);
      delete intervalRefs.current[loopName];
      setLoops(prev => ({
        ...prev,
        [loopName]: { ...prev[loopName], isRunning: false, status: 'stopped' }
      }));
    }
  };

  const startAllLoops = () => {
    Object.keys(loops).forEach(startLoop);
    console.log('🚀 AGI ENGINE X → ALL LOOPS STARTED');
  };

  const stopAllLoops = () => {
    Object.keys(loops).forEach(stopLoop);
    console.log('🛑 AGI ENGINE X → ALL LOOPS STOPPED');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400';
      case 'starting': return 'text-blue-400 border-blue-400';
      case 'stopped': return 'text-gray-400 border-gray-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatMetric = (loopName: string, value: number) => {
    if (loopName === 'learning_loop') return `${value.toFixed(1)}%`;
    if (loopName === 'latency_optimizer_loop') return `${value.toFixed(1)}ms`;
    if (loopName === 'pipeline_optimizer_loop') return `${value.toFixed(1)}%`;
    if (loopName === 'hardware_optimizer_loop') return `${value.toFixed(1)}%`;
    return Math.floor(value).toString();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">🤖 Loop Engine Control</CardTitle>
            <div className="space-x-2">
              <Button 
                onClick={startAllLoops}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Start All
              </Button>
              <Button 
                onClick={stopAllLoops}
                variant="destructive"
                size="sm"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(loops).map(([loopName, loopState]) => (
              <Card key={loopName} className="bg-slate-700/50 border-slate-600">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold capitalize text-sm">
                        {loopName.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="outline" className={getStatusColor(loopState.status)}>
                        {loopState.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Cycles: {loopState.cycles}</div>
                      <div>
                        Metric: {formatMetric(loopName, Object.values(loopState.metrics)[0] as number)}
                      </div>
                      {loopState.lastUpdate && (
                        <div>Last: {loopState.lastUpdate.toLocaleTimeString()}</div>
                      )}
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        onClick={() => startLoop(loopName)}
                        disabled={loopState.isRunning}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => stopLoop(loopName)}
                        disabled={!loopState.isRunning}
                        size="sm"
                        variant="destructive"
                        className="flex-1 disabled:opacity-50"
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoopEngine;
