
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BusinessPathsTracker = () => {
  const businessPaths = [
    {
      id: 'medjourney',
      name: 'MedJourney+',
      currentRevenue: '$320K',
      target: '$1M',
      progress: 32,
      status: 'SCALING',
      markets: ['UK', 'EU', 'USA'],
      metrics: {
        dailySignups: 47,
        conversionRate: '12.4%',
        avgRevPerUser: '$89'
      }
    },
    {
      id: 'healthcare_agi',
      name: 'AGI for Healthcare',
      currentRevenue: '$45K',
      target: '$500K',
      progress: 9,
      status: 'BUILDING',
      markets: ['USA', 'Canada'],
      metrics: {
        dailySignups: 12,
        conversionRate: '8.7%',
        avgRevPerUser: '$156'
      }
    },
    {
      id: 'sweden_dashboards',
      name: 'Sweden Health/Crime Dashboards',
      currentRevenue: '$23K',
      target: '$200K',
      progress: 11.5,
      status: 'TESTING',
      markets: ['Sweden', 'Norway'],
      metrics: {
        dailySignups: 8,
        conversionRate: '15.2%',
        avgRevPerUser: '$67'
      }
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Business Paths Tracker
        </h2>
        <p className="text-gray-400 mt-2">Multi-Path Revenue Engine • $1M → $10M → $100M → $1B+</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
          <TabsTrigger value="detailed" className="text-white">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {businessPaths.map((path) => (
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
                      <span className="text-white">{path.currentRevenue} / {path.target}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{path.progress}% complete</span>
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

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Daily Signups</span>
                      <div className="text-white font-bold">{path.metrics.dailySignups}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Conversion</span>
                      <div className="text-white font-bold">{path.metrics.conversionRate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Total Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">$388K</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">67</div>
                  <div className="text-sm text-gray-400">Daily Signups</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">11.8%</div>
                  <div className="text-sm text-gray-400">Avg Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">$104</div>
                  <div className="text-sm text-gray-400">Avg Rev/User</div>
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
                        <span className="text-white">{path.currentRevenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Revenue:</span>
                        <span className="text-green-400">{path.target}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Rev/User:</span>
                        <span className="text-white">{path.metrics.avgRevPerUser}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Growth Metrics</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Signups:</span>
                        <span className="text-white">{path.metrics.dailySignups}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Conversion Rate:</span>
                        <span className="text-white">{path.metrics.conversionRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge variant="outline" className={getStatusColor(path.status)}>
                          {path.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Market Expansion</h4>
                    <div className="space-y-1">
                      {path.markets.map((market) => (
                        <div key={market} className="flex justify-between">
                          <span className="text-gray-400">{market}:</span>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            ACTIVE
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
