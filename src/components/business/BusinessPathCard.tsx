
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface BusinessPathCardProps {
  path: BusinessPath;
  onOptimize?: (pathId: string) => void;
}

const BusinessPathCard = ({ path, onOptimize }: BusinessPathCardProps) => {
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

  const progress = calculateProgress(path.currentRevenue, path.target);

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
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
};

export default BusinessPathCard;
