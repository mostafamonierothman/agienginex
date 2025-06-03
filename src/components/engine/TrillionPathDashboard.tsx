
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { agiLoopEngine, LoopAction, LoopMetrics, TrillionPathOpportunity } from '@/services/AGILoopEngine';
import { toast } from '@/hooks/use-toast';

const TrillionPathDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [actions, setActions] = useState<LoopAction[]>([]);
  const [metrics, setMetrics] = useState<LoopMetrics>({
    cycleCount: 0,
    avgCycleTime: 0,
    impactPerHour: 0,
    highImpactTimePercent: 0,
    totalValue: 0,
    loopSpeed: 5
  });
  const [opportunities, setOpportunities] = useState<TrillionPathOpportunity[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setActions(agiLoopEngine.getActions());
        setMetrics(agiLoopEngine.getMetrics());
        setOpportunities(agiLoopEngine.getOpportunities());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const activateTrillionLoop = async () => {
    await agiLoopEngine.activateTrillionLoop();
    setIsActive(true);
  };

  const deactivateLoop = () => {
    agiLoopEngine.deactivate();
    setIsActive(false);
  };

  const deploy1MinutePath = () => {
    console.log('🚀 1-MINUTE TRILLION PATH DEPLOYMENT → INITIATED');
    toast({
      title: "🚀 1-Minute Deployment Started",
      description: "Trillion-euro path execution initiated with femtosecond precision",
    });
    activateTrillionLoop();
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'analyze': return '🔍';
      case 'execute': return '⚡';
      case 'delegate': return '👥';
      case 'measure': return '📊';
      case 'optimize': return '🚀';
      default: return '⚙️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 border-green-400';
      case 'executing': return 'text-blue-400 border-blue-400';
      case 'pending': return 'text-yellow-400 border-yellow-400';
      case 'failed': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                💎 Trillion Path AGI Loop Engine
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Real-time execution of trillion-euro strategy with femtosecond precision
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                {isActive ? '🟢 LOOP ACTIVE' : '🔴 INACTIVE'}
              </Badge>
              {isActive ? (
                <Button onClick={deactivateLoop} variant="destructive" size="sm">
                  Stop Loop
                </Button>
              ) : (
                <Button onClick={deploy1MinutePath} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" size="sm">
                  🚀 Deploy 1-Minute Path
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Loop Cycles</div>
              <div className="text-white font-bold text-lg">{metrics.cycleCount}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Loop Speed</div>
              <div className="text-blue-400 font-bold text-lg">{metrics.loopSpeed.toFixed(1)}s</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Impact/Hour</div>
              <div className="text-green-400 font-bold text-lg">{metrics.impactPerHour.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">High Impact Time</div>
              <div className="text-yellow-400 font-bold text-lg">{metrics.highImpactTimePercent.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Total Value</div>
              <div className="text-purple-400 font-bold text-lg">€{(metrics.totalValue/1000000).toFixed(1)}M</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">High Impact Action Time</span>
              <span className="text-white">{metrics.highImpactTimePercent.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.highImpactTimePercent} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Top Opportunities */}
      {isActive && opportunities.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">🎯 Trillion Path Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-medium">{opp.title}</div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {opp.leverage_score}% Leverage
                    </Badge>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{opp.market}</div>
                  <div className="text-green-400 font-bold">€{(opp.revenue_potential/1000000).toFixed(0)}M potential</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Next: {opp.next_action} ({opp.probability}% probability)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Action Stream */}
      {isActive && actions.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">⚡ Real-Time Action Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {actions.map((action) => (
                <div key={action.id} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{getActionIcon(action.type)}</span>
                        <span className="text-white font-medium">{action.description}</span>
                      </div>
                      {action.result && (
                        <div className="text-xs text-gray-400 mt-1">
                          Result: {action.result}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Impact: {action.impact}% | Urgency: {action.urgency.toFixed(0)}%
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={getStatusColor(action.status)}>
                        {action.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {action.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrillionPathDashboard;
