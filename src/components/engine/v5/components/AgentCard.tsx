
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Zap, Brain } from 'lucide-react';

interface AgentCardProps {
  agentName: string;
  status: string;
  lastAction: string;
  description?: string;
  version?: string;
  category?: string;
  onRunAgent: () => void;
  isRunning?: boolean;
}

const AgentCard = ({ 
  agentName, 
  status, 
  lastAction, 
  description,
  version,
  category,
  onRunAgent, 
  isRunning = false 
}: AgentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'bg-green-500 text-white';
      case 'IDLE': return 'bg-gray-500 text-white';
      case 'ERROR': return 'bg-red-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'text-blue-400 border-blue-400';
      case 'enhanced': return 'text-purple-400 border-purple-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <Card className="bg-slate-700/50 border-slate-600/30 hover:border-purple-500/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            {agentName.replace('Agent', '')}
          </CardTitle>
          <div className="flex items-center gap-1">
            {version && (
              <Badge variant="outline" className={`text-xs ${getCategoryColor(category)}`}>
                {version}
              </Badge>
            )}
            <Badge className={`text-xs ${getStatusColor(status)}`}>
              {status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && (
          <p className="text-xs text-gray-300">{description}</p>
        )}
        
        <div className="text-xs text-gray-400">
          <span className="font-medium">Last Action:</span> {lastAction}
        </div>
        
        <Button
          onClick={onRunAgent}
          disabled={isRunning}
          size="sm"
          className={`w-full ${
            category === 'enhanced' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white disabled:opacity-50`}
        >
          {isRunning ? (
            <>
              <Zap className="h-3 w-3 mr-1 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Execute
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
