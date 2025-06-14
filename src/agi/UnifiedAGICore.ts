
import { PersistentMemory } from "@/core/PersistentMemory";
import { v4 as uuidv4 } from "uuid";
import { LessonManager } from "./LessonManager";
import { ActionPluginManager } from "./ActionPluginManager";

type AGIState = {
  running: boolean;
  currentGoal: string | null;
  completedGoals: { goal: string; result: string; timestamp: string }[];
  memoryKeys: string[];
  logs: string[];
  generation: number;
};

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

  // Managers
  private lessons: LessonManager = new LessonManager();
  private plugins: ActionPluginManager = new ActionPluginManager();

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
    return { ...this.state, lessonsLearned: this.lessons.getLessons(), plugins: this.plugins.getPlugins().map(p => p.name) };
  }

  private log(msg: string) {
    const timestamp = new Date().toISOString();
    this.state.logs.unshift(`[${timestamp}] ${msg}`);
    if (this.state.logs.length > 60) this.state.logs = this.state.logs.slice(0, 60);
    this.notify();
  }

  private async persistState() {
    await this.memory.set("unified_agi_state", this.state);
    await this.memory.set("unified_agi_lessons", this.lessons.getLessons());
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
    if (Array.isArray(lessons)) this.lessons.setLessons(lessons);
  }

  // Plugins
  public registerPlugin(plugin: Parameters<ActionPluginManager["register"]>[0]) {
    this.plugins.register(plugin);
    this.log(`🔌 Registered plugin "${plugin.name}" (${plugin.description})`);
    this.notify();
  }

  public getRegisteredPlugins() {
    return this.plugins.getPlugins();
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
    this.lessons.clear();
    this.plugins.clear();
    await this.memory.clear();
    this.log("🔄 AGI memory, goals, lessons, and plugins cleared. State reset.");
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

    // 3. Act: run registered plugins on the goal and thoughts
    let combinedResult = "";
    let pluginOutputs: string[] = [];
    if (this.plugins.getPlugins().length > 0) {
      const memSnapshot = {};
      const outputs = await this.plugins.run(this.state.currentGoal!, thoughts, memSnapshot);
      pluginOutputs = outputs.map(o => `[${o.name}] ${o.output}`);
      combinedResult = pluginOutputs.join(" | ");
      this.log(`🔌 Plugins executed: ${pluginOutputs.join(" | ")}`);
    } else {
      // fallback default reasoning/action
      combinedResult = await this.defaultActOnGoal(this.state.currentGoal!, thoughts);
    }

    // 4. Store results and memory, and LEARN
    if (combinedResult) {
      this.state.completedGoals.push({
        goal: this.state.currentGoal!,
        result: combinedResult,
        timestamp: new Date().toISOString(),
      });
      await this.addMemory(
        `goal_${this.state.generation}_${uuidv4().slice(0, 8)}`,
        {
          goal: this.state.currentGoal,
          thoughts,
          result: combinedResult,
          plugins: pluginOutputs,
          generation: this.state.generation,
        }
      );
      this.learnFromGoal(this.state.currentGoal!, combinedResult, thoughts);
      this.state.currentGoal = null;
    }

    // 5. Self-improve
    this.selfImprove();

    this.persistState();
    this.notify();
    this.loopTimer = setTimeout(() => this.loop(), 2000);
  }

  private learnFromGoal(goal: string, result: string, thoughts: string) {
    const lesson = `If AGI works on "${goal}", result: ${result.slice(0, 48)}...`;
    this.lessons.addLesson(lesson);
    this.log(`🧠 Learned lesson: ${lesson}`);
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
    // Use lessons bias
    const lessons = this.lessons.getLessons();
    if (lessons.length > 0 && Math.random() < 0.4) {
      const fragment = lessons[Math.floor(Math.random() * lessons.length)];
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

  private async defaultActOnGoal(goal: string, thoughts: string): Promise<string> {
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

