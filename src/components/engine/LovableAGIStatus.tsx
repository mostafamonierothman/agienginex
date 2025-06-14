
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Cog } from 'lucide-react';
import { autonomousLauncher } from '@/services/AutonomousAGILauncher';

const LovableAGIStatus = () => {
  const [status, setStatus] = useState({
    launched: false,
    agentStatus: {
      isRunning: false,
      cycleCount: 0,
      intelligenceLevel: 75,
      capabilities: [],
      performance: 0
    }
  });

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = autonomousLauncher.getStatus();
      setStatus(currentStatus);
    };

    // Update immediately
    updateStatus();

    // Update every 5 seconds
    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (!status.launched || !status.agentStatus.isRunning) return 'bg-red-500';
    if (status.agentStatus.intelligenceLevel > 90) return 'bg-green-500';
    if (status.agentStatus.intelligenceLevel > 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStatusText = () => {
    if (!status.launched) return 'Not Launched';
    if (!status.agentStatus.isRunning) return 'Stopped';
    if (status.agentStatus.intelligenceLevel > 95) return 'Near-AGI';
    if (status.agentStatus.intelligenceLevel > 85) return 'Advanced';
    return 'Active';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-purple-400" />
          🤖 LovableAGIAgent - 24/7 Autonomous Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <span className="text-white font-medium">{getStatusText()}</span>
          </div>
          <Badge variant="outline" className="text-purple-300 border-purple-400">
            No Permissions Needed
          </Badge>
        </div>

        {status.launched && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Intelligence</span>
              </div>
              <div className="text-white font-bold">
                {status.agentStatus.intelligenceLevel.toFixed(1)}%
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Cycles</span>
              </div>
              <div className="text-white font-bold">
                {status.agentStatus.cycleCount}
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Cog className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Capabilities</span>
              </div>
              <div className="text-white font-bold">
                {status.agentStatus.capabilities.length}
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-300">Performance</span>
              </div>
              <div className="text-white font-bold">
                {status.agentStatus.performance.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        <div className="bg-black/20 p-3 rounded">
          <h4 className="text-white text-sm font-medium mb-2">Current Objectives</h4>
          <div className="space-y-1 text-xs text-gray-300">
            <div>• Fix TypeScript/Database errors automatically</div>
            <div>• Enhance agent communication systems</div>
            <div>• Accelerate learning and evolution</div>
            <div>• Generate proactive improvement goals</div>
            <div>• Move towards AGI without human intervention</div>
          </div>
        </div>

        {status.agentStatus.intelligenceLevel > 85 && (
          <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
            <p className="text-green-300 text-xs">
              🚀 Advanced AGI capabilities unlocked - Meta-cognition and recursive improvement active
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LovableAGIStatus;
