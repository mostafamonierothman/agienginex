
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Play, Pause, Timer, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { agiApiClient } from '@/services/AGIApiClient';

const BackgroundLoopController = () => {
  const [isLoopActive, setIsLoopActive] = useState(false);
  const [loopInterval, setLoopInterval] = useState([30]);
  const [autoMode, setAutoMode] = useState(true);
  const [loopCount, setLoopCount] = useState(0);
  const [lastExecution, setLastExecution] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  let loopIntervalId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (isLoopActive && autoMode) {
      startAutoLoop();
    } else {
      stopAutoLoop();
    }

    return () => {
      if (loopIntervalId) {
        clearInterval(loopIntervalId);
      }
    };
  }, [isLoopActive, autoMode, loopInterval[0]]);

  const startAutoLoop = () => {
    if (loopIntervalId) {
      clearInterval(loopIntervalId);
    }

    loopIntervalId = setInterval(() => {
      executeBackgroundLoop();
    }, loopInterval[0] * 1000);
  };

  const stopAutoLoop = () => {
    if (loopIntervalId) {
      clearInterval(loopIntervalId);
      loopIntervalId = null;
    }
  };

  const executeBackgroundLoop = async () => {
    setIsExecuting(true);
    try {
      const result = await agiApiClient.triggerBackgroundLoop();
      setLoopCount(prev => prev + 1);
      setLastExecution(new Date().toISOString());
      
      toast({
        title: "🔄 Background Loop Executed",
        description: `Loop #${loopCount + 1} completed successfully`,
      });

      console.log('Background loop result:', result);
    } catch (error) {
      console.error('Background loop error:', error);
      toast({
        title: "Loop Execution Failed",
        description: "Background loop encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const startLoop = () => {
    setIsLoopActive(true);
    toast({
      title: "🚀 Background Loop Started",
      description: `Loop will execute every ${loopInterval[0]} seconds`,
    });
  };

  const stopLoop = () => {
    setIsLoopActive(false);
    toast({
      title: "⏸️ Background Loop Stopped",
      description: "Autonomous background execution paused",
    });
  };

  const resetLoop = () => {
    setIsLoopActive(false);
    setLoopCount(0);
    setLastExecution('');
    toast({
      title: "🔄 Background Loop Reset",
      description: "Loop counters and state cleared",
    });
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-orange-400" />
          🔄 Background Loop Controller
        </CardTitle>
        <div className="flex items-center gap-4 mt-2">
          <Badge 
            variant="outline" 
            className={isLoopActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}
          >
            {isLoopActive ? '🟢 ACTIVE' : '🔴 STOPPED'}
          </Badge>
          <Badge 
            variant="outline" 
            className={isExecuting ? 'text-yellow-400 border-yellow-400' : 'text-blue-400 border-blue-400'}
          >
            {isExecuting ? '⚡ EXECUTING' : '💤 IDLE'}
          </Badge>
          <Badge variant="outline" className="text-purple-400 border-purple-400">
            Cycles: {loopCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loop Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={startLoop}
            disabled={isLoopActive}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Loop
          </Button>
          <Button 
            onClick={stopLoop}
            disabled={!isLoopActive}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
          >
            <Pause className="w-4 h-4 mr-2" />
            Stop Loop
          </Button>
          <Button 
            onClick={resetLoop}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Loop
          </Button>
        </div>

        {/* Manual Execution */}
        <div className="border-t border-slate-600 pt-4">
          <Button 
            onClick={executeBackgroundLoop}
            disabled={isExecuting}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isExecuting ? 'Executing...' : 'Execute Once Manually'}
          </Button>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-gray-400">Auto Mode</label>
            <Switch 
              checked={autoMode}
              onCheckedChange={setAutoMode}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">
              Loop Interval: {loopInterval[0]} seconds
            </label>
            <Slider
              value={loopInterval}
              onValueChange={setLoopInterval}
              max={300}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5s (Fast)</span>
              <span>60s (Normal)</span>
              <span>300s (Slow)</span>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
          <h4 className="text-white text-sm font-medium mb-3">Loop Status</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Total Executions:</span>
              <div className="text-white font-medium">{loopCount}</div>
            </div>
            <div>
              <span className="text-gray-400">Last Execution:</span>
              <div className="text-white font-medium">{formatTime(lastExecution)}</div>
            </div>
            <div>
              <span className="text-gray-400">Interval:</span>
              <div className="text-white font-medium">{loopInterval[0]}s</div>
            </div>
            <div>
              <span className="text-gray-400">Mode:</span>
              <div className="text-white font-medium">{autoMode ? 'Automatic' : 'Manual'}</div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
          <h4 className="text-blue-400 text-sm font-medium mb-2">🚀 Pro Setup Options</h4>
          <div className="text-gray-300 text-xs space-y-1">
            <p>• <strong>Zapier:</strong> Trigger webhook every X minutes</p>
            <p>• <strong>GitHub Actions:</strong> Schedule with cron expressions</p>
            <p>• <strong>Supabase Cron:</strong> Database-level scheduling</p>
            <p>• <strong>External Cron:</strong> Linux/Windows task scheduler</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundLoopController;
