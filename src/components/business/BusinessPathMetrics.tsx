
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BusinessPath {
  id: string;
  name: string;
  currentRevenue: number;
  target: number;
  status: string;
  markets: string[];
  description: string;
}

interface BusinessPathMetricsProps {
  path: BusinessPath;
  onOptimize?: (pathId: string) => void;
}

const BusinessPathMetrics = ({ path, onOptimize }: BusinessPathMetricsProps) => {
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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          {path.name}
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={() => onOptimize?.(path.id)}
          >
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
  );
};

export default BusinessPathMetrics;
