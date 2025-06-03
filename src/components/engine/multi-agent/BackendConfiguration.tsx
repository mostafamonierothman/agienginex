
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BackendConfigurationProps {
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
  onTestConnection: () => void;
}

const BackendConfiguration = ({ 
  backendUrl, 
  onBackendUrlChange, 
  onTestConnection 
}: BackendConfigurationProps) => {
  return (
    <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
      <h3 className="text-white font-medium mb-3">🔗 FastAPI Backend Configuration</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Label htmlFor="backend-url" className="text-gray-400">Backend URL</Label>
          <Input
            id="backend-url"
            placeholder="http://localhost:8000"
            value={backendUrl}
            onChange={(e) => onBackendUrlChange(e.target.value)}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={onTestConnection} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            Test Connection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BackendConfiguration;
