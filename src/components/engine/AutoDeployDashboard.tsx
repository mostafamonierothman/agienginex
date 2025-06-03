import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { lovableAutoDeploy, AutoDeployment } from '@/services/LovableAutoDeploy';
import { toast } from '@/hooks/use-toast';
import { Target, Zap, TrendingUp } from 'lucide-react';

const AutoDeployDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [deployments, setDeployments] = useState<AutoDeployment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    failed: 0,
    successRate: 0
  });
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDeployments(lovableAutoDeploy.getDeployments());
        setStats(lovableAutoDeploy.getDeploymentStats());
        setTotalRevenue(lovableAutoDeploy.getTotalRevenue());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const activateAutoDeploy = async () => {
    await lovableAutoDeploy.activate();
    setIsActive(true);
  };

  const deactivateAutoDeploy = () => {
    lovableAutoDeploy.deactivate();
    setIsActive(false);
  };

  const deploy100PercentSuccess = async () => {
    const guaranteedFlow = {
      name: 'Ultra-Premium MedJourney VIP',
      target: 'Fortune 500 Healthcare CEOs',
      content: 'Exclusive AGI-powered healthcare transformation for industry leaders',
      cta: 'Schedule Executive Demo',
      revenue_goal: 1000000,
      probability: 100
    };

    console.log('🎯 DEPLOYING 100% SUCCESS RATE FLOW → Ultra-Premium MedJourney VIP');
    await lovableAutoDeploy.deployBusinessFlow(guaranteedFlow);
    
    toast({
      title: "🎯 100% Success Rate Deployment",
      description: "Ultra-Premium flow deployed with guaranteed success!",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return '🟢';
      case 'deploying': return '🔵';
      case 'generating': return '🟡';
      case 'failed': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400 border-green-400';
      case 'deploying': return 'text-blue-400 border-blue-400';
      case 'generating': return 'text-yellow-400 border-yellow-400';
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
                🚀 Lovable Auto-Deploy Pipeline
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                AGI agents verify probabilities and auto-deploy high-success business flows
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                {isActive ? '🟢 AUTO-DEPLOYING' : '🔴 INACTIVE'}
              </Badge>
              {isActive ? (
                <Button onClick={deactivateAutoDeploy} variant="destructive" size="sm">
                  Stop Pipeline
                </Button>
              ) : (
                <Button onClick={activateAutoDeploy} className="bg-purple-600 hover:bg-purple-700" size="sm">
                  Start Auto-Deploy
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Total Deployments</div>
              <div className="text-white font-bold text-lg">{stats.total}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Live Sites</div>
              <div className="text-green-400 font-bold text-lg">{stats.live}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Success Rate</div>
              <div className="text-blue-400 font-bold text-lg">{stats.successRate.toFixed(0)}%</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Total Revenue</div>
              <div className="text-purple-400 font-bold text-lg">${totalRevenue.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Pipeline Efficiency</span>
              <span className="text-white">{stats.successRate.toFixed(1)}%</span>
            </div>
            <Progress value={stats.successRate} className="h-2" />
          </div>

          <div className="border-t border-slate-600 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={deploy100PercentSuccess}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold flex-1"
                size="lg"
              >
                <Target className="w-5 h-5 mr-2" />
                🎯 DEPLOY 100% SUCCESS RATE FLOW
              </Button>
              
              <Button 
                onClick={activateAutoDeploy}
                disabled={isActive}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Auto-Deploy Mode
              </Button>
              
              <Button 
                variant="outline"
                className="border-gold-500 text-gold-400 hover:bg-gold-500/10"
                size="lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                All Loops Active ✅
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && deployments.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">⚡ Live Deployment Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{getStatusIcon(deployment.status)}</span>
                        <span className="text-white font-medium">{deployment.businessPath}</span>
                        {deployment.status === 'live' && (
                          <a 
                            href={deployment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            View Live Site
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {deployment.agiDecision}
                      </div>
                      {deployment.status === 'live' && (
                        <div className="text-xs text-gray-500 mt-2 flex gap-4">
                          <span>👥 {deployment.metrics.visitors} visitors</span>
                          <span>✅ {deployment.metrics.conversions} conversions</span>
                          <span>💰 ${deployment.metrics.revenue}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className={getStatusColor(deployment.status)}>
                        {deployment.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {deployment.createdAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isActive && deployments.filter(d => d.status === 'live').length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Revenue Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deployments.filter(d => d.status === 'live').map((deployment) => (
                <div key={deployment.id} className="bg-slate-700/50 p-3 rounded">
                  <div className="text-white font-medium text-sm">{deployment.businessPath}</div>
                  <div className="text-green-400 font-bold text-lg">${deployment.metrics.revenue}</div>
                  <div className="text-xs text-gray-400">
                    {deployment.metrics.conversions} conversions from {deployment.metrics.visitors} visitors
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

export default AutoDeployDashboard;
