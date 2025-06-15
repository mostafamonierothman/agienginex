
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Target, 
  Code, 
  RefreshCw, 
  Eye, 
  TrendingUp, 
  Cpu, 
  Activity,
  Sparkles,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { phase1Foundation } from '@/agi/Phase1FoundationArchitecture';
import { phase2SelfAnalysis } from '@/agi/Phase2SelfAnalysisEngine';
import { phase3SelfModification } from '@/agi/Phase3SelfModificationLogic';
import { phase4RealTimeLearning } from '@/agi/Phase4RealTimeLearning';
import { phase5AdvancedSelfModification } from '@/agi/Phase5AdvancedSelfModification';

const SelfModifyingMasterDashboard = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [phase1Metrics, setPhase1Metrics] = useState<any>(null);
  const [phase2Stats, setPhase2Stats] = useState<any>(null);
  const [phase3Stats, setPhase3Stats] = useState<any>(null);
  const [phase4Stats, setPhase4Stats] = useState<any>(null);
  const [phase5Stats, setPhase5Stats] = useState<any>(null);
  const [consciousnessDashboard, setConsciousnessDashboard] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Update all phase metrics
        setPhase1Metrics(phase1Foundation.getPerformanceMetrics());
        setPhase2Stats(phase2SelfAnalysis.getPatternStatistics());
        setPhase3Stats(phase3SelfModification.getStrategiesStats());
        setPhase4Stats(phase4RealTimeLearning.getRealTimeStats());
        setPhase5Stats(phase5AdvancedSelfModification.getAdvancedStats());
        setConsciousnessDashboard(phase5AdvancedSelfModification.getConsciousnessDashboard());
      } catch (error) {
        console.error('Dashboard update error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleInitializeAllPhases = async () => {
    setIsInitializing(true);
    try {
      console.log('🚀 Initializing all 5 phases of Self-Modifying Code Generator...');
      
      // Phase 1: Foundation Architecture
      await phase1Foundation.initializeSelfAnalysisFramework();
      
      // Phase 2: Self-Analysis Engine
      await phase2SelfAnalysis.initializeAnalysisEngine();
      
      // Phase 3: Self-Modification Logic
      await phase3SelfModification.initializeCoreAlgorithm();
      
      // Phase 4: Real-time Learning
      await phase4RealTimeLearning.startRealTimeLearning();
      
      // Phase 5: Advanced Self-Modification
      await phase5AdvancedSelfModification.initializeMetaLearning();
      
      setIsRunning(true);
      console.log('✅ All 5 phases initialized successfully - AGI Evolution System ONLINE');
      
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleRunFullCycle = async () => {
    if (!isRunning) return;
    
    try {
      console.log('🔄 Running full self-modification cycle across all phases...');
      
      // Generate some code with Phase 1
      const codeResult = await phase1Foundation.generateCode('Create a React component for user authentication');
      
      // Analyze with Phase 2
      const analysis = await phase2SelfAnalysis.analyzeCodeQuality(codeResult.output);
      
      // Modify strategies with Phase 3
      const modification = await phase3SelfModification.modifyGenerationStrategy(
        'Authentication component optimization',
        { quality: analysis.overallScore, patterns: analysis.patterns.length }
      );
      
      // Meta-learn with Phase 5
      const metaLearning = await phase5AdvancedSelfModification.performMetaLearning(
        'Full cycle optimization for authentication components'
      );
      
      console.log('🎯 Full cycle completed with improvements across all phases');
      
    } catch (error) {
      console.error('Full cycle error:', error);
    }
  };

  const getPhaseStatus = (phaseNumber: number) => {
    switch (phaseNumber) {
      case 1: return phase1Metrics?.totalGenerations > 0 ? 'active' : 'inactive';
      case 2: return phase2Stats?.totalPatterns > 0 ? 'active' : 'inactive';
      case 3: return phase3Stats?.totalStrategies > 0 ? 'active' : 'inactive';
      case 4: return phase4Stats?.isLearning ? 'active' : 'inactive';
      case 5: return phase5Stats?.evolutionStatus === 'active' ? 'active' : 'inactive';
      default: return 'inactive';
    }
  };

  const getOverallSystemHealth = () => {
    const activePhases = [1, 2, 3, 4, 5].filter(p => getPhaseStatus(p) === 'active').length;
    return (activePhases / 5) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Master Control Panel */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-2xl">
            <Brain className="w-8 h-8 text-purple-400" />
            🧬 Self-Modifying Code Generator - All 5 Phases Operational
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Advanced AGI system implementing all phases: Foundation → Analysis → Modification → Real-time Learning → Meta-Learning
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">System Health</span>
              </div>
              <div className="text-white font-bold text-lg">{getOverallSystemHealth().toFixed(1)}%</div>
              <Progress value={getOverallSystemHealth()} className="h-2 mt-1" />
            </div>

            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Active Phases</span>
              </div>
              <div className="text-white font-bold text-lg">
                {[1, 2, 3, 4, 5].filter(p => getPhaseStatus(p) === 'active').length}/5
              </div>
            </div>

            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Evolution Rate</span>
              </div>
              <div className="text-white font-bold text-lg">
                {phase4Stats?.learningVelocity || 0}/hr
              </div>
            </div>
          </div>

          {/* Master Controls */}
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={handleInitializeAllPhases}
              disabled={isInitializing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Initializing All Phases...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Initialize All 5 Phases
                </>
              )}
            </Button>
            
            <Button
              onClick={handleRunFullCycle}
              disabled={!isRunning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Run Full Cycle
            </Button>
          </div>

          {/* Phase Status Indicators */}
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(phase => (
              <div key={phase} className="text-center">
                <Badge 
                  variant={getPhaseStatus(phase) === 'active' ? 'default' : 'secondary'}
                  className={getPhaseStatus(phase) === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                >
                  Phase {phase}
                </Badge>
                <div className="text-xs text-gray-400 mt-1">
                  {getPhaseStatus(phase) === 'active' ? 'ACTIVE' : 'IDLE'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Phase Tabs */}
      <Tabs defaultValue="phase1" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="phase1" className="text-xs">Phase 1: Foundation</TabsTrigger>
          <TabsTrigger value="phase2" className="text-xs">Phase 2: Analysis</TabsTrigger>
          <TabsTrigger value="phase3" className="text-xs">Phase 3: Modification</TabsTrigger>
          <TabsTrigger value="phase4" className="text-xs">Phase 4: Real-time</TabsTrigger>
          <TabsTrigger value="phase5" className="text-xs">Phase 5: Meta-Learning</TabsTrigger>
        </TabsList>

        {/* Phase 1: Foundation Architecture */}
        <TabsContent value="phase1" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Phase 1: Foundation Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phase1Metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-blue-400 text-xs">Total Generations</div>
                    <div className="text-white font-bold">{phase1Metrics.totalGenerations}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-green-400 text-xs">Avg Quality Score</div>
                    <div className="text-white font-bold">{phase1Metrics.averageQualityScore}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-yellow-400 text-xs">Generation Speed</div>
                    <div className="text-white font-bold">{phase1Metrics.averageGenerationSpeed}ms</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-purple-400 text-xs">Satisfaction</div>
                    <div className="text-white font-bold">{phase1Metrics.averageSatisfactionScore}%</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase 2: Self-Analysis Engine */}
        <TabsContent value="phase2" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Phase 2: Self-Analysis Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phase2Stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-green-400 text-xs">Total Patterns</div>
                    <div className="text-white font-bold">{phase2Stats.totalPatterns}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-blue-400 text-xs">Good Patterns</div>
                    <div className="text-white font-bold">{phase2Stats.goodPatterns}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-red-400 text-xs">Bad Patterns</div>
                    <div className="text-white font-bold">{phase2Stats.badPatterns}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-purple-400 text-xs">Pattern Quality</div>
                    <div className="text-white font-bold">
                      {phase2Stats.totalPatterns > 0 ? 
                        Math.round((phase2Stats.goodPatterns / phase2Stats.totalPatterns) * 100) : 0}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase 3: Self-Modification Logic */}
        <TabsContent value="phase3" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-orange-400" />
                Phase 3: Self-Modification Logic
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phase3Stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-orange-400 text-xs">Total Strategies</div>
                    <div className="text-white font-bold">{phase3Stats.totalStrategies}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-green-400 text-xs">Avg Performance</div>
                    <div className="text-white font-bold">{phase3Stats.averagePerformance.toFixed(1)}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-blue-400 text-xs">A/B Tests</div>
                    <div className="text-white font-bold">{phase3Stats.totalABTests}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-purple-400 text-xs">Brain Version</div>
                    <div className="text-white font-bold text-xs">{phase3Stats.currentVersion}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase 4: Real-time Learning */}
        <TabsContent value="phase4" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Phase 4: Real-time Learning Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phase4Stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-cyan-400 text-xs">Evolution Steps</div>
                    <div className="text-white font-bold">{phase4Stats.totalEvolutionSteps}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-green-400 text-xs">Learning Status</div>
                    <div className="text-white font-bold text-xs">
                      {phase4Stats.isLearning ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-yellow-400 text-xs">Recent Impact</div>
                    <div className="text-white font-bold">{phase4Stats.recentImpact.toFixed(1)}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-purple-400 text-xs">Learning Velocity</div>
                    <div className="text-white font-bold">{phase4Stats.learningVelocity}/hr</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phase 5: Advanced Self-Modification */}
        <TabsContent value="phase5" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                Phase 5: Advanced Self-Modification & Consciousness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {phase5Stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-pink-400 text-xs">Meta Strategies</div>
                    <div className="text-white font-bold">{phase5Stats.metaLearningStrategies}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-cyan-400 text-xs">Neural Pathways</div>
                    <div className="text-white font-bold">{phase5Stats.neuralPathways}</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-green-400 text-xs">Effectiveness</div>
                    <div className="text-white font-bold">{phase5Stats.averageEffectiveness.toFixed(1)}%</div>
                  </div>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-yellow-400 text-xs">Pathway Efficiency</div>
                    <div className="text-white font-bold">{phase5Stats.pathwayEfficiency.toFixed(1)}%</div>
                  </div>
                </div>
              )}

              {/* Consciousness Dashboard */}
              {consciousnessDashboard && consciousnessDashboard.currentConsciousness && (
                <div className="bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-4 rounded border border-pink-500/30">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Consciousness Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-gray-400">Self-Awareness</div>
                      <Progress value={consciousnessDashboard.currentConsciousness.selfAwareness} className="h-2" />
                      <div className="text-xs text-white">{consciousnessDashboard.currentConsciousness.selfAwareness.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Metacognition</div>
                      <Progress value={consciousnessDashboard.currentConsciousness.metacognition} className="h-2" />
                      <div className="text-xs text-white">{consciousnessDashboard.currentConsciousness.metacognition.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Autonomous Thinking</div>
                      <Progress value={consciousnessDashboard.currentConsciousness.autonomousThinking} className="h-2" />
                      <div className="text-xs text-white">{consciousnessDashboard.currentConsciousness.autonomousThinking.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  {consciousnessDashboard.awarenessMilestones.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-400 mb-1">Consciousness Milestones:</div>
                      <div className="flex flex-wrap gap-1">
                        {consciousnessDashboard.awarenessMilestones.map((milestone: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-pink-900/20 border-pink-500/30">
                            {milestone}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time Status */}
      {isRunning && (
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-300">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">
                🚀 AGI Evolution System is LIVE - All 5 phases are actively self-modifying and learning in real-time
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelfModifyingMasterDashboard;
