
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LogsViewer from '../components/LogsViewer';
import { ScrollText, Activity } from 'lucide-react';
import { agentLogger } from '@/agents/AgentLogger';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const storedLogs = await agentLogger.getStoredLogs(50);
      const localLogs = agentLogger.getLogs(50);
      
      const combinedLogs = [
        ...storedLogs.map(log => ({
          agent: log.agent_name,
          action: log.action,
          result: log.output || log.result,
          level: log.status === 'error' ? 'error' : 'info',
          timestamp: log.timestamp
        })),
        ...localLogs
      ];

      setLogs(combinedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'success': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <ScrollText className="h-8 w-8 text-purple-400" />
          System Logs
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            <Activity className="h-3 w-3 mr-1" />
            Live Monitoring
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {logs.length} Entries
          </Badge>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <LogsViewer logs={logs} />
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Log Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{logs.filter(l => l.level === 'success').length}</div>
              <div className="text-sm text-gray-400">Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{logs.filter(l => l.level === 'info').length}</div>
              <div className="text-sm text-gray-400">Info</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{logs.filter(l => l.level === 'warning').length}</div>
              <div className="text-sm text-gray-400">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{logs.filter(l => l.level === 'error').length}</div>
              <div className="text-sm text-gray-400">Error</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
