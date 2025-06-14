import { PersistentMemory } from "@/core/PersistentMemory";
import { v4 as uuidv4 } from "uuid";
import { LessonManager } from "./LessonManager";
import { ActionPluginManager } from "./ActionPluginManager";
import { vectorMemoryService } from "@/services/VectorMemoryService";
import { AGIState } from "./AGIState";
import { AGINotificationManager } from "./AGINotification";
import { AGIPluginHandler } from "./AGIPluginHandler";
import { GoalScheduler } from "./GoalScheduler";

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

  // Move subscribers to notification manager
  private notifications = new AGINotificationManager();
  subscribe = this.notifications.subscribe.bind(this.notifications);
  unsubscribe = this.notifications.unsubscribe.bind(this.notifications);
  private notify = this.notifications.notify.bind(this.notifications);

  // Managers
  private lessons: LessonManager = new LessonManager();
  private pluginHandler: AGIPluginHandler = new AGIPluginHandler();
  private goalScheduler: GoalScheduler = new GoalScheduler();

  private vectorMemoryId = "core-agi-agent";

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

  public getState() {
    return {
      ...this.state,
      lessonsLearned: this.lessons.getLessons(),
      plugins: this.pluginHandler.getPlugins().map(p => p.name),
      goalQueue: this.goalScheduler.getQueue(),
    };
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
  
  // Plugins via pluginHandler
  public registerPlugin(plugin: Parameters<AGIPluginHandler["register"]>[0]) {
    this.pluginHandler.register(plugin);
    this.log(`🔌 Registered plugin "${plugin.name}" (${plugin.description})`);
    this.notify();
  }

  public unregisterPlugin(name: string) {
    this.pluginHandler.unregister(name);
    this.log(`❌ Unregistered plugin "${name}"`);
    this.notify();
  }

  public getRegisteredPlugins() {
    return this.pluginHandler.getPlugins();
  }

  // Goal scheduler API
  public addGoal(goal: string, priority: number = 1) {
    this.goalScheduler.addGoal(goal, priority);
    this.log(`🗂️ Queued goal "${goal}" with priority ${priority}`);
    this.notify();
  }

  public reprioritizeGoal(goal: string, priority: number) {
    this.goalScheduler.reprioritize(goal, priority);
    this.log(`🎚️ Reprioritized goal "${goal}" to priority ${priority}`);
    this.notify();
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
    this.pluginHandler.clear();
    this.goalScheduler.clear();
    await this.memory.clear();
    this.log("🔄 AGI memory, goals, lessons, plugins, and queue cleared. State reset.");
    this.persistState();
    this.notify();
  }

  public async setGoal(goal: string, priority: number = 1) {
    this.addGoal(goal, priority);
    this.notify();
  }

  public async addMemory(key: string, value: any) {
    await this.memory.set(key, value);
    this.state.memoryKeys = await this.memory.keys();
    this.log(`🧠 Memory stored under key "${key}"`);
    // --- VECTOR MEMORY STORE ---
    try {
      // Store a text summary and the important goal in vector memory
      const summary = (typeof value === "string") ? value : (value?.goal || "") + " | " + (value?.result || "");
      await vectorMemoryService.storeMemory(
        this.vectorMemoryId,
        summary,
        "core-agi-loop",
        0.7 // moderately important
      );
      this.log(`🧬 Vector memory: stored "${(summary ?? "").slice(0, 48)}..."`);
    } catch (e) {
      this.log("Vector memory error: " + (e?.message || e));
    }

    this.persistState();
    this.notify();
  }

  // Main AGI loop (refactored for prioritized goals)
  private async loop() {
    if (!this.state.running) return;
    this.state.generation++;
    this.log(`🔁 AGI Generation ${this.state.generation}...`);

    // 1. Goal selection uses scheduler/queue first, then fallback
    if (!this.state.currentGoal) {
      const newGoal =
        this.goalScheduler.popNextGoal() || this.autoGenerateGoal();
      this.state.currentGoal = newGoal;
      this.log(`🎯 Fetched next goal: "${newGoal}"`);
    }

    // 2. Memory recall & analysis
    const thoughts = await this.recallAndReason();

    // 3. Act: run registered plugins on the goal and thoughts
    let combinedResult = "";
    let pluginOutputs: string[] = [];
    if (this.pluginHandler.getPlugins().length > 0) {
      const memSnapshot = {};
      const outputs = await this.pluginHandler.run(
        this.state.currentGoal!,
        thoughts,
        memSnapshot
      );
      pluginOutputs = outputs.map(o => `[${o.name}] ${o.output}`);
      combinedResult = pluginOutputs.join(" | ");
      this.log(`🔌 Plugins executed: ${pluginOutputs.join(" | ")}`);
    } else {
      combinedResult = await this.defaultActOnGoal(this.state.currentGoal!, thoughts);
    }

    // 4. Store results, memory, learn, and self-improve
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
      // Self-improvement (as before)
      await this.selfImprove();
    }

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
    // First, grab symbolic memory as before:
    const keys = await this.memory.keys();
    let regularMem = "";
    if (!keys || keys.length === 0)
      regularMem = "No significant memories. Acting from scratch.";
    else {
      const memories = [];
      for (let i = 0; i < Math.min(5, keys.length); i++) {
        const mem = await this.memory.get(keys[keys.length - 1 - i]);
        memories.push(mem);
      }
      regularMem =
        "Synthesized thoughts: " +
        memories
          .map((mem, idx) => `[${idx + 1}] ${JSON.stringify(mem).slice(0, 40)}...`)
          .join(" ");
    }

    // Now, NEW: Grab similar vector memories from VectorMemoryService!
    try {
      const vectorMems = await vectorMemoryService.retrieveMemories(
        this.vectorMemoryId,
        this.state.currentGoal || "", // query by current goal
        3
      );
      if (vectorMems && vectorMems.length > 0) {
        regularMem +=
          " || Vector Memory Hints: " +
          vectorMems
            .map((vm, i) => `[${i + 1}] ${vm.content.slice(0, 50)}...`)
            .join(" ");
      }
    } catch (e) {
      this.log("VectorMemoryService recall error: " + (e?.message || e));
    }
    return regularMem;
  }

  private async defaultActOnGoal(goal: string, thoughts: string): Promise<string> {
    await new Promise((res) => setTimeout(res, 500));
    return `Goal "${goal}" was addressed using current knowledge and thoughts: ${thoughts}`;
  }

  // Self-improvement mechanism (NEW)
  private async selfImprove() {
    // With some probability, generate a meta-lesson based on recent completed goals or lessons
    if (this.state.completedGoals.length >= 3 && Math.random() < 0.25) {
      // Look at the last few completed goals
      const last = this.state.completedGoals.slice(-3);
      const mainPoint = last.map(g => g.goal).join("; ");
      const lastLesson = this.lessons.getLessons()[0] || "";
      const improvement =
        `Meta-lesson: AGI should adapt strategies based on recent goals: [${mainPoint}] and last lesson: ${lastLesson.slice(0, 64)}`;
      this.lessons.addLesson(improvement);
      this.log(`🚀 Self-Improvement: ${improvement}`);
    }
    // Otherwise, low-prob "optimization"
    else if (Math.random() < 0.05) {
      this.log("🦾 Self-optimization: Routine AGI cognitive maintenance.");
    }
  }
}

export const unifiedAGI = UnifiedAGICore.getInstance();
