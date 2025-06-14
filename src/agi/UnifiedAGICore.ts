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
    generation: 0
  };
  private memory: PersistentMemory;
  private loopTimer: NodeJS.Timeout | null = null;
  private observers: Array<() => void> = [];

  private constructor() {
    this.memory = new PersistentMemory();
    this.restoreState();
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
    return { ...this.state };
  }

  private log(msg: string) {
    const timestamp = new Date().toISOString();
    this.state.logs.unshift(`[${timestamp}] ${msg}`);
    // Only keep the latest 60 logs
    if (this.state.logs.length > 60) this.state.logs = this.state.logs.slice(0, 60);
    this.notify();
  }

  private async persistState() {
    await this.memory.set("unified_agi_state", this.state);
  }

  private async restoreState() {
    const prev = await this.memory.get("unified_agi_state", null);
    if (prev) {
      this.state = { ...prev, logs: [], running: false };
      this.log("Restored AGI state from memory.");
    }
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
      generation: 0
    };
    await this.memory.clear();
    this.log("🔄 AGI memory and goals cleared. State reset.");
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

    // 1. Goal selection
    if (!this.state.currentGoal) {
      const newGoal = this.autoGenerateGoal();
      await this.setGoal(newGoal);
    }

    // 2. Memory recall & analysis
    const thoughts = await this.recallAndReason();

    // 3. Act: attempt to achieve goal (simulate real action!)
    const result = await this.actOnGoal(this.state.currentGoal!, thoughts);

    // 4. Store results and memory
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
      this.state.currentGoal = null; // triggers next cycle to pick new goal
    }

    // 5. Learn and optimize (self-improve)
    this.selfImprove();

    this.persistState();
    this.notify();

    // Autonomously schedule next cycle
    this.loopTimer = setTimeout(() => this.loop(), 2000); // every 2s
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
    // Add randomness and adaptivity
    const previous = this.state.completedGoals;
    if (previous.length > 0 && Math.random() < 0.2) {
      // Reflect on a past goal
      const past = previous[Math.floor(Math.random() * previous.length)];
      return `Reflect and improve upon past goal: "${past.goal}"`;
    }
    return baseGoals[Math.floor(Math.random() * baseGoals.length)];
  }

  private async recallAndReason(): Promise<string> {
    // Synthesize recent memory into a "thought"
    const keys = await this.memory.keys();
    if (!keys || keys.length === 0) return "No significant memories. Acting from scratch.";
    // Fetch last 5 memories
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
    // In a true AGI this is where agent reasoning and action would occur!
    // For now: simulate actual deliberation and action
    await new Promise((res) => setTimeout(res, 500));
    return `Goal "${goal}" was addressed using current knowledge and thoughts: ${thoughts}`;
  }

  private selfImprove() {
    // Simulated self-improvement 
    if (Math.random() < 0.1) {
      this.log("🦾 AGI performed an internal optimization!");
    }
  }
}

export const unifiedAGI = UnifiedAGICore.getInstance();
