
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioSummaryProps {
  totalRevenue: number;
  engineState: any;
}

const PortfolioSummary = ({ totalRevenue, engineState }: PortfolioSummaryProps) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
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
  );
};

export default PortfolioSummary;
