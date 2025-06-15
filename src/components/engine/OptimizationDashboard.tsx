
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Zap, Activity, TrendingUp, Users, Database, Mail } from 'lucide-react';
import OptimizationPlan from './OptimizationPlan';

const OptimizationDashboard = () => {
  const systemMetrics = {
    vectorMemories: 48,
    activeAgents: 52,
    leadsGenerated: 487,
    emailsSent: 156,
    workflowsActive: 8,
    systemEfficiency: 95
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGI System Optimization</h2>
        <p className="text-gray-400">Execute full optimization plan to reach 95%+ operational capacity</p>
      </div>

      {/* Current System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.vectorMemories}</div>
                <div className="text-xs text-gray-400">Vector Memories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.activeAgents}</div>
                <div className="text-xs text-gray-400">Active Agents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.leadsGenerated}</div>
                <div className="text-xs text-gray-400">Leads Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.emailsSent}</div>
                <div className="text-xs text-gray-400">Emails Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.workflowsActive}</div>
                <div className="text-xs text-gray-400">Active Workflows</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/60 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              <div>
                <div className="text-lg font-bold text-white">{systemMetrics.systemEfficiency}%</div>
                <div className="text-xs text-gray-400">Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5" />
            Current System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Vector Memory</span>
                <Badge className="bg-green-500 text-white">Operational</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Lead Generation</span>
                <Badge className="bg-yellow-500 text-white">Ready</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cross-System Integration</span>
                <Badge className="bg-blue-500 text-white">Testing</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Performance Optimization</span>
                <Badge className="bg-purple-500 text-white">In Progress</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Business Validation</span>
                <Badge className="bg-orange-500 text-white">Pending</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Overall System</span>
                <Badge className="bg-green-500 text-white">85% Complete</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Plan Execution */}
      <OptimizationPlan />

      {/* Success Criteria */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Success Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">500+ Vector Memories</span>
                <span className="text-green-400">Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">1000+ Qualified Leads</span>
                <span className="text-green-400">Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">100+ Emails Sent</span>
                <span className="text-green-400">Target</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">3+ Workflows Validated</span>
                <span className="text-green-400">Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">95%+ System Completion</span>
                <span className="text-green-400">Target</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Real Business ROI</span>
                <span className="text-green-400">Target</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationDashboard;
