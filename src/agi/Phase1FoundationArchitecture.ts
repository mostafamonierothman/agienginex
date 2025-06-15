
import { llmService } from '@/utils/llm';
import { SupabaseVectorMemoryService } from '@/services/SupabaseVectorMemoryService';

export interface CodeMetrics {
  generationSpeed: number; // milliseconds
  codeQualityScore: number; // 0-100
  userSatisfactionScore: number; // 0-100
  complexity: number; // 1-10
  maintainability: number; // 1-10
  performance: number; // 1-10
  timestamp: Date;
}

export interface CodeGenerationResult {
  id: string;
  input: string;
  output: string;
  metrics: CodeMetrics;
  userFeedback?: 'positive' | 'negative' | 'neutral';
  improvements?: string[];
}

export class Phase1FoundationArchitecture {
  private agentId = 'phase1-foundation';
  private generationHistory: CodeGenerationResult[] = [];
  private performanceMetrics: CodeMetrics[] = [];

  async generateCode(input: string): Promise<CodeGenerationResult> {
    const startTime = Date.now();
    
    try {
      console.log('🏗️ Phase 1: Generating code with foundation architecture...');
      
      const prompt = `
You are an advanced code generator with self-analysis capabilities.
Generate high-quality, production-ready code for: ${input}

Focus on:
1. Clean, maintainable architecture
2. Performance optimization
3. Error handling
4. Type safety
5. Best practices

Provide complete, functional code that can be directly used.
`;

      const response = await llmService.fetchLLMResponse(prompt, 'gpt-4o');
      const generationTime = Date.now() - startTime;
      
      const metrics = await this.analyzeCodeQuality(response.content, generationTime);
      
      const result: CodeGenerationResult = {
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        input,
        output: response.content,
        metrics,
        improvements: []
      };

      this.generationHistory.push(result);
      this.performanceMetrics.push(metrics);
      
      // Store in vector memory for analysis
      await this.storeGenerationResult(result);
      
      console.log(`✅ Phase 1: Code generated in ${generationTime}ms with quality score ${metrics.codeQualityScore}`);
      
      return result;
    } catch (error) {
      console.error('Phase 1 generation error:', error);
      throw error;
    }
  }

  private async analyzeCodeQuality(code: string, generationTime: number): Promise<CodeMetrics> {
    // Real-time code quality analysis
    const complexityScore = this.calculateComplexity(code);
    const maintainabilityScore = this.calculateMaintainability(code);
    const performanceScore = this.calculatePerformance(code);
    
    const qualityScore = Math.round((complexityScore + maintainabilityScore + performanceScore) / 3);
    
    return {
      generationSpeed: generationTime,
      codeQualityScore: qualityScore,
      userSatisfactionScore: 85, // Default, updated based on feedback
      complexity: 10 - Math.floor(complexityScore / 10),
      maintainability: Math.floor(maintainabilityScore / 10),
      performance: Math.floor(performanceScore / 10),
      timestamp: new Date()
    };
  }

  private calculateComplexity(code: string): number {
    // Analyze code complexity metrics
    const lines = code.split('\n').length;
    const functions = (code.match(/function|const.*=.*=>/g) || []).length;
    const conditionals = (code.match(/if|switch|for|while/g) || []).length;
    
    const complexityRatio = (conditionals + functions) / Math.max(lines, 1);
    return Math.min(100, Math.max(0, 100 - (complexityRatio * 200)));
  }

  private calculateMaintainability(code: string): number {
    // Analyze maintainability factors
    const hasComments = code.includes('//') || code.includes('/*');
    const hasTypeAnnotations = code.includes(':') && code.includes('interface');
    const hasErrorHandling = code.includes('try') || code.includes('catch');
    const hasConsistentNaming = !/[A-Z][a-z]*[A-Z]/.test(code);
    
    let score = 60;
    if (hasComments) score += 10;
    if (hasTypeAnnotations) score += 15;
    if (hasErrorHandling) score += 10;
    if (hasConsistentNaming) score += 5;
    
    return Math.min(100, score);
  }

  private calculatePerformance(code: string): number {
    // Analyze performance characteristics
    const hasAsyncOperations = code.includes('async') || code.includes('await');
    const hasOptimizations = code.includes('useMemo') || code.includes('useCallback');
    const avoidsNestedLoops = !(code.match(/for.*for|while.*while/g) || []).length;
    const hasEfficientDataStructures = code.includes('Map') || code.includes('Set');
    
    let score = 70;
    if (hasAsyncOperations) score += 10;
    if (hasOptimizations) score += 10;
    if (avoidsNestedLoops) score += 5;
    if (hasEfficientDataStructures) score += 5;
    
    return Math.min(100, score);
  }

  private async storeGenerationResult(result: CodeGenerationResult): Promise<void> {
    try {
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'code_generation',
        JSON.stringify({
          input: result.input,
          qualityScore: result.metrics.codeQualityScore,
          generationTime: result.metrics.generationSpeed,
          complexity: result.metrics.complexity
        }),
        { 
          type: 'generation_result',
          quality: result.metrics.codeQualityScore,
          timestamp: result.metrics.timestamp.getTime()
        }
      );
    } catch (error) {
      console.warn('Failed to store generation result:', error);
    }
  }

  async updateUserFeedback(resultId: string, feedback: 'positive' | 'negative' | 'neutral'): Promise<void> {
    const result = this.generationHistory.find(r => r.id === resultId);
    if (result) {
      result.userFeedback = feedback;
      
      // Update satisfaction score based on feedback
      const satisfaction = feedback === 'positive' ? 95 : feedback === 'negative' ? 30 : 70;
      result.metrics.userSatisfactionScore = satisfaction;
      
      console.log(`📊 Phase 1: Updated user feedback for ${resultId}: ${feedback}`);
    }
  }

  getPerformanceMetrics(): {
    averageGenerationSpeed: number;
    averageQualityScore: number;
    averageSatisfactionScore: number;
    totalGenerations: number;
    improvementTrend: number;
  } {
    if (this.performanceMetrics.length === 0) {
      return {
        averageGenerationSpeed: 0,
        averageQualityScore: 0,
        averageSatisfactionScore: 0,
        totalGenerations: 0,
        improvementTrend: 0
      };
    }

    const recent = this.performanceMetrics.slice(-10);
    const older = this.performanceMetrics.slice(-20, -10);
    
    const avgSpeed = recent.reduce((sum, m) => sum + m.generationSpeed, 0) / recent.length;
    const avgQuality = recent.reduce((sum, m) => sum + m.codeQualityScore, 0) / recent.length;
    const avgSatisfaction = recent.reduce((sum, m) => sum + m.userSatisfactionScore, 0) / recent.length;
    
    // Calculate improvement trend
    const recentAvgQuality = recent.reduce((sum, m) => sum + m.codeQualityScore, 0) / recent.length;
    const olderAvgQuality = older.length > 0 ? older.reduce((sum, m) => sum + m.codeQualityScore, 0) / older.length : recentAvgQuality;
    const improvementTrend = recentAvgQuality - olderAvgQuality;

    return {
      averageGenerationSpeed: Math.round(avgSpeed),
      averageQualityScore: Math.round(avgQuality),
      averageSatisfactionScore: Math.round(avgSatisfaction),
      totalGenerations: this.generationHistory.length,
      improvementTrend: Math.round(improvementTrend * 10) / 10
    };
  }

  getGenerationHistory(): CodeGenerationResult[] {
    return this.generationHistory.slice(-20); // Return last 20 generations
  }

  async initializeSelfAnalysisFramework(): Promise<void> {
    console.log('🔍 Phase 1: Initializing self-analysis framework...');
    
    // Set up baseline performance tracking
    await SupabaseVectorMemoryService.storeMemory(
      this.agentId,
      'framework_init',
      'Phase 1 Foundation Architecture initialized with self-analysis capabilities',
      { type: 'system_init', phase: 1 }
    );
    
    console.log('✅ Phase 1: Self-analysis framework initialized successfully');
  }
}

export const phase1Foundation = new Phase1FoundationArchitecture();
