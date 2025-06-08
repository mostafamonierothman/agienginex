
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  agent: string;
  action: string;
  result: string;
  level: string;
  timestamp: string;
}

interface LogsViewerProps {
  logs: LogEntry[];
}

const LogsViewer = ({ logs }: LogsViewerProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'success': return 'bg-green-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="h-96 overflow-y-auto space-y-2">
      {logs.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No logs available
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="p-3 bg-slate-700/50 rounded border border-slate-600/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getLevelIcon(log.level)}</span>
                <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                  {log.agent}
                </Badge>
                <Badge className={`text-xs ${getLevelColor(log.level)}`}>
                  {log.level.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div className="text-sm text-white mb-1">
              <span className="font-medium">Action:</span> {log.action}
            </div>
            <div className="text-xs text-gray-300">
              <span className="font-medium">Result:</span> {log.result}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LogsViewer;
