
import { llmService } from '@/utils/llm';
import { SupabaseVectorMemoryService } from '@/services/SupabaseVectorMemoryService';
import { phase1Foundation, CodeGenerationResult } from './Phase1FoundationArchitecture';

export interface CodePattern {
  id: string;
  pattern: string;
  quality: 'good' | 'bad' | 'neutral';
  frequency: number;
  impact: number;
  examples: string[];
  timestamp: Date;
}

export interface UserInteraction {
  id: string;
  type: 'feedback' | 'modification' | 'rejection' | 'acceptance';
  context: string;
  outcome: 'positive' | 'negative' | 'neutral';
  learnings: string[];
  timestamp: Date;
}

export class Phase2SelfAnalysisEngine {
  private agentId = 'phase2-analysis';
  private patterns: Map<string, CodePattern> = new Map();
  private userInteractions: UserInteraction[] = [];
  private qualityThresholds = {
    good: 80,
    neutral: 60,
    bad: 40
  };

  async analyzeCodeQuality(code: string): Promise<{
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    patterns: CodePattern[];
    suggestions: string[];
  }> {
    console.log('🔬 Phase 2: Analyzing code quality with pattern recognition...');

    try {
      // Advanced LLM-based code analysis
      const analysisPrompt = `
Analyze this code for quality, patterns, and improvements:

\`\`\`
${code}
\`\`\`

Provide analysis in JSON format:
{
  "overallScore": 1-100,
  "strengths": ["list of strengths"],
  "weaknesses": ["list of weaknesses"],
  "patterns": [
    {
      "pattern": "pattern description",
      "quality": "good|bad|neutral",
      "impact": 1-10,
      "frequency": 1-10
    }
  ],
  "suggestions": ["specific improvement suggestions"]
}

Focus on:
1. Code structure and organization
2. Performance implications
3. Maintainability factors
4. Security considerations
5. Best practice adherence
`;

      const response = await llmService.fetchLLMResponse(analysisPrompt, 'gpt-4o');
      const analysis = JSON.parse(response.content);

      // Process and store patterns
      for (const patternData of analysis.patterns) {
        await this.recordPattern(patternData, code);
      }

      // Store analysis results
      await this.storeAnalysisResult(code, analysis);

      console.log(`✅ Phase 2: Code analysis completed with score ${analysis.overallScore}`);
      return analysis;

    } catch (error) {
      console.error('Phase 2 analysis error:', error);
      return {
        overallScore: 50,
        strengths: [],
        weaknesses: ['Analysis failed'],
        patterns: [],
        suggestions: ['Unable to analyze code']
      };
    }
  }

  private async recordPattern(patternData: any, codeExample: string): Promise<void> {
    const patternId = `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const pattern: CodePattern = {
      id: patternId,
      pattern: patternData.pattern,
      quality: patternData.quality,
      frequency: patternData.frequency || 1,
      impact: patternData.impact || 5,
      examples: [codeExample.substring(0, 200)],
      timestamp: new Date()
    };

    // Check if similar pattern exists
    const existingPattern = Array.from(this.patterns.values()).find(p => 
      p.pattern.toLowerCase().includes(pattern.pattern.toLowerCase()) ||
      pattern.pattern.toLowerCase().includes(p.pattern.toLowerCase())
    );

    if (existingPattern) {
      existingPattern.frequency++;
      existingPattern.examples.push(codeExample.substring(0, 200));
      if (existingPattern.examples.length > 5) {
        existingPattern.examples = existingPattern.examples.slice(-5);
      }
    } else {
      this.patterns.set(patternId, pattern);
    }

    // Store pattern in vector memory
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'code_pattern',
      JSON.stringify(pattern),
      { 
        type: 'pattern',
        quality: pattern.quality,
        impact: pattern.impact
      }
    );
  }

  async createFeedbackLoop(userInteraction: UserInteraction): Promise<void> {
    console.log('🔄 Phase 2: Processing user interaction for feedback loop...');

    this.userInteractions.push(userInteraction);

    // Analyze interaction patterns
    const recentInteractions = this.userInteractions.slice(-20);
    const positiveRatio = recentInteractions.filter(i => i.outcome === 'positive').length / recentInteractions.length;
    
    // Extract learnings from interactions
    const learnings = await this.extractLearningsFromInteractions(recentInteractions);
    
    // Update quality thresholds based on user feedback
    if (positiveRatio > 0.8) {
      this.qualityThresholds.good = Math.min(90, this.qualityThresholds.good + 2);
      this.qualityThresholds.neutral = Math.min(75, this.qualityThresholds.neutral + 1);
    } else if (positiveRatio < 0.4) {
      this.qualityThresholds.good = Math.max(70, this.qualityThresholds.good - 2);
      this.qualityThresholds.neutral = Math.max(50, this.qualityThresholds.neutral - 1);
    }

    // Store feedback loop data
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'feedback_loop',
      JSON.stringify({
        interaction: userInteraction,
        positiveRatio,
        learnings,
        updatedThresholds: this.qualityThresholds
      }),
      { 
        type: 'feedback',
        outcome: userInteraction.outcome,
        timestamp: Date.now()
      }
    );

    console.log(`📈 Phase 2: Feedback loop updated. Positive ratio: ${(positiveRatio * 100).toFixed(1)}%`);
  }

  private async extractLearningsFromInteractions(interactions: UserInteraction[]): Promise<string[]> {
    const learnings: string[] = [];
    
    // Analyze patterns in user feedback
    const feedbackPatterns = interactions.reduce((acc, interaction) => {
      if (interaction.outcome === 'positive') {
        acc.positive.push(interaction.context);
      } else if (interaction.outcome === 'negative') {
        acc.negative.push(interaction.context);
      }
      return acc;
    }, { positive: [] as string[], negative: [] as string[] });

    // Use LLM to extract insights
    if (feedbackPatterns.positive.length > 0 || feedbackPatterns.negative.length > 0) {
      try {
        const insightPrompt = `
Analyze user feedback patterns and extract key learnings:

Positive feedback contexts:
${feedbackPatterns.positive.join('\n')}

Negative feedback contexts:
${feedbackPatterns.negative.join('\n')}

Extract 3-5 specific learnings about what users prefer and what they reject.
Return as JSON array of strings.
`;

        const response = await llmService.fetchLLMResponse(insightPrompt, 'gpt-4o-mini');
        const extractedLearnings = JSON.parse(response.content);
        learnings.push(...extractedLearnings);
      } catch (error) {
        console.warn('Failed to extract learnings from LLM:', error);
      }
    }

    return learnings;
  }

  async identifyGoodVsBadPatterns(): Promise<{
    goodPatterns: CodePattern[];
    badPatterns: CodePattern[];
    recommendations: string[];
  }> {
    console.log('🎯 Phase 2: Identifying good vs bad code patterns...');

    const allPatterns = Array.from(this.patterns.values());
    
    const goodPatterns = allPatterns.filter(p => 
      p.quality === 'good' && p.frequency >= 2
    ).sort((a, b) => b.impact - a.impact);

    const badPatterns = allPatterns.filter(p => 
      p.quality === 'bad' && p.frequency >= 2
    ).sort((a, b) => b.impact - a.impact);

    // Generate recommendations based on patterns
    const recommendations = [
      ...goodPatterns.slice(0, 3).map(p => `Promote pattern: ${p.pattern}`),
      ...badPatterns.slice(0, 3).map(p => `Avoid pattern: ${p.pattern}`)
    ];

    // Store pattern analysis
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'pattern_analysis',
      JSON.stringify({
        goodPatterns: goodPatterns.length,
        badPatterns: badPatterns.length,
        recommendations
      }),
      { 
        type: 'pattern_analysis',
        timestamp: Date.now()
      }
    );

    console.log(`🔍 Phase 2: Identified ${goodPatterns.length} good patterns and ${badPatterns.length} bad patterns`);

    return {
      goodPatterns: goodPatterns.slice(0, 10),
      badPatterns: badPatterns.slice(0, 10),
      recommendations
    };
  }

  private async storeAnalysisResult(code: string, analysis: any): Promise<void> {
    try {
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'quality_analysis',
        JSON.stringify({
          codeSnippet: code.substring(0, 500),
          overallScore: analysis.overallScore,
          strengthsCount: analysis.strengths.length,
          weaknessesCount: analysis.weaknesses.length,
          patternsFound: analysis.patterns.length
        }),
        { 
          type: 'analysis_result',
          score: analysis.overallScore,
          timestamp: Date.now()
        }
      );
    } catch (error) {
      console.warn('Failed to store analysis result:', error);
    }
  }

  getPatternStatistics(): {
    totalPatterns: number;
    goodPatterns: number;
    badPatterns: number;
    mostFrequentPattern: CodePattern | null;
    highestImpactPattern: CodePattern | null;
  } {
    const allPatterns = Array.from(this.patterns.values());
    
    return {
      totalPatterns: allPatterns.length,
      goodPatterns: allPatterns.filter(p => p.quality === 'good').length,
      badPatterns: allPatterns.filter(p => p.quality === 'bad').length,
      mostFrequentPattern: allPatterns.sort((a, b) => b.frequency - a.frequency)[0] || null,
      highestImpactPattern: allPatterns.sort((a, b) => b.impact - a.impact)[0] || null
    };
  }

  getUserInteractionStats(): {
    totalInteractions: number;
    positiveRatio: number;
    recentTrend: 'improving' | 'declining' | 'stable';
    topLearnings: string[];
  } {
    const total = this.userInteractions.length;
    const positive = this.userInteractions.filter(i => i.outcome === 'positive').length;
    const positiveRatio = total > 0 ? positive / total : 0;

    // Calculate trend
    const recent = this.userInteractions.slice(-10);
    const older = this.userInteractions.slice(-20, -10);
    const recentPositive = recent.filter(i => i.outcome === 'positive').length / Math.max(recent.length, 1);
    const olderPositive = older.filter(i => i.outcome === 'positive').length / Math.max(older.length, 1);
    
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentPositive > olderPositive + 0.1) trend = 'improving';
    else if (recentPositive < olderPositive - 0.1) trend = 'declining';

    // Extract top learnings
    const allLearnings = this.userInteractions.flatMap(i => i.learnings);
    const topLearnings = [...new Set(allLearnings)].slice(0, 5);

    return {
      totalInteractions: total,
      positiveRatio,
      recentTrend: trend,
      topLearnings
    };
  }

  async initializeAnalysisEngine(): Promise<void> {
    console.log('🔬 Phase 2: Initializing self-analysis engine...');
    
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'engine_init',
      'Phase 2 Self-Analysis Engine initialized with pattern recognition and feedback loops',
      { type: 'system_init', phase: 2 }
    );
    
    console.log('✅ Phase 2: Self-analysis engine initialized successfully');
  }
}

export const phase2SelfAnalysis = new Phase2SelfAnalysisEngine();
