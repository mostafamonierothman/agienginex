
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const OpenAIKeyConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey && savedKey.startsWith('sk-')) {
      setIsConfigured(true);
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setIsConfigured(true);
    
    toast({
      title: "API Key Saved",
      description: "OpenAI API key has been configured successfully",
    });
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConfigured(false);
    
    toast({
      title: "API Key Removed",
      description: "OpenAI API key has been removed",
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="h-4 w-4" />
            OpenAI Configuration
          </CardTitle>
          <Badge variant="outline" className={isConfigured ? 'text-green-600 border-green-600' : 'text-yellow-600 border-yellow-600'}>
            {isConfigured ? 'Configured' : 'Not Configured'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {!isConfigured ? (
          <>
            <p className="text-sm text-muted-foreground">
              Configure your OpenAI API key to enable real AI-powered chat responses.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button onClick={handleSaveKey} size="sm">
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a>
            </p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600">✅ OpenAI API key is configured</p>
            <Button onClick={handleRemoveKey} variant="outline" size="sm">
              Remove Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenAIKeyConfig;
