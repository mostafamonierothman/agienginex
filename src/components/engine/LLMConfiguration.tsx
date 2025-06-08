
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Key, Zap, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { llmService } from '@/utils/llm';

const LLMConfiguration = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [testPrompt, setTestPrompt] = useState('Hello, can you introduce yourself?');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const availableModels = llmService.getAvailableModels();

  const saveKeys = () => {
    if (openaiKey) {
      llmService.setOpenAIKey(openaiKey);
      localStorage.setItem('llm_openai_key', openaiKey);
    }
    if (anthropicKey) {
      llmService.setAnthropicKey(anthropicKey);
      localStorage.setItem('llm_anthropic_key', anthropicKey);
    }
    
    toast({
      title: "🔑 API Keys Saved",
      description: "LLM configuration has been updated",
    });
  };

  const testModel = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test prompt",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(true);
      const response = await llmService.fetchLLMResponse(testPrompt, selectedModel);
      setTestResult(response.content);
      
      toast({
        title: "🧠 Model Test Successful",
        description: `${selectedModel} responded successfully`,
      });
    } catch (error) {
      console.error('Model test failed:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      toast({
        title: "Error",
        description: "Model test failed",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const autoSelectTest = async () => {
    if (!testPrompt.trim()) return;

    try {
      setTesting(true);
      const response = await llmService.autoSelectModel(testPrompt, 'medium');
      setTestResult(`[Auto-Selected: ${response.model}]\n\n${response.content}`);
      
      toast({
        title: "🎯 Auto-Selection Successful",
        description: `Selected ${response.model} automatically`,
      });
    } catch (error) {
      console.error('Auto-select test failed:', error);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  React.useEffect(() => {
    // Load saved keys
    const savedOpenAI = localStorage.getItem('llm_openai_key');
    const savedAnthropic = localStorage.getItem('llm_anthropic_key');
    
    if (savedOpenAI) {
      setOpenaiKey(savedOpenAI);
      llmService.setOpenAIKey(savedOpenAI);
    }
    if (savedAnthropic) {
      setAnthropicKey(savedAnthropic);
      llmService.setAnthropicKey(savedAnthropic);
    }
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          LLM Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure and test multiple LLM providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Keys Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-yellow-400" />
            API Keys
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key" className="text-gray-300">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="anthropic-key" className="text-gray-300">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <Button onClick={saveKeys} className="bg-blue-600 hover:bg-blue-700">
            <Key className="w-4 h-4 mr-2" />
            Save API Keys
          </Button>
        </div>

        {/* Model Testing Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            Model Testing
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model-select" className="text-gray-300">Select Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model} className="text-white">
                      {model}
                      {model.includes('gpt-4o-mini') && <Badge className="ml-2 bg-green-500/20 text-green-400">Fast</Badge>}
                      {model.includes('claude') && <Badge className="ml-2 bg-purple-500/20 text-purple-400">Claude</Badge>}
                      {model.includes('ollama') && <Badge className="ml-2 bg-orange-500/20 text-orange-400">Local</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-prompt" className="text-gray-300">Test Prompt</Label>
              <Input
                id="test-prompt"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter a test prompt..."
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={testModel} 
              disabled={testing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {testing ? 'Testing...' : 'Test Model'}
            </Button>
            
            <Button 
              onClick={autoSelectTest} 
              disabled={testing}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Auto-Select Test
            </Button>
          </div>
          
          {testResult && (
            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Test Result:</h4>
              <pre className="text-sm text-white whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
        </div>

        {/* Available Models Display */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Available Models:</h4>
          <div className="flex flex-wrap gap-2">
            {availableModels.map((model) => (
              <Badge 
                key={model} 
                variant="secondary" 
                className={`bg-slate-600/50 text-gray-300 ${selectedModel === model ? 'ring-2 ring-blue-400' : ''}`}
              >
                {model}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMConfiguration;
