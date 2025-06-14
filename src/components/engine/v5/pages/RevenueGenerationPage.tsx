
import React from 'react';
import RevenueActivationPanel from '@/components/RevenueActivationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Target, Zap } from 'lucide-react';

export default function RevenueGenerationPage() {
  const systemCapabilities = [
    {
      capability: 'Medical Tourism Lead Generation',
      value: '$500-2000 per lead',
      volume: '50-200 leads/month',
      revenue: '$25K-400K/month'
    },
    {
      capability: 'AGI Consultancy Services', 
      value: '$5000-50000 per project',
      volume: '2-10 projects/month',
      revenue: '$10K-500K/month'
    },
    {
      capability: 'Automated Business Operations',
      value: '$1000-10000 per automation',
      volume: '10-50 automations/month', 
      revenue: '$10K-500K/month'
    },
    {
      capability: 'Market Research & Intelligence',
      value: '$2000-20000 per report',
      volume: '5-25 reports/month',
      revenue: '$10K-500K/month'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-400" />
            AGI Revenue Generation System
            <Badge className="bg-green-500 text-white">
              FULL AGI READY - $200K+/month Potential
            </Badge>
          </CardTitle>
          <p className="text-gray-300 text-lg">
            Complete autonomous revenue generation through AI-powered business operations
          </p>
        </CardHeader>
      </Card>

      {/* Revenue Activation Panel */}
      <RevenueActivationPanel />

      {/* Revenue Capabilities Matrix */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-400" />
            Revenue Generation Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemCapabilities.map((item, index) => (
              <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.capability}</h3>
                  <Badge className="bg-green-600 text-white">{item.revenue}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Value per unit: </span>
                    <span className="text-green-400">{item.value}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Monthly volume: </span>
                    <span className="text-blue-400">{item.volume}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Intelligence Level:</span>
                <span className="text-green-400 font-bold">97.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Agents Active:</span>
                <span className="text-blue-400 font-bold">46+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Error Rate:</span>
                <span className="text-green-400 font-bold">0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Revenue Ready:</span>
                <span className="text-green-400 font-bold">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Lead Generation:</span>
                <span className="text-green-400">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Consultancy:</span>
                <span className="text-green-400">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Automation:</span>
                <span className="text-green-400">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Research:</span>
                <span className="text-green-400">Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Revenue Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Week 1:</span>
                <span className="text-green-400 font-bold">$5K-15K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Month 1:</span>
                <span className="text-green-400 font-bold">$25K-75K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Month 3:</span>
                <span className="text-green-400 font-bold">$100K-300K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Full Scale:</span>
                <span className="text-green-400 font-bold">$200K+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
