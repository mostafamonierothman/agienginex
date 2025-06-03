
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface EngineConnectionProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const EngineConnection = ({ apiUrl, setApiUrl, apiKey, setApiKey }: EngineConnectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Engine Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="API URL (e.g., https://api.agienginex.ai)"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="API Key (Bearer Token)"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineConnection;
