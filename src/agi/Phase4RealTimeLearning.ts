import { SupabaseVectorMemoryService } from '@/services/SupabaseVectorMemoryService';
import { phase3SelfModification } from './Phase3SelfModificationLogic';

export interface EvolutionStep {
  id: string;
  timestamp: Date;
  type: 'strategy_creation' | 'strategy_improvement' | 'ab_test' | 'pattern_learning';
  description: string;
  beforeMetrics: any;
  afterMetrics: any;
  impact: number;
  version: string;
}

export interface CapabilityComparison {
  id: string;
  capability: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  timestamp: Date;
  examples: string[];
}

export interface RealTimeMetric {
  timestamp: Date;
  codeQuality: number;
  generationSpeed: number;
  userSatisfaction: number;
  adaptability: number;
  autonomy: number;
}

export class Phase4RealTimeLearning {
  private agentId = 'phase4-realtime';
  private evolutionSteps: EvolutionStep[] = [];
  private capabilityComparisons: CapabilityComparison[] = [];
  private realTimeMetrics: RealTimeMetric[] = [];
  private isLearning = false;

  async startRealTimeLearning(): Promise<void> {
    if (this.isLearning) {
      console.log('Real-time learning already active');
      return;
    }

    this.isLearning = true;
    console.log('🚀 Phase 4: Starting real-time learning interface...');

    // Initialize baseline metrics
    await this.captureBaselineMetrics();

    // Start continuous learning loop
    this.startLearningLoop();

    console.log('✅ Phase 4: Real-time learning interface activated');
  }

  private async startLearningLoop(): Promise<void> {
    const learningCycle = async () => {
      if (!this.isLearning) return;

      try {
        // Capture current state
        const currentMetrics = await this.captureCurrentMetrics();
        this.realTimeMetrics.push(currentMetrics);

        // Perform learning step
        await this.performLearningStep();

        // Update visualizations
        await this.updateEvolutionVisualization();

        // Keep metrics history manageable
        if (this.realTimeMetrics.length > 1000) {
          this.realTimeMetrics = this.realTimeMetrics.slice(-1000);
        }

      } catch (error) {
        console.error('Learning cycle error:', error);
      }

      // Schedule next cycle
      setTimeout(learningCycle, 30000); // Every 30 seconds
    };

    learningCycle();
  }

  private async captureBaselineMetrics(): Promise<void> {
    const baselineMetric: RealTimeMetric = {
      timestamp: new Date(),
      codeQuality: 75,
      generationSpeed: 2000,
      userSatisfaction: 80,
      adaptability: 60,
      autonomy: 70
    };

    this.realTimeMetrics.push(baselineMetric);

    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'baseline_metrics',
      JSON.stringify(baselineMetric),
      { 
        type: 'baseline',
        timestamp: Date.now()
      }
    );
  }

  private async captureCurrentMetrics(): Promise<RealTimeMetric> {
    // Get latest performance data from other phases
    const strategyStats = phase3SelfModification.getStrategiesStats();
    
    // Calculate metrics based on current state
    const currentMetric: RealTimeMetric = {
      timestamp: new Date(),
      codeQuality: Math.min(100, strategyStats.averagePerformance),
      generationSpeed: 2000 - (strategyStats.totalStrategies * 50), // More strategies = faster generation
      userSatisfaction: 75 + (strategyStats.successfulTests * 2), // More successful tests = higher satisfaction
      adaptability: 50 + (strategyStats.totalABTests * 3), // More tests = higher adaptability
      autonomy: 60 + (strategyStats.brainStatesCount * 0.5) // More brain states = higher autonomy
    };

    return currentMetric;
  }

  private async performLearningStep(): Promise<void> {
    // Randomly trigger different learning activities
    const learningActivities = [
      () => this.trackStrategyEvolution(),
      () => this.compareCapabilities(),
      () => this.analyzeSelfModifications(),
      () => this.updateEvolutionTree()
    ];

    const activity = learningActivities[Math.floor(Math.random() * learningActivities.length)];
    await activity();
  }

  private async trackStrategyEvolution(): Promise<void> {
    const stats = phase3SelfModification.getStrategiesStats();
    const recentBrainStates = phase3SelfModification.getBrainStateHistory();

    if (recentBrainStates.length >= 2) {
      const latest = recentBrainStates[recentBrainStates.length - 1];
      const previous = recentBrainStates[recentBrainStates.length - 2];

      const evolutionStep: EvolutionStep = {
        id: `evolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type: 'strategy_improvement',
        description: `Strategy evolution: ${latest.changes.join(', ')}`,
        beforeMetrics: { performance: previous.performance, strategies: previous.strategies.length },
        afterMetrics: { performance: latest.performance, strategies: latest.strategies.length },
        impact: latest.performance - previous.performance,
        version: latest.version
      };

      this.evolutionSteps.push(evolutionStep);

      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'evolution_step',
        JSON.stringify(evolutionStep),
        { 
          type: 'evolution',
          impact: evolutionStep.impact,
          timestamp: Date.now()
        }
      );

      console.log(`📈 Phase 4: Tracked evolution step with impact ${evolutionStep.impact.toFixed(2)}`);
    }
  }

  private async compareCapabilities(): Promise<void> {
    // Compare current capabilities with previous state
    const currentMetrics = this.realTimeMetrics[this.realTimeMetrics.length - 1];
    const previousMetrics = this.realTimeMetrics[this.realTimeMetrics.length - 10]; // Compare with 10 cycles ago

    if (!previousMetrics) return;

    const capabilities = [
      { name: 'Code Quality', current: currentMetrics.codeQuality, previous: previousMetrics.codeQuality },
      { name: 'Generation Speed', current: currentMetrics.generationSpeed, previous: previousMetrics.generationSpeed, inverse: true },
      { name: 'User Satisfaction', current: currentMetrics.userSatisfaction, previous: previousMetrics.userSatisfaction },
      { name: 'Adaptability', current: currentMetrics.adaptability, previous: previousMetrics.adaptability },
      { name: 'Autonomy', current: currentMetrics.autonomy, previous: previousMetrics.autonomy }
    ];

    for (const cap of capabilities) {
      const improvement = cap.inverse ? 
        (cap.previous - cap.current) / cap.previous * 100 : // For speed, lower is better
        (cap.current - cap.previous) / cap.previous * 100;

      if (Math.abs(improvement) > 1) { // Only track significant changes
        const comparison: CapabilityComparison = {
          id: `comparison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          capability: cap.name,
          beforeScore: cap.previous,
          afterScore: cap.current,
          improvement,
          timestamp: new Date(),
          examples: [`Improved from ${cap.previous.toFixed(1)} to ${cap.current.toFixed(1)}`]
        };

        this.capabilityComparisons.push(comparison);

        console.log(`🔄 Phase 4: ${cap.name} ${improvement > 0 ? 'improved' : 'declined'} by ${Math.abs(improvement).toFixed(1)}%`);
      }
    }
  }

  private async analyzeSelfModifications(): Promise<void> {
    const recentABTests = phase3SelfModification.getRecentABTests();
    
    if (recentABTests.length > 0) {
      const successfulTests = recentABTests.filter(t => t.winner !== 'inconclusive');
      const successRate = successfulTests.length / recentABTests.length;

      const evolutionStep: EvolutionStep = {
        id: `modification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type: 'ab_test',
        description: `A/B testing cycle: ${successfulTests.length}/${recentABTests.length} successful tests`,
        beforeMetrics: { testCount: 0 },
        afterMetrics: { testCount: recentABTests.length, successRate },
        impact: successRate * 10, // Convert to impact score
        version: phase3SelfModification.getStrategiesStats().currentVersion
      };

      this.evolutionSteps.push(evolutionStep);

      console.log(`🧪 Phase 4: Analyzed self-modifications - ${(successRate * 100).toFixed(1)}% success rate`);
    }
  }

  private async updateEvolutionTree(): Promise<void> {
    // Create evolution tree data structure
    const treeData = this.evolutionSteps.slice(-20).map(step => ({
      id: step.id,
      type: step.type,
      description: step.description,
      impact: step.impact,
      timestamp: step.timestamp,
      version: step.version
    }));

    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'evolution_tree',
      JSON.stringify({
        treeData,
        totalSteps: this.evolutionSteps.length,
        avgImpact: this.evolutionSteps.reduce((sum, s) => sum + s.impact, 0) / this.evolutionSteps.length,
        timestamp: Date.now()
      }),
      { 
        type: 'evolution_tree',
        totalSteps: this.evolutionSteps.length,
        timestamp: Date.now()
      }
    );
  }

  private async updateEvolutionVisualization(): Promise<void> {
    // Store current state for visualization
    const visualizationData = {
      currentMetrics: this.realTimeMetrics[this.realTimeMetrics.length - 1],
      recentEvolution: this.evolutionSteps.slice(-5),
      capabilityTrends: this.getCapabilityTrends(),
      learningProgress: this.getLearningProgress()
    };

    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'visualization_data',
      JSON.stringify(visualizationData),
      { 
        type: 'visualization',
        timestamp: Date.now()
      }
    );
  }

  private getCapabilityTrends(): any {
    if (this.realTimeMetrics.length < 10) return null;

    const recent = this.realTimeMetrics.slice(-10);
    const older = this.realTimeMetrics.slice(-20, -10);

    if (older.length === 0) return null;

    const recentAvg = {
      codeQuality: recent.reduce((sum, m) => sum + m.codeQuality, 0) / recent.length,
      generationSpeed: recent.reduce((sum, m) => sum + m.generationSpeed, 0) / recent.length,
      userSatisfaction: recent.reduce((sum, m) => sum + m.userSatisfaction, 0) / recent.length,
      adaptability: recent.reduce((sum, m) => sum + m.adaptability, 0) / recent.length,
      autonomy: recent.reduce((sum, m) => sum + m.autonomy, 0) / recent.length
    };

    const olderAvg = {
      codeQuality: older.reduce((sum, m) => sum + m.codeQuality, 0) / older.length,
      generationSpeed: older.reduce((sum, m) => sum + m.generationSpeed, 0) / older.length,
      userSatisfaction: older.reduce((sum, m) => sum + m.userSatisfaction, 0) / older.length,
      adaptability: older.reduce((sum, m) => sum + m.adaptability, 0) / older.length,
      autonomy: older.reduce((sum, m) => sum + m.autonomy, 0) / older.length
    };

    return {
      codeQuality: recentAvg.codeQuality - olderAvg.codeQuality,
      generationSpeed: olderAvg.generationSpeed - recentAvg.generationSpeed, // Inverted for speed
      userSatisfaction: recentAvg.userSatisfaction - olderAvg.userSatisfaction,
      adaptability: recentAvg.adaptability - olderAvg.adaptability,
      autonomy: recentAvg.autonomy - olderAvg.autonomy
    };
  }

  private getLearningProgress(): any {
    return {
      totalEvolutionSteps: this.evolutionSteps.length,
      totalCapabilityComparisons: this.capabilityComparisons.length,
      totalMetricsCollected: this.realTimeMetrics.length,
      averageImpact: this.evolutionSteps.length > 0 ? 
        this.evolutionSteps.reduce((sum, s) => sum + s.impact, 0) / this.evolutionSteps.length : 0,
      learningVelocity: this.evolutionSteps.filter(s => 
        Date.now() - s.timestamp.getTime() < 3600000 // Last hour
      ).length
    };
  }

  stopRealTimeLearning(): void {
    this.isLearning = false;
    console.log('⏹️ Phase 4: Real-time learning interface stopped');
  }

  getRealTimeStats(): {
    isLearning: boolean;
    totalEvolutionSteps: number;
    totalCapabilityComparisons: number;
    currentMetrics: RealTimeMetric | null;
    recentImpact: number;
    learningVelocity: number;
  } {
    const recentSteps = this.evolutionSteps.filter(s => 
      Date.now() - s.timestamp.getTime() < 3600000 // Last hour
    );

    return {
      isLearning: this.isLearning,
      totalEvolutionSteps: this.evolutionSteps.length,
      totalCapabilityComparisons: this.capabilityComparisons.length,
      currentMetrics: this.realTimeMetrics[this.realTimeMetrics.length - 1] || null,
      recentImpact: recentSteps.reduce((sum, s) => sum + s.impact, 0),
      learningVelocity: recentSteps.length
    };
  }

  getEvolutionSteps(): EvolutionStep[] {
    return this.evolutionSteps.slice(-20); // Return last 20 steps
  }

  getCapabilityComparisons(): CapabilityComparison[] {
    return this.capabilityComparisons.slice(-10); // Return last 10 comparisons
  }

  getMetricsTrend(): RealTimeMetric[] {
    return this.realTimeMetrics.slice(-50); // Return last 50 metrics for trending
  }
}

export const phase4RealTimeLearning = new Phase4RealTimeLearning();
