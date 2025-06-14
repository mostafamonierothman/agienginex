
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Zap, Brain, Loader2 } from 'lucide-react';

interface AgentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
}

interface AgentCardProps {
  agent: AgentInfo;
  isRunning: boolean;
  onRun: (agentName: string) => Promise<void>;
}

const AgentCard = ({ agent, isRunning, onRun }: AgentCardProps) => {
  const [inputParam, setInputParam] = useState('');

  const getCategoryColor = (category: string) => {
    const colors = {
      'Core': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Coordination': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Strategic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Tool': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Enhanced': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'V7': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Emergency': 'bg-red-500/20 text-red-400 border-red-500/30',
      'AGO': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const handleExecute = async () => {
    const params = inputParam ? { param: inputParam } : {};
    await onRun(agent.name);
    setInputParam(''); // Clear input after execution
  };

  // Get specific input placeholder based on agent type
  const getInputPlaceholder = (agentName: string) => {
    const placeholders = {
      'BrowserAgent': 'Enter URL to browse',
      'GoalAgent': 'Enter goal or command',
      'APIConnectorAgent': 'API endpoint or data',
      'ResearchAgent': 'Research topic',
      'OpportunityAgent': 'Market or opportunity area',
      'MetaAgent': 'System analysis target',
      'SecurityAgent': 'Security scan target',
      'CreativityAgent': 'Creative prompt or idea'
    };
    return placeholders[agentName] || 'Input parameter (optional)';
  };

  return (
    <Card className="bg-slate-700/50 border-slate-600/30 hover:border-purple-500/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-400" />
            {agent.name.replace('Agent', '')}
          </CardTitle>
          <div className="flex items-center gap-1">
            {agent.version && (
              <Badge variant="outline" className={`text-xs ${getCategoryColor(agent.category)}`}>
                {agent.version}
              </Badge>
            )}
            <Badge className={`text-xs ${isRunning ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
              {isRunning ? 'RUNNING' : 'IDLE'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agent.description && (
          <p className="text-xs text-gray-300">{agent.description}</p>
        )}
        
        {/* Progress Bar */}
        {isRunning && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full animate-pulse w-full"></div>
          </div>
        )}

        {/* Dynamic Input Parameter */}
        <Input
          type="text"
          placeholder={getInputPlaceholder(agent.name)}
          value={inputParam}
          onChange={(e) => setInputParam(e.target.value)}
          className="bg-slate-600 border-slate-500 text-white text-xs h-8"
          disabled={isRunning}
        />
        
        <Button
          onClick={handleExecute}
          disabled={isRunning}
          size="sm"
          className={`w-full ${
            agent.category === 'Enhanced' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white disabled:opacity-50 h-8 text-xs`}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
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
