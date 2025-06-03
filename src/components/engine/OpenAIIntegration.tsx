
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface OpenAIResponse {
  content: string;
  timestamp: Date;
  model: string;
}

const OpenAIIntegration = () => {
  const [openAIKey, setOpenAIKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<OpenAIResponse[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');

  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable' },
    { id: 'gpt-4.5-preview', name: 'GPT-4.5 Preview', description: 'Latest preview' }
  ];

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setOpenAIKey(savedKey);
      setIsConnected(true);
    }
  }, []);

  // Save API key to localStorage
  useEffect(() => {
    if (openAIKey) {
      localStorage.setItem('openai_api_key', openAIKey);
    }
  }, [openAIKey]);

  const testConnection = async () => {
    if (!openAIKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Connected!",
          description: "OpenAI API connection successful",
        });
      } else {
        throw new Error('Invalid API key or connection failed');
      }
    } catch (error) {
      console.error('OpenAI connection error:', error);
      setIsConnected(false);
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected || !openAIKey) {
      toast({
        title: "Error",
        description: "Please connect to OpenAI first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending prompt to OpenAI:', prompt);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'system',
              content: 'You are an advanced AGI assistant integrated with Engine X. Provide intelligent, actionable responses that complement the AGI engine capabilities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse: OpenAIResponse = {
        content: data.choices[0].message.content,
        timestamp: new Date(),
        model: selectedModel
      };

      setResponses(prev => [aiResponse, ...prev.slice(0, 4)]); // Keep last 5 responses
      setPrompt('');
      
      toast({
        title: "AI Response Generated",
        description: "OpenAI has provided a response to complement your AGI engine",
      });

      console.log('OpenAI response:', aiResponse);
    } catch (error) {
      console.error('Error sending prompt:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                🤖 OpenAI Complement Integration
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Connect OpenAI to enhance your AGI Engine with real AI capabilities
              </p>
            </div>
            <Badge variant="outline" className={isConnected ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
              {isConnected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}
            </Badge>
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
              <label className="text-sm text-gray-400 block mb-2">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={testConnection}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">⚡ AI Complement Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt to complement the AGI Engine (e.g., 'Analyze the current engine metrics and suggest optimizations', 'Generate a strategic plan for scaling agents', etc.)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
          />
          <Button 
            onClick={sendPrompt}
            disabled={isLoading || !isConnected}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : 'Send to OpenAI'}
          </Button>
        </CardContent>
      </Card>

      {responses.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">🧠 AI Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {responses.map((response, index) => (
              <div key={index} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    {response.model}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {response.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {response.content}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpenAIIntegration;
