
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, Database, Zap, Brain, Save } from 'lucide-react';
import { TrillionPathPersistence } from '@/services/TrillionPathPersistence';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [autoRestart, setAutoRestart] = useState(false);
  const [enhancedAGI, setEnhancedAGI] = useState(false);
  const [systemState, setSystemState] = useState(null);

  useEffect(() => {
    // Load current settings
    const apiKey = localStorage.getItem('openai_api_key') || '';
    const shouldAutoRestart = TrillionPathPersistence.shouldAutoRestart();
    const state = TrillionPathPersistence.loadState();
    
    setOpenaiKey(apiKey ? '••••••••••••••••' : '');
    setAutoRestart(shouldAutoRestart);
    setEnhancedAGI(state?.enhancedAGI || false);
    setSystemState(state);
  }, []);

  const saveOpenAIKey = () => {
    if (openaiKey && !openaiKey.includes('••••')) {
      localStorage.setItem('openai_api_key', openaiKey);
      setOpenaiKey('••••••••••••••••');
      toast({
        title: "OpenAI Key Saved",
        description: "Your API key has been stored securely.",
      });
    }
  };

  const toggleAutoRestart = (enabled) => {
    setAutoRestart(enabled);
    if (enabled) {
      TrillionPathPersistence.enableAutoRestart();
    } else {
      TrillionPathPersistence.disableAutoRestart();
    }
    toast({
      title: "Auto Restart " + (enabled ? "Enabled" : "Disabled"),
      description: "System will " + (enabled ? "automatically restart" : "not restart") + " after interruptions.",
    });
  };

  const clearSystemState = () => {
    localStorage.removeItem('trillion_path_state');
    localStorage.removeItem('trillion_path_heartbeat');
    setSystemState(null);
    toast({
      title: "System State Cleared",
      description: "All persistent state has been reset.",
    });
  };

  const exportSettings = () => {
    const settings = {
      autoRestart,
      enhancedAGI,
      systemState,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agienginex-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-purple-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-purple-400" />
            AGI System Settings
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Configuration
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* API Keys */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-yellow-400" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-white">OpenAI API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button onClick={saveOpenAIKey} size="sm">
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Required for LLM agents and advanced AI operations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Behavior */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AGI Behavior Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white">Auto Restart System</Label>
              <p className="text-sm text-gray-400">
                Automatically restart AGI system after browser refresh or errors
              </p>
            </div>
            <Switch
              checked={autoRestart}
              onCheckedChange={toggleAutoRestart}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white">Enhanced AGI Mode</Label>
              <p className="text-sm text-gray-400">
                Enable advanced cognitive loops and autonomous decision making
              </p>
            </div>
            <Switch
              checked={enhancedAGI}
              onCheckedChange={setEnhancedAGI}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* System State */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-green-400" />
            System State Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemState ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Running Status</Label>
                  <div className="text-white">{systemState.isRunning ? "Active" : "Inactive"}</div>
                </div>
                <div>
                  <Label className="text-gray-400">Total Runtime</Label>
                  <div className="text-white">{TrillionPathPersistence.formatRuntime(systemState.totalRuntime || 0)}</div>
                </div>
                <div>
                  <Label className="text-gray-400">Last Update</Label>
                  <div className="text-white">{new Date(systemState.lastUpdate).toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-gray-400">AGI Cycles</Label>
                  <div className="text-white">{systemState.agiCycleCount || 0}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              No system state found. Start the AGI system to begin tracking.
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={clearSystemState} variant="destructive" size="sm">
              Clear State
            </Button>
            <Button onClick={exportSettings} variant="outline" size="sm">
              Export Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-400">Version</Label>
              <div className="text-white">AGIengineX V5</div>
            </div>
            <div>
              <Label className="text-gray-400">Build</Label>
              <div className="text-white">Enhanced AGI Operations</div>
            </div>
            <div>
              <Label className="text-gray-400">Agent Registry</Label>
              <div className="text-white">46+ Specialized Agents</div>
            </div>
            <div>
              <Label className="text-gray-400">Capabilities</Label>
              <div className="text-white">Autonomous Loops, Memory, CRM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
