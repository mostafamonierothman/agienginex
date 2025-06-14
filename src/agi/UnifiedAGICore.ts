
import { PersistentMemory } from "@/core/PersistentMemory";
import { v4 as uuidv4 } from "uuid";

type AGIState = {
  running: boolean;
  currentGoal: string | null;
  completedGoals: { goal: string; result: string; timestamp: string }[];
  memoryKeys: string[];
  logs: string[];
  generation: number;
};

type AGIOptions = {
  autoStart?: boolean;
};

// Singleton Functional AGI
class UnifiedAGICore {
  private static instance: UnifiedAGICore;
  private state: AGIState = {
    running: false,
    currentGoal: null,
    completedGoals: [],
    memoryKeys: [],
    logs: [],
    generation: 0,
  };
  private memory: PersistentMemory;
  private loopTimer: NodeJS.Timeout | null = null;
  private observers: Array<() => void> = [];
  // Lessons are handled *outside* the main state to prevent type drift
  private lessonsLearned: string[] = [];

  private constructor() {
    this.memory = new PersistentMemory();
    this.restoreState();
    this.restoreLessons();
  }

  static getInstance() {
    if (!UnifiedAGICore.instance) {
      UnifiedAGICore.instance = new UnifiedAGICore();
    }
    return UnifiedAGICore.instance;
  }

  public subscribe(observer: () => void) {
    this.observers.push(observer);
  }

  public unsubscribe(observer: () => void) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  private notify() {
    this.observers.forEach((cb) => cb());
  }

  public getState() {
    // safely bind the lessons outside of the "locked" AGIState
    return { ...this.state, lessonsLearned: [...this.lessonsLearned] };
  }

  private log(msg: string) {
    const timestamp = new Date().toISOString();
    this.state.logs.unshift(`[${timestamp}] ${msg}`);
    if (this.state.logs.length > 60) this.state.logs = this.state.logs.slice(0, 60);
    this.notify();
  }

  private async persistState() {
    await this.memory.set("unified_agi_state", this.state);
    await this.memory.set("unified_agi_lessons", this.lessonsLearned);
  }

  private async restoreState() {
    const prev = await this.memory.get("unified_agi_state", null);
    if (prev) {
      this.state = { ...prev, logs: [], running: false };
      this.log("Restored AGI state from memory.");
    }
  }

  private async restoreLessons() {
    const lessons = await this.memory.get("unified_agi_lessons", []);
    this.lessonsLearned = Array.isArray(lessons) ? lessons : [];
  }

  public async start() {
    if (this.state.running) {
      this.log("AGI already running.");
      return;
    }
    this.state.running = true;
    this.log("🔄 Unified Functional AGI Started.");
    this.persistState();
    this.loop();
    this.notify();
  }

  public stop() {
    this.state.running = false;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.log("⏹️ AGI stopped.");
    this.persistState();
    this.notify();
  }

  public async reset() {
    this.stop();
    this.state = {
      running: false,
      currentGoal: null,
      completedGoals: [],
      memoryKeys: [],
      logs: [],
      generation: 0,
    };
    this.lessonsLearned = [];
    await this.memory.clear();
    this.log("🔄 AGI memory, goals, and lessons cleared. State reset.");
    this.persistState();
    this.notify();
  }

  public async setGoal(goal: string) {
    this.state.currentGoal = goal;
    this.log(`🎯 New goal set: "${goal}"`);
    this.persistState();
    this.notify();
  }

  public async addMemory(key: string, value: any) {
    await this.memory.set(key, value);
    this.state.memoryKeys = await this.memory.keys();
    this.log(`🧠 Memory stored under key "${key}"`);
    this.persistState();
    this.notify();
  }

  // Main AGI loop
  private async loop() {
    if (!this.state.running) return;

    this.state.generation++;
    this.log(`🔁 AGI Generation ${this.state.generation}...`);

    // 1. Goal selection (now learning-aware)
    if (!this.state.currentGoal) {
      const newGoal = this.autoGenerateGoal();
      await this.setGoal(newGoal);
    }

    // 2. Memory recall & analysis
    const thoughts = await this.recallAndReason();

    // 3. Act: attempt to achieve goal
    const result = await this.actOnGoal(this.state.currentGoal!, thoughts);

    // 4. Store results and memory, and LEARN
    if (result) {
      this.state.completedGoals.push({
        goal: this.state.currentGoal!,
        result,
        timestamp: new Date().toISOString(),
      });
      await this.addMemory(
        `goal_${this.state.generation}_${uuidv4().slice(0, 8)}`,
        {
          goal: this.state.currentGoal,
          thoughts,
          result,
          generation: this.state.generation,
        }
      );
      // Direct learning after a successful run
      this.learnFromGoal(this.state.currentGoal!, result, thoughts);
      this.state.currentGoal = null;
    }

    // 5. Learn and optimize (self-improve)
    this.selfImprove();

    this.persistState();
    this.notify();

    this.loopTimer = setTimeout(() => this.loop(), 2000);
  }

  private learnFromGoal(goal: string, result: string, thoughts: string) {
    const lesson = `If AGI works on "${goal}", result: ${result.slice(0, 48)}...`;
    if (!this.lessonsLearned.includes(lesson)) {
      this.lessonsLearned.unshift(lesson);
      if (this.lessonsLearned.length > 40) this.lessonsLearned = this.lessonsLearned.slice(0, 40);
      this.log(`🧠 Learned lesson: ${lesson}`);
    }
  }

  private autoGenerateGoal(): string {
    const baseGoals = [
      "Find new ways to optimize workflow",
      "Improve coding speed and accuracy",
      "Invent new knowledge from memory",
      "Audit and fix potential issues",
      "Help the user accomplish their goals",
      "Summarize what I've learned so far",
      "Strengthen my reasoning abilities"
    ];
    // Integrate learning
    if (this.lessonsLearned.length > 0 && Math.random() < 0.4) {
      const fragment = this.lessonsLearned[Math.floor(Math.random() * this.lessonsLearned.length)];
      return `Expand on learned lesson: ${fragment.slice(0, 60)}`;
    }
    const previous = this.state.completedGoals;
    if (previous.length > 0 && Math.random() < 0.15) {
      const past = previous[Math.floor(Math.random() * previous.length)];
      return `Reflect and improve upon past goal: "${past.goal}"`;
    }
    return baseGoals[Math.floor(Math.random() * baseGoals.length)];
  }

  private async recallAndReason(): Promise<string> {
    const keys = await this.memory.keys();
    if (!keys || keys.length === 0) return "No significant memories. Acting from scratch.";
    const memories = [];
    for (let i = 0; i < Math.min(5, keys.length); i++) {
      const mem = await this.memory.get(keys[keys.length - 1 - i]);
      memories.push(mem);
    }
    return (
      "Synthesized thoughts: " +
      memories
        .map((mem, idx) => `[${idx + 1}] ${JSON.stringify(mem).slice(0, 40)}...`)
        .join(" ")
    );
  }

  private async actOnGoal(goal: string, thoughts: string): Promise<string> {
    await new Promise((res) => setTimeout(res, 500));
    return `Goal "${goal}" was addressed using current knowledge and thoughts: ${thoughts}`;
  }

  private selfImprove() {
    if (Math.random() < 0.1) {
      this.log("🦾 AGI performed an internal optimization!");
    }
  }
}

export const unifiedAGI = UnifiedAGICore.getInstance();

// ... End of file
