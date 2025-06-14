import { unifiedAGI } from "@/agi/UnifiedAGICore";
import { supabase } from "@/integrations/supabase/client";

class AutonomousLoop {
  private running = false;
  private loopTimer: NodeJS.Timeout | null = null;
  private cycleCount = 0;

  async start() {
    this.running = true;
    this.runLoop();
  }

  stop() {
    this.running = false;
    if (this.loopTimer) clearTimeout(this.loopTimer);
  }

  private async runLoop() {
    if (!this.running) return;
    this.cycleCount += 1;

    // Execute autonomous learning
    try {
      const state = unifiedAGI.getState();
      if (state.running) {
        // Autonomous goal generation
        if (Math.random() < 0.3) {
          const goals = [
            "Optimize system performance",
            "Enhance user experience",
            "Improve data processing efficiency",
            "Develop new capabilities",
            "Refine decision-making algorithms",
          ];
          const randomGoal = goals[Math.floor(Math.random() * goals.length)];
          unifiedAGI.addGoal(randomGoal, Math.floor(Math.random() * 3) + 1);
        }

        // Autonomous learning
        if (Math.random() < 0.4) {
          const lessons = [
            "Prioritizing user-facing improvements yields better feedback",
            "Data processing optimizations provide exponential benefits",
            "Regular system health checks prevent cascading failures",
            "Contextual awareness improves decision quality",
            "Modular design enables faster capability expansion",
          ];
          const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
          unifiedAGI.log(`🧠 Autonomous learning: ${randomLesson}`);
        }
      }
    } catch (e) {
      console.error("Autonomous loop error:", e);
    }

    // After every cycle, persist a summary into Supabase supervisor_queue
    await supabase
      .from("supervisor_queue")
      .insert({
        user_id: "system",
        agent_name: "autonomous_loop",
        action: "cycle",
        input: JSON.stringify({ cycle: this.cycleCount }),
        status: "completed",
        output: `Loop cycle ${this.cycleCount} persisted at ${new Date().toISOString()}`,
      });

    // Schedule next
    this.loopTimer = setTimeout(() => this.runLoop(), 8000); // e.g., 8s between cycles
  }
}

export const autonomousLoop = new AutonomousLoop();
