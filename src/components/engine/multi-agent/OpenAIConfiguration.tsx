
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { openAIService } from '@/services/OpenAIService';
import { toast } from '@/hooks/use-toast';

interface OpenAIConfigurationProps {
  onConnectionChange: (connected: boolean) => void;
}

const OpenAIConfiguration = ({ onConnectionChange }: OpenAIConfigurationProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    openAIService.loadApiKey();
    setIsConnected(openAIService.isAvailable());
    const savedKey = localStorage.getItem('openai_core_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const testConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      openAIService.setApiKey(apiKey);
      const connected = await openAIService.testConnection();
      setIsConnected(connected);
      onConnectionChange(connected);

      if (connected) {
        toast({
          title: "✅ OpenAI Connected",
          description: "Core AGI system enhanced with OpenAI intelligence!",
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      console.error('OpenAI connection error:', error);
      setIsConnected(false);
      onConnectionChange(false);
      toast({
        title: "❌ OpenAI Connection Failed",
        description: "Please check your API key and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
      <h3 className="text-white font-medium mb-3 flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        🧠 OpenAI Core Integration
      </h3>
      
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="openai-key" className="text-gray-400">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-slate-600 border-slate-500 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isConnected ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
            {isConnected ? '🟢 AI ENHANCED' : '🔴 LOCAL ONLY'}
          </Badge>
          <span className="text-sm text-gray-400">
            {isConnected ? 'Agents using OpenAI intelligence' : 'Agents using local simulation'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpenAIConfiguration;
