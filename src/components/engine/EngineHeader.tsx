
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EngineHeaderProps {
  title?: string;
  subtitle?: string;
  isConnected?: boolean;
  apiKey?: string;
  lastUpdate?: Date | null;
}

const EngineHeader = ({ 
  title = "AGI ENGINE X",
  subtitle = "Self-Optimizing Intelligence • 1-Second Loop • Trillionaire Path",
  isConnected = false, 
  apiKey = "", 
  lastUpdate = null 
}: EngineHeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-xl text-gray-300">
        {subtitle}
      </p>
      <div className="flex items-center justify-center space-x-4">
        <Badge variant={isConnected ? "default" : "destructive"} className="text-sm">
          {isConnected ? "🟢 CONNECTED" : apiKey ? "🔴 CONNECTION ERROR" : "🟡 DEMO MODE"}
        </Badge>
        {lastUpdate && (
          <span className="text-sm text-gray-400">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default EngineHeader;
