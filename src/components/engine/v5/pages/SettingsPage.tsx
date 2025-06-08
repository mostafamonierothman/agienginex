
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    "OpenAI_API_Key": "sk-************************************",
    "Loop_Delay": "1000",
    "Parallel_Agents": "12",
    "Max_Cycles": "1000",
    "Debug_Mode": "true",
    "Auto_Learning": "true",
    "Memory_Compression": "true",
    "Vector_Similarity_Threshold": "0.85"
  });

  const handleUpdateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "✅ Settings Saved",
      description: "All configuration changes have been applied",
    });
  };

  const resetSettings = () => {
    setSettings({
      "OpenAI_API_Key": "",
      "Loop_Delay": "1000",
      "Parallel_Agents": "12",
      "Max_Cycles": "1000",
      "Debug_Mode": "true",
      "Auto_Learning": "true",
      "Memory_Compression": "true",
      "Vector_Similarity_Threshold": "0.85"
    });
    
    toast({
      title: "🔄 Settings Reset",
      description: "All settings have been restored to defaults",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Settings className="h-8 w-8 text-purple-400" />
          Settings
        </h1>
        <div className="flex gap-2">
          <Button onClick={resetSettings} variant="outline" className="border-gray-500 text-gray-200">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">OpenAI API Key</Label>
              <Input
                type="password"
                value={settings.OpenAI_API_Key}
                onChange={(e) => handleUpdateSetting("OpenAI_API_Key", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="sk-..."
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Loop Delay (ms)</Label>
              <Input
                type="number"
                value={settings.Loop_Delay}
                onChange={(e) => handleUpdateSetting("Loop_Delay", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Parallel Agents</Label>
              <Input
                type="number"
                value={settings.Parallel_Agents}
                onChange={(e) => handleUpdateSetting("Parallel_Agents", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Max Cycles</Label>
              <Input
                type="number"
                value={settings.Max_Cycles}
                onChange={(e) => handleUpdateSetting("Max_Cycles", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">Learning & Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.Auto_Learning === "true"}
                onChange={(e) => handleUpdateSetting("Auto_Learning", e.target.checked.toString())}
                className="rounded"
              />
              <Label className="text-gray-300">Auto Learning</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.Memory_Compression === "true"}
                onChange={(e) => handleUpdateSetting("Memory_Compression", e.target.checked.toString())}
                className="rounded"
              />
              <Label className="text-gray-300">Memory Compression</Label>
            </div>
            <div>
              <Label className="text-gray-300">Vector Similarity Threshold</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={settings.Vector_Similarity_Threshold}
                onChange={(e) => handleUpdateSetting("Vector_Similarity_Threshold", e.target.value)}
                className="bg-slate-700 border-slate-600 text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white">Debug & Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.Debug_Mode === "true"}
                onChange={(e) => handleUpdateSetting("Debug_Mode", e.target.checked.toString())}
                className="rounded"
              />
              <Label className="text-gray-300">Debug Mode</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
