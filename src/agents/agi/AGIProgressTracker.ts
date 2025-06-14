
import { supabase } from '@/integrations/supabase/client';
import { AGICapabilitiesManager } from './AGICapabilitiesManager';

export class AGIProgressTracker {
  constructor(private capabilitiesManager: AGICapabilitiesManager) {}

  async performSelfAssessment(cycleCount: number): Promise<void> {
    const assessment = {
      cycleCount,
      intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
      capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
      performance: this.capabilitiesManager.calculatePerformanceScore(cycleCount),
      phase: this.capabilitiesManager.getAGIPhase(),
      nextEvolution: this.capabilitiesManager.planNextEvolution()
    };

    console.log(`📊 Phase 1 AGI Self-Assessment: ${assessment.performance}% performance, ${assessment.capabilities.length} capabilities active`);
  }

  async logProgressWithFallback(cycleCount: number): Promise<void> {
    try {
      await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'lovable_agi_agent',
          agent_name: 'lovable_agi_agent',
          action: 'autonomous_cycle',
          input: JSON.stringify({
            cycle: cycleCount,
            intelligenceLevel: this.capabilitiesManager.getIntelligenceLevel(),
            capabilities: Array.from(this.capabilitiesManager.getCapabilities()),
            phase: this.capabilitiesManager.getAGIPhase()
          }),
          status: 'completed',
          output: `Phase 1 AGI autonomous cycle ${cycleCount} completed - Intelligence: ${this.capabilitiesManager.getIntelligenceLevel()}%`
        });
    } catch (error) {
      console.error('Failed to log progress:', error);
    }
  }
}
