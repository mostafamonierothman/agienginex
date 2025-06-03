import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Zap, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Assistant {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  lastProcessed: Date | null;
  tasksProcessed: number;
  avgProcessingTime: number;
  assistantId: string;
}

interface ChainMetrics {
  totalCycles: number;
  avgCycleTime: number;
  tasksPerSecond: number;
  isRunning: boolean;
  lastCycleStart: Date | null;
}

const APIChain = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [assistantIds, setAssistantIds] = useState({
    opportunity_seeker: '',
    leadgen: '',
    qualifier: '',
    booking: '',
    revenue_tracker: ''
  });
  
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: 'opportunity_seeker',
      name: '🔍 Opportunity Seeker',
      description: 'Scans market for opportunities',
      status: 'idle',
      lastProcessed: null,
      tasksProcessed: 0,
      avgProcessingTime: 0,
      assistantId: ''
    },
    {
      id: 'leadgen',
      name: '🎯 Lead Generator',
      description: 'Generates qualified leads',
      status: 'idle',
      lastProcessed: null,
      tasksProcessed: 0,
      avgProcessingTime: 0,
      assistantId: ''
    },
    {
      id: 'qualifier',
      name: '✅ Lead Qualifier',
      description: 'Qualifies and scores leads',
      status: 'idle',
      lastProcessed: null,
      tasksProcessed: 0,
      avgProcessingTime: 0,
      assistantId: ''
    },
    {
      id: 'booking',
      name: '📅 Booking Engine',
      description: 'Converts leads to bookings',
      status: 'idle',
      lastProcessed: null,
      tasksProcessed: 0,
      avgProcessingTime: 0,
      assistantId: ''
    },
    {
      id: 'revenue_tracker',
      name: '💰 Revenue Tracker',
      description: 'Tracks and optimizes revenue',
      status: 'idle',
      lastProcessed: null,
      tasksProcessed: 0,
      avgProcessingTime: 0,
      assistantId: ''
    }
  ]);

  const [chainMetrics, setChainMetrics] = useState<ChainMetrics>({
    totalCycles: 0,
    avgCycleTime: 0,
    tasksPerSecond: 0,
    isRunning: false,
    lastCycleStart: null
  });

  const [isChainRunning, setIsChainRunning] = useState(false);
  const [chainInterval, setChainInterval] = useState<NodeJS.Timeout | null>(null);

  // Load saved configuration
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    const savedAssistantIds = localStorage.getItem('assistant_ids');
    
    if (savedKey) setOpenAIKey(savedKey);
    if (savedAssistantIds) {
      const ids = JSON.parse(savedAssistantIds);
      setAssistantIds(ids);
      // Update assistants with saved IDs
      setAssistants(prev => prev.map(assistant => ({
        ...assistant,
        assistantId: ids[assistant.id] || ''
      })));
    }
  }, []);

  // Save configuration
  useEffect(() => {
    if (openAIKey) {
      localStorage.setItem('openai_api_key', openAIKey);
    }
    localStorage.setItem('assistant_ids', JSON.stringify(assistantIds));
  }, [openAIKey, assistantIds]);

  // Real OpenAI Assistant API call
  const callOpenAIAssistant = async (assistantId: string, message: string): Promise<string> => {
    if (!openAIKey) {
      throw new Error('OpenAI API key not provided');
    }

    if (!assistantId) {
      // Fallback to chat completion if no assistant ID
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AGI assistant in the Engine X pipeline. Process the input and return structured output for the next stage.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      throw new Error(`Thread creation failed: ${threadResponse.statusText}`);
    }

    const thread = await threadResponse.json();

    // Add message to thread
    await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!runResponse.ok) {
      throw new Error(`Run creation failed: ${runResponse.statusText}`);
    }

    const run = await runResponse.json();

    // Poll for completion
    let runStatus = run;
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      runStatus = await statusResponse.json();
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const messages = await messagesResponse.json();
    const lastMessage = messages.data[0];
    
    return lastMessage.content[0].text.value;
  };

  const runChainCycle = async () => {
    const cycleStart = Date.now();
    console.log('🚀 Starting Real AGI Engine X Pipeline Cycle...');
    
    setChainMetrics(prev => ({ 
      ...prev, 
      lastCycleStart: new Date(),
      totalCycles: prev.totalCycles + 1 
    }));

    try {
      let pipelineData = "Market analysis request: Find high-value opportunities in healthcare AI for premium clients";

      // Process through each assistant in sequence
      for (let i = 0; i < assistants.length; i++) {
        const assistant = assistants[i];
        const assistantStart = Date.now();
        
        // Update status to processing
        setAssistants(prev => prev.map(a => 
          a.id === assistant.id 
            ? { ...a, status: 'processing' as const }
            : a
        ));

        try {
          console.log(`🔄 Processing with ${assistant.name}...`);
          
          // Real OpenAI API call
          const result = await callOpenAIAssistant(
            assistantIds[assistant.id as keyof typeof assistantIds], 
            pipelineData
          );
          
          pipelineData = result; // Pass result to next assistant

          const processingTime = Date.now() - assistantStart;
          
          // Update assistant metrics
          setAssistants(prev => prev.map(a => 
            a.id === assistant.id 
              ? { 
                  ...a, 
                  status: 'complete' as const,
                  lastProcessed: new Date(),
                  tasksProcessed: a.tasksProcessed + 1,
                  avgProcessingTime: (a.avgProcessingTime + processingTime) / 2
                }
              : a
          ));

          console.log(`✅ ${assistant.name} completed in ${processingTime}ms`);
          
        } catch (error) {
          console.error(`❌ ${assistant.name} failed:`, error);
          setAssistants(prev => prev.map(a => 
            a.id === assistant.id 
              ? { ...a, status: 'error' as const }
              : a
          ));
          
          // Continue with mock data on error
          pipelineData = `Error in ${assistant.name}, continuing with mock data...`;
        }
      }

      const cycleTime = Date.now() - cycleStart;
      const tasksPerSec = 5000 / cycleTime; // 5 tasks per cycle

      setChainMetrics(prev => ({
        ...prev,
        avgCycleTime: (prev.avgCycleTime + cycleTime) / 2,
        tasksPerSecond: tasksPerSec
      }));

      console.log(`🎯 Real Pipeline cycle completed in ${cycleTime}ms - ${tasksPerSec.toFixed(1)} tasks/sec`);
      console.log(`📊 Final Result: ${pipelineData.substring(0, 100)}...`);

    } catch (error) {
      console.error('❌ Pipeline cycle failed:', error);
      toast({
        title: "Pipeline Error",
        description: "Chain cycle failed. Check console for details.",
        variant: "destructive",
      });
    }
  };

  const startChain = () => {
    if (!openAIKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to start the chain.",
        variant: "destructive",
      });
      return;
    }

    setIsChainRunning(true);
    setChainMetrics(prev => ({ ...prev, isRunning: true }));
    
    console.log('🔥 AGI ENGINE X REAL API CHAIN → STARTING INFINITY MODE...');
    
    // Start immediate cycle
    runChainCycle();
    
    // Set up recurring cycles (start with 5-second cycles for real API calls)
    const interval = setInterval(() => {
      runChainCycle();
    }, 5000); // 5-second cycles for real API calls
    
    setChainInterval(interval);
    
    toast({
      title: "🚀 Real AGI Engine X Activated",
      description: "API chain is now running with real OpenAI assistants!",
    });
  };

  const stopChain = () => {
    if (chainInterval) {
      clearInterval(chainInterval);
      setChainInterval(null);
    }
    
    setIsChainRunning(false);
    setChainMetrics(prev => ({ ...prev, isRunning: false }));
    
    setAssistants(prev => prev.map(a => ({ ...a, status: 'idle' as const })));
    
    console.log('🛑 AGI ENGINE X REAL API CHAIN → STOPPED');
    
    toast({
      title: "Chain Stopped",
      description: "Real AGI Engine X has been stopped.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-400 border-blue-400';
      case 'complete': return 'text-green-400 border-green-400';
      case 'error': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">🚀 Real AGI Engine X API Chain</CardTitle>
              <p className="text-gray-400 text-sm mt-1">Connect real OpenAI assistants into a continuous processing pipeline</p>
            </div>
            <div className="space-x-2">
              <Button 
                onClick={startChain}
                disabled={isChainRunning}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Start Real Chain
              </Button>
              <Button 
                onClick={stopChain}
                disabled={!isChainRunning}
                variant="destructive"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-1" />
                Stop Chain
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">OpenAI API Key</label>
              <Input
                type="password"
                placeholder="sk-..."
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Chain Status</label>
              <Badge variant="outline" className={isChainRunning ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                {isChainRunning ? '🟢 RUNNING REAL APIs' : '🔴 STOPPED'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400 block">Assistant IDs (Optional - leave blank to use chat completion)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(assistantIds).map(([key, value]) => (
                <Input
                  key={key}
                  placeholder={`${key.replace('_', ' ')} assistant ID`}
                  value={value}
                  onChange={(e) => setAssistantIds(prev => ({ ...prev, [key]: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white text-xs"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400">Total Cycles</div>
              <div className="text-white font-bold">{chainMetrics.totalCycles}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400">Avg Cycle Time</div>
              <div className="text-white font-bold">{chainMetrics.avgCycleTime.toFixed(0)}ms</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400">Tasks/Second</div>
              <div className="text-white font-bold">{chainMetrics.tasksPerSecond.toFixed(1)}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400">Target</div>
              <div className="text-yellow-400 font-bold">Real AI Pipeline</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">⚡ Real Processing Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assistants.map((assistant, index) => (
              <div key={assistant.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <Card className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-semibold">{assistant.name}</div>
                          <div className="text-gray-400 text-sm">{assistant.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Tasks: {assistant.tasksProcessed} | Avg: {assistant.avgProcessingTime.toFixed(0)}ms
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {assistantIds[assistant.id as keyof typeof assistantIds] || 'Using chat completion'}
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(assistant.status)}>
                          {assistant.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {index < assistants.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIChain;
