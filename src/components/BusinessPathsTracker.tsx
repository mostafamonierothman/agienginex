
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessPathCard from './business/BusinessPathCard';
import BusinessPathMetrics from './business/BusinessPathMetrics';
import PortfolioSummary from './business/PortfolioSummary';

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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const totalRevenue = businessPaths.reduce((sum, path) => sum + path.currentRevenue, 0);
  const totalTarget = businessPaths.reduce((sum, path) => sum + path.target, 0);

  const handleOptimize = (pathId: string) => {
    console.log(`Optimizing path: ${pathId}`);
    // Add optimization logic here if needed
  };

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
            {businessPaths.map((path) => (
              <BusinessPathCard 
                key={path.id} 
                path={path} 
                onOptimize={handleOptimize}
              />
            ))}
          </div>

          <PortfolioSummary 
            totalRevenue={totalRevenue}
            engineState={engineState}
          />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {businessPaths.map((path) => (
            <BusinessPathMetrics 
              key={path.id} 
              path={path} 
              onOptimize={handleOptimize}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessPathsTracker;
