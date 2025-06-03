
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap, Target } from 'lucide-react';
import { BackendData } from '@/hooks/useBackendPolling';

interface LiveBackendDataProps {
  backendData: BackendData | null;
  isConnected: boolean;
  isPolling: boolean;
  onRefresh: () => void;
}

const LiveBackendData = ({ 
  backendData, 
  isConnected, 
  isPolling, 
  onRefresh 
}: LiveBackendDataProps) => {
  if (!backendData) return null;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            🚀 Live Backend Intelligence
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isConnected ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}>
              {isConnected ? '🟢 LIVE' : '🔴 LOCAL SIM'}
            </Badge>
            <Button
              onClick={onRefresh}
              size="sm"
              disabled={isPolling}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <h3 className="text-blue-400 font-medium">Next Move</h3>
            </div>
            <p className="text-white text-sm">{backendData.nextMove}</p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-400" />
              <h3 className="text-green-400 font-medium">Opportunity</h3>
            </div>
            <p className="text-white text-sm">{backendData.opportunity}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Dynamic Loop Interval: {backendData.loopInterval}s</span>
          <span className="text-gray-400">
            Last Update: {backendData.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBackendData;
