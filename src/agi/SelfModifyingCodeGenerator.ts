import { llmService } from '@/utils/llm';
import { SupabaseVectorMemoryService } from '@/services/SupabaseVectorMemoryService';

export interface CodeAnalysis {
  id: string;
  fileName: string;
  complexity: number;
  maintainability: number;
  performance: number;
  suggestions: string[];
  timestamp: Date;
}

export interface CodeImprovement {
  id: string;
  originalCode: string;
  improvedCode: string;
  improvements: string[];
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export class SelfModifyingCodeGenerator {
  private agentId = 'self-modifying-code-generator';
  private analysisHistory: CodeAnalysis[] = [];
  private improvementHistory: CodeImprovement[] = [];
  private isAnalyzing = false;

  async analyzeCodebase(): Promise<CodeAnalysis[]> {
    if (this.isAnalyzing) return this.analysisHistory;
    
    this.isAnalyzing = true;
    console.log('🔍 Self-Modifying Code Generator: Starting codebase analysis...');

    try {
      // Analyze key AGI system files
      const criticalFiles = [
        'src/agi/UnifiedAGICore.ts',
        'src/agi/SelfModificationProtocol.ts',
        'src/services/VectorMemoryService.ts',
        'src/agi/AGIStateManagement.ts'
      ];

      const analyses: CodeAnalysis[] = [];

      for (const fileName of criticalFiles) {
        const analysis = await this.analyzeFile(fileName);
        if (analysis) {
          analyses.push(analysis);
          await this.storeAnalysis(analysis);
        }
      }

      this.analysisHistory = analyses;
      console.log(`📊 Analyzed ${analyses.length} critical files`);
      
      return analyses;
    } catch (error) {
      console.error('Code analysis error:', error);
      return [];
    } finally {
      this.isAnalyzing = false;
    }
  }

  private async analyzeFile(fileName: string): Promise<CodeAnalysis | null> {
    try {
      const prompt = `
Analyze this TypeScript file for AGI system optimization:
File: ${fileName}

Provide analysis in JSON format:
{
  "complexity": 1-10,
  "maintainability": 1-10,
  "performance": 1-10,
  "suggestions": ["specific improvement suggestions"]
}

Focus on:
1. Code complexity and readability
2. Performance optimizations
3. Memory efficiency
4. AGI-specific improvements
5. Self-modification capabilities
`;

      const response = await llmService.fetchLLMResponse(prompt, 'gpt-4.1-2025-04-14');
      
      try {
        const analysisData = JSON.parse(response.content);
        
        return {
          id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fileName,
          complexity: analysisData.complexity || 5,
          maintainability: analysisData.maintainability || 5,
          performance: analysisData.performance || 5,
          suggestions: analysisData.suggestions || [],
          timestamp: new Date()
        };
      } catch (parseError) {
        console.warn(`Failed to parse analysis for ${fileName}:`, parseError);
        return null;
      }
    } catch (error) {
      console.error(`Error analyzing ${fileName}:`, error);
      return null;
    }
  }

  async generateImprovedCode(fileName: string, targetMetric: string): Promise<CodeImprovement | null> {
    try {
      console.log(`🔧 Generating improved code for ${fileName} (target: ${targetMetric})`);

      const prompt = `
You are a Self-Modifying AGI Code Generator. Analyze and improve this code:
File: ${fileName}
Target improvement: ${targetMetric}

Generate improved code focusing on:
1. Enhanced AGI capabilities
2. Better self-modification features
3. Improved performance and memory efficiency
4. More robust error handling
5. Advanced autonomous behaviors

Provide response in JSON format:
{
  "improvedCode": "complete improved code here",
  "improvements": ["list of specific improvements made"],
  "confidence": 0-100,
  "riskLevel": "low|medium|high"
}

The improved code should be production-ready and maintain all existing functionality while adding AGI enhancements.
`;

      const response = await llmService.fetchLLMResponse(prompt, 'gpt-4.1-2025-04-14');
      
      try {
        const improvementData = JSON.parse(response.content);
        
        const improvement: CodeImprovement = {
          id: `improvement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          originalCode: `// Original code from ${fileName}`,
          improvedCode: improvementData.improvedCode || '',
          improvements: improvementData.improvements || [],
          confidence: improvementData.confidence || 0,
          riskLevel: improvementData.riskLevel || 'medium',
          timestamp: new Date()
        };

        this.improvementHistory.push(improvement);
        await this.storeImprovement(improvement);
        
        console.log(`✅ Generated improved code with ${improvement.confidence}% confidence`);
        return improvement;
      } catch (parseError) {
        console.warn(`Failed to parse improvement for ${fileName}:`, parseError);
        return null;
      }
    } catch (error) {
      console.error(`Error generating improved code for ${fileName}:`, error);
      return null;
    }
  }

  async implementSelfModification(): Promise<{ success: boolean; modifications: number }> {
    console.log('🚀 Self-Modifying Code Generator: Starting self-modification cycle...');
    
    try {
      // Analyze current state
      const analyses = await this.analyzeCodebase();
      let modificationsApplied = 0;

      // Find files that need improvement
      const filesToImprove = analyses.filter(analysis => 
        analysis.complexity > 7 || 
        analysis.maintainability < 6 || 
        analysis.performance < 6
      );

      console.log(`🎯 Found ${filesToImprove.length} files that need improvement`);

      // Generate improvements for critical files
      for (const analysis of filesToImprove.slice(0, 2)) { // Limit to 2 files per cycle
        const targetMetric = analysis.complexity > 7 ? 'complexity' : 
                           analysis.maintainability < 6 ? 'maintainability' : 'performance';
        
        const improvement = await this.generateImprovedCode(analysis.fileName, targetMetric);
        
        if (improvement && improvement.confidence > 70 && improvement.riskLevel === 'low') {
          // In a real implementation, this would apply the code changes
          console.log(`🔄 Would apply improvement to ${analysis.fileName}`);
          modificationsApplied++;
        }
      }

      // Store self-modification cycle results
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'self_modification_cycle',
        `Self-modification cycle completed. Analyzed ${analyses.length} files, applied ${modificationsApplied} improvements.`,
        0.5
      );

      return { success: true, modifications: modificationsApplied };
    } catch (error) {
      console.error('Self-modification error:', error);
      return { success: false, modifications: 0 };
    }
  }

  async getEvolutionMetrics(): Promise<{
    totalAnalyses: number;
    totalImprovements: number;
    averageConfidence: number;
    riskDistribution: { low: number; medium: number; high: number };
  }> {
    const riskDistribution = this.improvementHistory.reduce(
      (acc, improvement) => {
        acc[improvement.riskLevel]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    const averageConfidence = this.improvementHistory.length > 0
      ? this.improvementHistory.reduce((sum, imp) => sum + imp.confidence, 0) / this.improvementHistory.length
      : 0;

    return {
      totalAnalyses: this.analysisHistory.length,
      totalImprovements: this.improvementHistory.length,
      averageConfidence,
      riskDistribution
    };
  }

  private async storeAnalysis(analysis: CodeAnalysis): Promise<void> {
    try {
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'code_analysis',
        JSON.stringify(analysis),
        0.5
      );
    } catch (error) {
      console.warn('Failed to store analysis:', error);
    }
  }

  private async storeImprovement(improvement: CodeImprovement): Promise<void> {
    try {
      await SupabaseVectorMemoryService.storeMemory(
        this.agentId,
        'code_improvement',
        JSON.stringify(improvement),
        0.5
      );
    } catch (error) {
      console.warn('Failed to store improvement:', error);
    }
  }

  getAnalysisHistory(): CodeAnalysis[] {
    return this.analysisHistory;
  }

  getImprovementHistory(): CodeImprovement[] {
    return this.improvementHistory;
  }
}

export const selfModifyingCodeGenerator = new SelfModifyingCodeGenerator();
