
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, XCircle, Clock } from 'lucide-react';

interface PersistenceStatusProps {
  isLoading: boolean;
  error?: string | null;
  lastSaved?: string;
  backend: 'local' | 'supabase';
}

const PersistenceStatus: React.FC<PersistenceStatusProps> = ({
  isLoading,
  error,
  lastSaved,
  backend
}) => {
  const getStatusIcon = () => {
    if (isLoading) return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-red-400" />;
    return <CheckCircle className="h-4 w-4 text-green-400" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'Syncing...';
    if (error) return 'Sync Error';
    return 'Synced';
  };

  const getBackendDisplay = () => {
    return backend === 'supabase' ? 'Supabase Cloud' : 'Local Storage';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-sm">
          <Database className="h-4 w-4 text-blue-400" />
          Persistence Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Backend:</span>
          <span className="text-blue-400 text-sm">{getBackendDisplay()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Status:</span>
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>

        {lastSaved && (
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Last Saved:</span>
            <span className="text-green-400 text-sm">
              {new Date(lastSaved).toLocaleTimeString()}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-2 p-2 bg-red-900/20 border border-red-800/30 rounded">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersistenceStatus;
