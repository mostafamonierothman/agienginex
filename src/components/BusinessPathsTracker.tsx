
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BusinessPathsTrackerProps {
  engineState: any;
}

const BusinessPathsTracker = ({ engineState }: BusinessPathsTrackerProps) => {
  const businessPaths = [
    {
      id: 'medjourney_main',
      name: 'MedJourney+ Main',
      currentRevenue: engineState?.current_revenue?.medjourney_main || 0,
      target: 1000000,
      status: engineState?.current_revenue?.medjourney_main > 0 ? 'SCALING' : 'BUILDING',
      markets: ['UK', 'EU', 'USA'],
      description: 'Core medical journey optimization platform'
    },
    {
      id: 'geo_expansion',
      name: 'Geographic Expansion',
      currentRevenue: engineState?.current_revenue?.geo_expansion || 0,
      target: 500000,
      status: engineState?.current_revenue?.geo_expansion > 0 ? 'SCALING' : 'BUILDING',
      markets: ['UK', 'USA', 'EU'],
      description: 'Multi-market expansion initiatives'
    },
    {
      id: 'waiting_list_targeting',
      name: 'Waiting List Targeting',
      currentRevenue: engineState?.current_revenue?.waiting_list_targeting || 0,
      target: 200000,
      status: engineState?.current_revenue?.waiting_list_targeting > 0 ? 'TESTING' : 'PLANNING',
      markets: ['NHS', 'EU Healthcare'],
      description: 'Healthcare waiting list optimization'
    },
    {
      id: 'billionaire_path',
      name: 'Billionaire Path',
      currentRevenue: engineState?.current_revenue?.billionaire_path || 0,
      target: 1000000000,
      status: 'PLANNING',
      markets: ['Global'],
      description: 'High-value strategic initiatives'
    },
    {
      id: 'agi_healthcare',
      name: 'AGI for Healthcare',
      currentRevenue: engineState?.current_revenue?.agi_healthcare || 0,
      target: 500000,
      status: 'PLANNING',
      markets: ['USA', 'Canada'],
      description: 'Advanced AI healthcare solutions'
    },
    {
      id: 'sweden_health',
      name: 'Sweden Health Dashboard',
      currentRevenue: engineState?.current_revenue?.sweden_health || 0,
      target: 100000,
      status: 'PLANNING',
      markets: ['Sweden', 'Nordic'],
      description: 'Health analytics and insights'
    },
    {
      id: 'sweden_crime',
      name: 'Sweden Crime Dashboard',
      currentRevenue: engineState?.current_revenue?.sweden_crime || 0,
      target: 100000,
      status: 'PLANNING',
      markets: ['Sweden', 'Nordic'],
      description: 'Crime analytics and prevention'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCALING': return 'text-green-400 border-green-400';
      case 'BUILDING': return 'text-blue-400 border-blue-400';
      case 'TESTING': return 'text-yellow-400 border-yellow-400';
      case 'PLANNING': return 'text-gray-400 border-gray-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const totalRevenue = businessPaths.reduce((sum, path) => sum + path.currentRevenue, 0);
  const totalTarget = businessPaths.reduce((sum, path) => sum + path.target, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Business Paths Tracker
        </h2>
        <p className="text-gray-400 mt-2">Multi-Path Revenue Engine • {formatCurrency(totalRevenue)} → {formatCurrency(totalTarget)}+</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
          <TabsTrigger value="detailed" className="text-white">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {businessPaths.map((path) => {
              const progress = calculateProgress(path.currentRevenue, path.target);
              return (
                <Card key={path.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{path.name}</CardTitle>
                      <Badge variant="outline" className={getStatusColor(path.status)}>
                        {path.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Revenue Progress</span>
                        <span className="text-white">{formatCurrency(path.currentRevenue)} / {formatCurrency(path.target)}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{progress.toFixed(1)}% complete</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-300">Active Markets</h4>
                      <div className="flex flex-wrap gap-1">
                        {path.markets.map((market) => (
                          <Badge key={market} variant="secondary" className="text-xs">
                            {market}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">{path.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Total Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{formatCurrency(totalRevenue)}</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{engineState?.active_agents || 0}</div>
                  <div className="text-sm text-gray-400">Active Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{engineState?.estimated_days_to_10M_path || 'N/A'}</div>
                  <div className="text-sm text-gray-400">Days to $10M</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{engineState?.tasks_completed_last_sec || 0}</div>
                  <div className="text-sm text-gray-400">Tasks/Second</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {businessPaths.map((path) => (
            <Card key={path.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {path.name}
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Optimize Path
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Financial Metrics</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Revenue:</span>
                        <span className="text-white">{formatCurrency(path.currentRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Revenue:</span>
                        <span className="text-green-400">{formatCurrency(path.target)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Progress:</span>
                        <span className="text-white">{calculateProgress(path.currentRevenue, path.target).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Status & Markets</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant="outline" className={getStatusColor(path.status)}>
                          {path.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Markets:</span>
                        <span className="text-white">{path.markets.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Market Details</h4>
                    <div className="space-y-1">
                      {path.markets.map((market) => (
                        <div key={market} className="flex justify-between">
                          <span className="text-gray-400">{market}:</span>
                          <Badge variant="outline" className={path.currentRevenue > 0 ? "text-green-400 border-green-400" : "text-gray-400 border-gray-400"}>
                            {path.currentRevenue > 0 ? 'ACTIVE' : 'PLANNED'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessPathsTracker;
