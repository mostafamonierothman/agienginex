
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
  const setHuggingFaceUrl = () => {
    onBackendUrlChange('https://othmanm-agienginex.hf.space');
  };

  const setLocalUrl = () => {
    onBackendUrlChange('http://localhost:8000');
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
      <h3 className="text-white font-medium mb-3">🔗 Backend Configuration</h3>
      
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={setHuggingFaceUrl} 
            size="sm" 
            className="bg-orange-600 hover:bg-orange-700"
          >
            🤗 HuggingFace Cloud
          </Button>
          <Button 
            onClick={setLocalUrl} 
            size="sm" 
            variant="outline"
            className="border-slate-500 text-white"
          >
            💻 Local Development
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="backend-url" className="text-gray-400">Backend URL</Label>
            <Input
              id="backend-url"
              placeholder="Backend endpoint URL"
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

        {backendUrl.includes('hf.space') && (
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-600 text-white">
              🌍 CLOUD DEPLOYMENT
            </Badge>
            <span className="text-sm text-gray-400">
              Accessible from anywhere!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendConfiguration;
