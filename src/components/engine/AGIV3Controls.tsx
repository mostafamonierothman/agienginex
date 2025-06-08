import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Zap, Target, Users, Settings, Play, Pause, Database, ListChecks, Activity } from 'lucide-react';
import { agiEngineXV3 } from '@/services/AGIengineXV3Service';
import { toast } from '@/hooks/use-toast';

const AGIV3Controls = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [chainName, setChainName] = useState('standard_agi_loop');
  const [goalText, setGoalText] = useState('');
  const [chainResult, setChainResult] = useState<any>(null);
  const [activeGoals, setActiveGoals] = useState([]);
  const [supervisorLogs, setSupervisorLogs] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('strategic_planner');

  // Load data on component mount
  useEffect(() => {
    loadActiveGoals();
    loadSupervisorLogs();
  }, []);

  const loadActiveGoals = async () => {
    const goals = await agiEngineXV3.getActiveGoals();
    setActiveGoals(goals);
  };

  const loadSupervisorLogs = async () => {
    const logs = await agiEngineXV3.getSupervisorLogs(8);
    setSupervisorLogs(logs);
  };

  const handleRunChain = async () => {
    setIsLoading(true);
    try {
      const result = await agiEngineXV3.runMultiAgentChain(chainName, {
        llm_enhanced: true,
        priority: 'high',
        memory_enabled: true
      });
      setChainResult(result);
      await loadSupervisorLogs(); // Refresh logs
      toast({
        title: "Agent Chain Executed",
        description: `Successfully ran ${chainName} chain`,
      });
    } catch (error) {
      toast({
        title: "Chain Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleCreateSmartGoal = async () => {
    if (!goalText.trim()) return;
    
    setIsLoading(true);
    try {
      const success = await agiEngineXV3.createSmartGoal(goalText, true);
      if (success) {
        setGoalText('');
        await loadActiveGoals(); // Refresh goals
        toast({
          title: "Smart Goal Created",
          description: "LLM-enhanced goal created successfully",
        });
      } else {
        throw new Error('Failed to create goal');
      }
    } catch (error) {
      toast({
        title: "Goal Creation Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleRunEnhancedAgent = async () => {
    setIsLoading(true);
    try {
      const result = await agiEngineXV3.runEnhancedAgent(selectedAgent, {
        enhanced_mode: true,
        context_aware: true
      });
      
      await loadSupervisorLogs(); // Refresh logs
      
      toast({
        title: "Enhanced Agent Executed",
        description: `${selectedAgent} completed successfully`,
      });
    } catch (error) {
      toast({
        title: "Agent Execution Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleUpdateGoalProgress = async (goalId: number, progress: number) => {
    const success = await agiEngineXV3.updateGoalProgress(goalId, progress);
    if (success) {
      await loadActiveGoals();
      toast({
        title: "Goal Updated",
        description: `Progress updated to ${progress}%`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">⚡ AGI V3 Enhanced Control Center</h2>
        <p className="text-gray-400">Enterprise-Grade AGI with Memory, Supervision & Advanced Goal Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Multi-Agent Chain Control */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              🔗 Enhanced Multi-Agent Chain
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
                <option value="memory_enhanced">Memory-Enhanced Chain</option>
              </select>
            </div>
            
            <Button 
              onClick={handleRunChain}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Executing Enhanced Chain...' : 'Run Enhanced Agent Chain'}
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

        {/* Enhanced Single Agent Runner */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              🤖 Enhanced Agent Runner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Select Enhanced Agent</label>
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-slate-600 border-slate-500 text-white rounded px-3 py-2"
              >
                <option value="strategic_planner">🎯 Strategic Planner</option>
                <option value="opportunity_detector">💡 Opportunity Detector</option>
                <option value="performance_critic">🧠 Performance Critic</option>
              </select>
            </div>
            
            <Button 
              onClick={handleRunEnhancedAgent}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {isLoading ? 'Running Enhanced Agent...' : 'Run Enhanced Agent'}
            </Button>
            
            <div className="text-xs text-gray-400">
              💡 Enhanced agents use memory, context awareness, and advanced processing
            </div>
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
              <Textarea
                placeholder="Describe your strategic objective in detail..."
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="bg-slate-600 border-slate-500 text-white min-h-[80px]"
              />
            </div>
            
            <Button 
              onClick={handleCreateSmartGoal}
              disabled={isLoading || !goalText.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Create Enhanced Smart Goal
            </Button>
            
            <div className="text-xs text-gray-400">
              🧠 AI will enhance with SMART criteria, strategic context, and measurable outcomes
            </div>
          </CardContent>
        </Card>

        {/* Active Goals Display */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-green-400" />
              📋 Active Goals ({activeGoals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeGoals.length > 0 ? (
              activeGoals.slice(0, 3).map((goal: any) => (
                <div key={goal.goal_id} className="bg-slate-700/50 p-3 rounded border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white text-sm font-medium">Goal #{goal.goal_id}</h4>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {goal.progress_percentage}%
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2">{goal.goal_text}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateGoalProgress(goal.goal_id, Math.min(100, goal.progress_percentage + 25))}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      +25% Progress
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                No active goals. Create your first goal above.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Supervisor Activity Log */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            📊 Supervisor Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {supervisorLogs.length > 0 ? (
              supervisorLogs.map((log: any) => (
                <div key={log.id} className="bg-slate-700/30 p-2 rounded border border-slate-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm font-medium">{log.agent_name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          log.status === 'completed' ? 'text-green-400 border-green-400' :
                          log.status === 'error' ? 'text-red-400 border-red-400' :
                          'text-yellow-400 border-yellow-400'
                        }`}
                      >
                        {log.status}
                      </Badge>
                      <span className="text-gray-400 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Action: {log.action}
                  </p>
                  {log.output && (
                    <p className="text-gray-400 text-xs mt-1 truncate">
                      Output: {log.output}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                No supervisor activity yet. Run some agents to see logs.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Features Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            🏢 Enhanced Enterprise Features
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Agent Memory</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Enhanced
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Activity className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Supervision</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Active
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">LLM Integration</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Enhanced
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <ListChecks className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Goal Tracking</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
                Advanced
              </Badge>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white text-sm font-medium">Chain Execution</h3>
              <Badge variant="outline" className="text-green-400 border-green-400 mt-1">
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
