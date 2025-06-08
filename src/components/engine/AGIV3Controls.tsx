
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Users, Settings, Play, Pause } from 'lucide-react';
import { agiEngineXV3 } from '@/services/AGIengineXV3Service';

const AGIV3Controls = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chainName, setChainName] = useState('standard_agi_loop');
  const [goalText, setGoalText] = useState('');
  const [chainResult, setChainResult] = useState<any>(null);

  const handleRunChain = async () => {
    setIsLoading(true);
    const result = await agiEngineXV3.runMultiAgentChain(chainName, {
      llm_enhanced: true,
      priority: 'high'
    });
    setChainResult(result);
    setIsLoading(false);
  };

  const handleCreateSmartGoal = async () => {
    if (!goalText.trim()) return;
    
    setIsLoading(true);
    const success = await agiEngineXV3.createSmartGoal(goalText, true);
    if (success) {
      setGoalText('');
      alert('Smart goal created successfully!');
    } else {
      alert('Failed to create goal. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">⚡ AGI V3 Control Center</h2>
        <p className="text-gray-400">Enterprise-Grade AGI Operations & Multi-Agent Orchestration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Agent Chain Control */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              🔗 Multi-Agent Chain Executor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Chain Configuration</label>
              <select 
                value={chainName}
                onChange={(e) => setChainName(e.target.value)}
                className="w-full bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
              >
                <option value="standard_agi_loop">Standard AGI Loop</option>
                <option value="intensive_analysis">Intensive Analysis</option>
                <option value="enterprise_workflow">Enterprise Workflow</option>
                <option value="market_research">Market Research Chain</option>
              </select>
            </div>
            
            <Button 
              onClick={handleRunChain}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Executing Chain...' : 'Run Agent Chain'}
            </Button>
            
            {chainResult && (
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <h4 className="text-white font-medium mb-2">🔗 Chain Results:</h4>
                <pre className="text-gray-300 text-xs overflow-x-auto">
                  {JSON.stringify(chainResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Smart Goal Creator */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              🎯 LLM-Enhanced Goal Creator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Goal Description</label>
              <Input
                placeholder="Describe your business objective..."
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSmartGoal()}
              />
            </div>
            
            <Button 
              onClick={handleCreateSmartGoal}
              disabled={isLoading || !goalText.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Create Smart Goal
            </Button>
            
            <div className="text-xs text-gray-400">
              💡 LLM will enhance your goal with SMART criteria and strategic context
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            🏢 Enterprise AGI Features
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">LLM Integration</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Active
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Multi-Tenant</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Enabled
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Chain Execution</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Ready
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Analytics</h3>
              <Badge variant="outline" className="text-blue-400 border-blue-400 mt-1">
                Pro
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIV3Controls;
