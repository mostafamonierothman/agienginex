
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { runAgentAPI } from '@/api/runAgent';
import { toast } from '@/hooks/use-toast';

const AgentAPIInterface = () => {
  const [agentName, setAgentName] = useState('ExecutiveAgent');
  const [task, setTask] = useState('Give me a prioritized action list to generate leads and revenue today using all currently connected systems: Supabase, PayPal, Cloudflare, OpenAI, social media channels');
  const [parameters, setParameters] = useState('{}');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [requestTime, setRequestTime] = useState(null);

  const handleRunAgent = async () => {
    setIsRunning(true);
    setRequestTime(Date.now());
    
    try {
      let parsedParameters = {};
      if (parameters.trim()) {
        try {
          parsedParameters = JSON.parse(parameters);
        } catch (error) {
          toast({
            title: "Invalid Parameters",
            description: "Parameters must be valid JSON",
            variant: "destructive",
          });
          setIsRunning(false);
          return;
        }
      }

      const request = {
        agent_name: agentName,
        task: task,
        parameters: parsedParameters
      };

      console.log('🚀 API Request:', request);
      
      const response = await runAgentAPI(request);
      
      setResult(response);
      
      if (response.success) {
        toast({
          title: "✅ Agent Executed Successfully",
          description: `${agentName} completed the task`,
        });
      } else {
        toast({
          title: "❌ Agent Execution Failed",
          description: response.message,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('API execution error:', error);
      toast({
        title: "❌ API Error",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const executionTime = requestTime && result ? Date.now() - requestTime : null;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-400" />
            Agent API Interface
            <Badge variant="outline" className="ml-auto text-cyan-400 border-cyan-400">
              POST /run_agent
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="text-gray-400">Agent Name</Label>
              <Input
                id="agent-name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="ExecutiveAgent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parameters" className="text-gray-400">Parameters (JSON)</Label>
              <Input
                id="parameters"
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                placeholder="{}"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task" className="text-gray-400">Task</Label>
            <Textarea
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white h-24"
              placeholder="Describe the task for the agent..."
            />
          </div>

          <Button 
            onClick={handleRunAgent} 
            disabled={isRunning || !agentName.trim() || !task.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Agent...' : 'Execute Agent'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              API Response
              <div className="flex items-center gap-2 ml-auto">
                {result.success ? (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    SUCCESS
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    <XCircle className="w-3 h-3 mr-1" />
                    ERROR
                  </Badge>
                )}
                {executionTime && (
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {executionTime}ms
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <pre className="text-sm text-gray-300 bg-slate-900/50 p-4 rounded border border-slate-600 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AgentAPIInterface;
