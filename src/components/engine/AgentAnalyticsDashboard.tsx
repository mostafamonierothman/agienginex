
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Zap, TrendingUp, Activity } from 'lucide-react';

interface AgentMetrics {
  name: string;
  type: string;
  runs: number;
  success_rate: number;
  last_run: string;
  performance_score: number;
}

const AgentAnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState<AgentMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRuns, setTotalRuns] = useState(0);
  const [avgPerformance, setAvgPerformance] = useState(0);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Get agent activity from supervisor queue
      const { data: activities, error } = await supabase
        .from('supervisor_queue')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process data to create metrics
      const agentStats = new Map<string, any>();
      let total = 0;

      activities?.forEach(activity => {
        const agentName = activity.agent_name || 'unknown';
        if (!agentStats.has(agentName)) {
          agentStats.set(agentName, {
            name: agentName,
            type: agentName.replace('_agent', '').replace('_', ' '),
            runs: 0,
            successes: 0,
            last_run: activity.timestamp,
            performance_score: 75 + Math.random() * 25 // Mock score
          });
        }
        
        const stats = agentStats.get(agentName);
        stats.runs++;
        if (activity.status === 'completed') stats.successes++;
        if (new Date(activity.timestamp) > new Date(stats.last_run)) {
          stats.last_run = activity.timestamp;
        }
        total++;
      });

      // Convert to array and calculate success rates
      const metricsArray = Array.from(agentStats.values()).map(stats => ({
        ...stats,
        success_rate: stats.runs > 0 ? (stats.successes / stats.runs) * 100 : 0,
        type: stats.name.includes('factory') ? 'Factory' : 
              stats.name.includes('research') ? 'Research' :
              stats.name.includes('learning') ? 'Learning' :
              stats.name.includes('critic') ? 'Critic' :
              stats.name.includes('supervisor') ? 'Supervisor' : 'General'
      }));

      setMetrics(metricsArray);
      setTotalRuns(total);
      setAvgPerformance(metricsArray.reduce((sum, m) => sum + m.performance_score, 0) / metricsArray.length || 0);

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const chartData = metrics.map(metric => ({
    name: metric.name.replace('_agent', '').substring(0, 10),
    runs: metric.runs,
    success_rate: metric.success_rate,
    performance: metric.performance_score
  }));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-400" />
          📊 Agent Analytics Dashboard
        </CardTitle>
        <div className="flex gap-4">
          <Button 
            onClick={loadAnalytics} 
            disabled={isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Loading...' : 'Refresh Data'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Total Agents</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400 text-sm">Total Runs</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalRuns}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-gray-400 text-sm">Avg Performance</span>
              </div>
              <div className="text-2xl font-bold text-white">{avgPerformance.toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400 text-sm">Active Now</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.filter(m => m.runs > 0).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Agent Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="runs" fill="#8B5CF6" />
                <Bar dataKey="performance" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Details Table */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-sm">Individual Agent Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      {metric.type}
                    </Badge>
                    <span className="text-white font-medium">{metric.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white text-sm">{metric.runs} runs</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(metric.last_run).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="w-20">
                      <Progress 
                        value={metric.success_rate} 
                        className="h-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {metric.success_rate.toFixed(0)}% success
                      </div>
                    </div>
                    
                    <div className="w-16 text-right">
                      <div className="text-green-400 font-bold">
                        {metric.performance_score.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {metrics.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No agent metrics available yet. Start the autonomous loop to see data.
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AgentAnalyticsDashboard;
