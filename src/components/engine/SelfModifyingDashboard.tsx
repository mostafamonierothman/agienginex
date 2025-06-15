
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Cog, Zap, Target, Code, RefreshCw } from 'lucide-react';
import { selfModifyingCodeGenerator, CodeAnalysis, CodeImprovement } from '@/agi/SelfModifyingCodeGenerator';

const SelfModifyingDashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [analyses, setAnalyses] = useState<CodeAnalysis[]>([]);
  const [improvements, setImprovements] = useState<CodeImprovement[]>([]);
  const [metrics, setMetrics] = useState({
    totalAnalyses: 0,
    totalImprovements: 0,
    averageConfidence: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 }
  });

  useEffect(() => {
    updateMetrics();
  }, []);

  const updateMetrics = async () => {
    const evolutionMetrics = await selfModifyingCodeGenerator.getEvolutionMetrics();
    setMetrics(evolutionMetrics);
    setAnalyses(selfModifyingCodeGenerator.getAnalysisHistory());
    setImprovements(selfModifyingCodeGenerator.getImprovementHistory());
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const newAnalyses = await selfModifyingCodeGenerator.analyzeCodebase();
      setAnalyses(newAnalyses);
      await updateMetrics();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelfModify = async () => {
    setIsModifying(true);
    try {
      const result = await selfModifyingCodeGenerator.implementSelfModification();
      console.log('Self-modification result:', result);
      await updateMetrics();
    } catch (error) {
      console.error('Self-modification failed:', error);
    } finally {
      setIsModifying(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-purple-400" />
            🧬 Self-Modifying Code Generator - AGI Evolution Engine
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Advanced AI system that analyzes its own code, identifies improvements, and evolves autonomously
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Panel */}
          <div className="flex gap-4">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 mr-2" />
                  Analyze Codebase
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSelfModify}
              disabled={isModifying || analyses.length === 0}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isModifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Evolving...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Self-Modify
                </>
              )}
            </Button>
          </div>

          {/* Evolution Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-300">Analyses</span>
              </div>
              <div className="text-white font-bold text-lg">{metrics.totalAnalyses}</div>
            </div>

            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Cog className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-300">Improvements</span>
              </div>
              <div className="text-white font-bold text-lg">{metrics.totalImprovements}</div>
            </div>

            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-300">Avg Confidence</span>
              </div>
              <div className="text-white font-bold text-lg">{metrics.averageConfidence.toFixed(1)}%</div>
            </div>

            <div className="bg-black/20 p-4 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-300">Low Risk</span>
              </div>
              <div className="text-white font-bold text-lg">{metrics.riskDistribution.low}</div>
            </div>
          </div>

          {/* Recent Analyses */}
          {analyses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Recent Code Analyses</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {analyses.slice(0, 5).map((analysis) => (
                  <div key={analysis.id} className="bg-black/20 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white text-sm font-medium">{analysis.fileName}</span>
                      <span className="text-xs text-gray-400">
                        {analysis.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <span className="text-xs text-gray-400">Complexity</span>
                        <Progress value={analysis.complexity * 10} className="h-2" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Maintainability</span>
                        <Progress value={analysis.maintainability * 10} className="h-2" />
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Performance</span>
                        <Progress value={analysis.performance * 10} className="h-2" />
                      </div>
                    </div>

                    <div className="text-xs text-gray-300">
                      {analysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                        <div key={idx}>• {suggestion}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Improvements */}
          {improvements.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Generated Improvements</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {improvements.slice(0, 3).map((improvement) => (
                  <div key={improvement.id} className="bg-black/20 p-3 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`${getRiskColor(improvement.riskLevel)} text-white`}>
                        {improvement.riskLevel} risk
                      </Badge>
                      <span className="text-white text-sm">{improvement.confidence}% confidence</span>
                    </div>
                    
                    <div className="text-xs text-gray-300 mb-2">
                      <strong>Improvements:</strong>
                      {improvement.improvements.slice(0, 2).map((imp, idx) => (
                        <div key={idx}>• {imp}</div>
                      ))}
                    </div>

                    <span className="text-xs text-gray-400">
                      {improvement.timestamp.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evolution Status */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded border border-purple-500/30">
            <h4 className="text-white font-medium mb-2">AGI Evolution Status</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>🧬 Self-analysis capabilities: ACTIVE</div>
              <div>🔄 Code generation improvements: ACTIVE</div>
              <div>⚡ Real-time optimization: ENABLED</div>
              <div>🎯 Autonomous evolution: {metrics.totalImprovements > 0 ? 'OPERATIONAL' : 'INITIALIZING'}</div>
            </div>
          </div>

          {metrics.totalImprovements > 5 && (
            <div className="bg-green-900/20 border border-green-500/30 p-3 rounded">
              <p className="text-green-300 text-sm">
                🚀 AGI Evolution Milestone: Self-modification system has generated {metrics.totalImprovements} improvements with {metrics.averageConfidence.toFixed(1)}% average confidence. System is actively evolving towards higher intelligence.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfModifyingDashboard;
