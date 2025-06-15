import { llmService } from '@/utils/llm';
import { SupabaseVectorMemoryService } from '@/services/SupabaseVectorMemoryService';
import { phase2SelfAnalysis } from './Phase2SelfAnalysisEngine';

export interface PromptStrategy {
  id: string;
  name: string;
  prompt: string;
  performance: number;
  successRate: number;
  avgQuality: number;
  useCount: number;
  lastUsed: Date;
  version: number;
}

export interface ABTestResult {
  id: string;
  strategyA: string;
  strategyB: string;
  testContext: string;
  aResults: { quality: number; speed: number; satisfaction: number }[];
  bResults: { quality: number; speed: number; satisfaction: number }[];
  winner: 'A' | 'B' | 'inconclusive';
  confidence: number;
  timestamp: Date;
}

export interface BrainState {
  id: string;
  version: string;
  strategies: PromptStrategy[];
  patterns: any[];
  performance: number;
  timestamp: Date;
  changes: string[];
}

export class Phase3SelfModificationLogic {
  private agentId = 'phase3-modification';
  private strategies: Map<string, PromptStrategy> = new Map();
  private abTests: ABTestResult[] = [];
  private brainStates: BrainState[] = [];
  private currentBrainVersion = '1.0.0';

  async initializeCoreAlgorithm(): Promise<void> {
    console.log('🧠 Phase 3: Initializing core self-improvement algorithm...');

    // Initialize baseline strategies
    const baselineStrategies = [
      {
        name: 'Direct Generation',
        prompt: 'Generate clean, efficient code for the following requirement: {input}',
        performance: 70
      },
      {
        name: 'Step-by-Step Analysis',
        prompt: 'Analyze the requirement step by step, then generate optimized code: {input}',
        performance: 75
      },
      {
        name: 'Best Practices Focus',
        prompt: 'Generate code following best practices and design patterns for: {input}',
        performance: 80
      }
    ];

    for (const strategy of baselineStrategies) {
      const strategyObj: PromptStrategy = {
        id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: strategy.name,
        prompt: strategy.prompt,
        performance: strategy.performance,
        successRate: 0.8,
        avgQuality: strategy.performance,
        useCount: 0,
        lastUsed: new Date(),
        version: 1
      };
      
      this.strategies.set(strategyObj.id, strategyObj);
    }

    await this.saveBrainState('Initial algorithm setup with baseline strategies');
    console.log('✅ Phase 3: Core self-improvement algorithm initialized');
  }

  async modifyGenerationStrategy(context: string, performanceData: any): Promise<PromptStrategy> {
    console.log('🔧 Phase 3: Modifying generation strategy based on performance...');

    try {
      // Analyze current performance patterns
      const currentStrategies = Array.from(this.strategies.values());
      const bestStrategy = currentStrategies.sort((a, b) => b.performance - a.performance)[0];
      const worstStrategy = currentStrategies.sort((a, b) => a.performance - b.performance)[0];

      // Generate new strategy using LLM
      const improvementPrompt = `
Analyze current code generation strategies and create an improved version:

Best performing strategy:
Name: ${bestStrategy.name}
Prompt: ${bestStrategy.prompt}
Performance: ${bestStrategy.performance}

Worst performing strategy:
Name: ${worstStrategy.name}
Prompt: ${worstStrategy.prompt}
Performance: ${worstStrategy.performance}

Context: ${context}
Performance Data: ${JSON.stringify(performanceData)}

Create a new, improved strategy that combines the best aspects and addresses weaknesses.
Return in JSON format:
{
  "name": "strategy name",
  "prompt": "improved prompt template with {input} placeholder",
  "expectedImprovement": "explanation of improvements"
}
`;

      const response = await llmService.fetchLLMResponse(improvementPrompt, 'gpt-4o');
      const newStrategyData = JSON.parse(response.content);

      const newStrategy: PromptStrategy = {
        id: `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newStrategyData.name,
        prompt: newStrategyData.prompt,
        performance: bestStrategy.performance + 2, // Start with slight improvement expectation
        successRate: 0.8,
        avgQuality: bestStrategy.avgQuality + 1,
        useCount: 0,
        lastUsed: new Date(),
        version: Math.max(...currentStrategies.map(s => s.version)) + 1
      };

      this.strategies.set(newStrategy.id, newStrategy);

      // Store the modification
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'strategy_modification',
        JSON.stringify({
          newStrategy: newStrategy.name,
          expectedImprovement: newStrategyData.expectedImprovement,
          basedOn: bestStrategy.name,
          context
        }),
        0.5
      );

      await this.saveBrainState(`Modified strategy: ${newStrategy.name}`);
      
      console.log(`🚀 Phase 3: Created new strategy "${newStrategy.name}" v${newStrategy.version}`);
      return newStrategy;

    } catch (error) {
      console.error('Strategy modification error:', error);
      throw error;
    }
  }

  async runABTest(strategyA: string, strategyB: string, testContext: string): Promise<ABTestResult> {
    console.log(`🧪 Phase 3: Running A/B test between "${strategyA}" and "${strategyB}"...`);

    const stratAObj = Array.from(this.strategies.values()).find(s => s.name === strategyA);
    const stratBObj = Array.from(this.strategies.values()).find(s => s.name === strategyB);

    if (!stratAObj || !stratBObj) {
      throw new Error('One or both strategies not found for A/B testing');
    }

    const testResult: ABTestResult = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      strategyA,
      strategyB,
      testContext,
      aResults: [],
      bResults: [],
      winner: 'inconclusive',
      confidence: 0,
      timestamp: new Date()
    };

    // Simulate A/B test results (in real implementation, this would involve actual testing)
    const testCases = [
      'Create a React component for user authentication',
      'Implement a data processing algorithm',
      'Build a responsive navigation menu',
      'Create an API endpoint for user management',
      'Implement error handling middleware'
    ];

    for (const testCase of testCases) {
      // Simulate results for strategy A
      const aQuality = stratAObj.avgQuality + (Math.random() - 0.5) * 10;
      const aSpeed = 1000 + Math.random() * 2000;
      const aSatisfaction = stratAObj.successRate * 100 + (Math.random() - 0.5) * 20;
      
      testResult.aResults.push({
        quality: Math.max(0, Math.min(100, aQuality)),
        speed: aSpeed,
        satisfaction: Math.max(0, Math.min(100, aSatisfaction))
      });

      // Simulate results for strategy B
      const bQuality = stratBObj.avgQuality + (Math.random() - 0.5) * 10;
      const bSpeed = 1000 + Math.random() * 2000;
      const bSatisfaction = stratBObj.successRate * 100 + (Math.random() - 0.5) * 20;
      
      testResult.bResults.push({
        quality: Math.max(0, Math.min(100, bQuality)),
        speed: bSpeed,
        satisfaction: Math.max(0, Math.min(100, bSatisfaction))
      });
    }

    // Calculate winner
    const aAvgScore = testResult.aResults.reduce((sum, r) => sum + (r.quality + r.satisfaction - r.speed/50), 0) / testResult.aResults.length;
    const bAvgScore = testResult.bResults.reduce((sum, r) => sum + (r.quality + r.satisfaction - r.speed/50), 0) / testResult.bResults.length;
    
    const scoreDiff = Math.abs(aAvgScore - bAvgScore);
    testResult.confidence = Math.min(0.95, scoreDiff / 20);

    if (scoreDiff > 5 && testResult.confidence > 0.7) {
      testResult.winner = aAvgScore > bAvgScore ? 'A' : 'B';
      
      // Update strategy performance based on results
      if (testResult.winner === 'A') {
        stratAObj.performance += 2;
        stratAObj.successRate = Math.min(1, stratAObj.successRate + 0.05);
      } else {
        stratBObj.performance += 2;
        stratBObj.successRate = Math.min(1, stratBObj.successRate + 0.05);
      }
    }

    this.abTests.push(testResult);

    // Store A/B test results
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'ab_test_result',
      JSON.stringify({
        winner: testResult.winner,
        confidence: testResult.confidence,
        context: testContext,
        aAvgScore: aAvgScore.toFixed(2),
        bAvgScore: bAvgScore.toFixed(2)
      }),
      0.5
    );

    console.log(`🏆 Phase 3: A/B test completed. Winner: ${testResult.winner} (${(testResult.confidence * 100).toFixed(1)}% confidence)`);
    return testResult;
  }

  private async saveBrainState(changes: string): Promise<void> {
    const brainState: BrainState = {
      id: `brain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      version: this.currentBrainVersion,
      strategies: Array.from(this.strategies.values()),
      patterns: [], // Would include learned patterns
      performance: this.calculateOverallPerformance(),
      timestamp: new Date(),
      changes: [changes]
    };

    this.brainStates.push(brainState);
    
    // Keep only last 50 brain states
    if (this.brainStates.length > 50) {
      this.brainStates = this.brainStates.slice(-50);
    }

    // Store in vector memory
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'brain_state',
      JSON.stringify({
        version: brainState.version,
        strategiesCount: brainState.strategies.length,
        performance: brainState.performance,
        changes
      }),
      0.5
    );

    // Increment version
    const versionParts = this.currentBrainVersion.split('.').map(Number);
    versionParts[2]++;
    this.currentBrainVersion = versionParts.join('.');
  }

  private calculateOverallPerformance(): number {
    const strategies = Array.from(this.strategies.values());
    if (strategies.length === 0) return 0;
    
    const totalPerformance = strategies.reduce((sum, s) => sum + s.performance, 0);
    return totalPerformance / strategies.length;
  }

  getBestStrategy(): PromptStrategy | null {
    const strategies = Array.from(this.strategies.values());
    return strategies.sort((a, b) => b.performance - a.performance)[0] || null;
  }

  getStrategiesStats(): {
    totalStrategies: number;
    averagePerformance: number;
    bestStrategy: string;
    totalABTests: number;
    successfulTests: number;
    brainStatesCount: number;
    currentVersion: string;
  } {
    const strategies = Array.from(this.strategies.values());
    const bestStrategy = this.getBestStrategy();
    const successfulTests = this.abTests.filter(t => t.winner !== 'inconclusive').length;

    return {
      totalStrategies: strategies.length,
      averagePerformance: this.calculateOverallPerformance(),
      bestStrategy: bestStrategy?.name || 'None',
      totalABTests: this.abTests.length,
      successfulTests,
      brainStatesCount: this.brainStates.length,
      currentVersion: this.currentBrainVersion
    };
  }

  getBrainStateHistory(): BrainState[] {
    return this.brainStates.slice(-10); // Return last 10 brain states
  }

  getRecentABTests(): ABTestResult[] {
    return this.abTests.slice(-10); // Return last 10 A/B tests
  }

  async performAutomaticImprovement(): Promise<{ improvements: number; newVersion: string }> {
    console.log('🔄 Phase 3: Performing automatic self-improvement cycle...');

    let improvements = 0;

    // Check if we have enough data for improvements
    const strategies = Array.from(this.strategies.values());
    if (strategies.length < 2) {
      console.log('Not enough strategies for improvement cycle');
      return { improvements: 0, newVersion: this.currentBrainVersion };
    }

    // Find underperforming strategies
    const avgPerformance = this.calculateOverallPerformance();
    const underperforming = strategies.filter(s => s.performance < avgPerformance - 5);

    // Try to improve underperforming strategies
    for (const strategy of underperforming.slice(0, 2)) { // Limit to 2 per cycle
      try {
        await this.modifyGenerationStrategy(
          `Improving underperforming strategy: ${strategy.name}`,
          { performance: strategy.performance, successRate: strategy.successRate }
        );
        improvements++;
      } catch (error) {
        console.warn(`Failed to improve strategy ${strategy.name}:`, error);
      }
    }

    // Run A/B tests between random strategies
    if (strategies.length >= 2 && Math.random() < 0.3) {
      const shuffled = [...strategies].sort(() => Math.random() - 0.5);
      try {
        await this.runABTest(
          shuffled[0].name,
          shuffled[1].name,
          'Automatic improvement cycle test'
        );
        improvements++;
      } catch (error) {
        console.warn('Failed to run automatic A/B test:', error);
      }
    }

    await this.saveBrainState(`Automatic improvement cycle: ${improvements} improvements`);

    console.log(`✅ Phase 3: Automatic improvement completed. ${improvements} improvements made. Version: ${this.currentBrainVersion}`);
    return { improvements, newVersion: this.currentBrainVersion };
  }
}

export const phase3SelfModification = new Phase3SelfModificationLogic();
