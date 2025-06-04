
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fastAPIService, RunAgentResponse } from '@/services/FastAPIService';
import { Zap, Play, Clock } from 'lucide-react';

const DynamicAgentRunner = () => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [inputData, setInputData] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<RunAgentResponse | null>(null);

  const availableAgents = [
    'next_move_agent',
    'opportunity_agent',
    'learning_agent',
    'optimization_agent',
    'coordination_agent',
    'performance_agent'
  ];

  const runAgent = async () => {
    if (!selectedAgent) return;
    
    setIsRunning(true);
    console.log(`Running agent: ${selectedAgent} with input: ${inputData || 'none'}`);
    
    try {
      const result = await fastAPIService.runAgent(selectedAgent, inputData || null);
      setLastResult(result);
      console.log('Agent execution result:', result);
    } catch (error) {
      console.error('Error running agent:', error);
      setLastResult({
        result: 'Agent execution failed',
        agent_name: selectedAgent,
        status: 'error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" />
          🤖 Dynamic Agent Runner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="agent-select" className="text-gray-400">Select Agent</Label>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                <SelectValue placeholder="Choose an agent..." />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agent.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="input-data" className="text-gray-400">Input Data (Optional)</Label>
            <Input
              id="input-data"
              placeholder="Enter input for the agent..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <Button 
          onClick={runAgent} 
          disabled={!selectedAgent || isRunning}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running Agent...' : 'Run Agent'}
        </Button>

        {lastResult && (
          <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Agent Execution Result</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={lastResult.status === 'error' ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}
                >
                  {lastResult.status === 'error' ? '❌ ERROR' : '✅ SUCCESS'}
                </Badge>
                {lastResult.execution_time && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {lastResult.execution_time}ms
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Agent:</span>
                <p className="text-white">{lastResult.agent_name}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Result:</span>
                <p className="text-white text-sm bg-slate-800 p-2 rounded mt-1">
                  {lastResult.result}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicAgentRunner;
