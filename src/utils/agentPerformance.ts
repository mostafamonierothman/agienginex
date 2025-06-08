
interface AgentPerformanceData {
  agent_name: string;
  runs: number;
  successes: number;
  failures: number;
  avg_execution_time: number;
  last_run: string;
}

export class AgentPerformanceCalculator {
  static calculateScore(data: AgentPerformanceData): number {
    const successRate = data.runs > 0 ? (data.successes / data.runs) : 0;
    const reliabilityScore = successRate * 40; // 40 points max for success rate
    
    // Frequency bonus (more runs = more active)
    const frequencyScore = Math.min(data.runs * 2, 30); // 30 points max for frequency
    
    // Recent activity bonus
    const lastRunDate = new Date(data.last_run);
    const hoursSinceLastRun = (Date.now() - lastRunDate.getTime()) / (1000 * 60 * 60);
    const recencyScore = Math.max(30 - hoursSinceLastRun, 0); // 30 points max, decreases over time
    
    const totalScore = reliabilityScore + frequencyScore + recencyScore;
    return Math.min(Math.round(totalScore), 100);
  }

  static getPerformanceGrade(score: number): string {
    if (score >= 90) return 'S+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  static getPerformanceColor(score: number): string {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  }
}

export interface AgentTemplate {
  nameTemplate: string;
  type: string;
  purpose: string;
  config: Record<string, any>;
}

export const AGENT_CATEGORIES = {
  SCANNER: 'scanner',
  GENERATOR: 'generator', 
  ANALYZER: 'analyzer',
  COORDINATOR: 'coordinator',
  OPTIMIZER: 'optimizer'
} as const;

export type AgentCategory = typeof AGENT_CATEGORIES[keyof typeof AGENT_CATEGORIES];
