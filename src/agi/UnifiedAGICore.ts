import { AGIState } from "./AGIState";
import { AGIStateManagement } from "./AGIStateManagement";
import { LessonManager } from "./LessonManager";
import { AGIPluginHandler } from "./AGIPluginHandler";
import { GoalScheduler } from "./GoalScheduler";
import { AGIAgentCollaborationManager } from "./AGIAgentCollaborationManager";
import { AGIMemoryOps } from "./AGIMemoryOps";
import { AGINotificationManager } from "./AGINotification";
import { AGIAgentLoop } from "./AGIAgentLoop";
import { AgentTeamManager } from "./AgentTeamManager";
import { DataFusionEngine } from "@/utils/data_fusion";
import { vectorMemoryService } from "@/services/VectorMemoryService";

class UnifiedAGICore {
  private static instance: UnifiedAGICore;
  private stateManager = new AGIStateManagement();
  private notification = new AGINotificationManager();
  private pluginHandler = new AGIPluginHandler();
  private goalScheduler = new GoalScheduler();
  private lessons = new LessonManager();
  private agentCollaboration = new AGIAgentCollaborationManager();
  private teamManager = new AgentTeamManager();
  private memoryOps = new AGIMemoryOps(this.lessons, "core-agi-agent");

  // Mention callback used for adaptive prioritization
  private agentLoop = new AGIAgentLoop(
    this.pluginHandler,
    this.goalScheduler,
    this.memoryOps,
    this.agentCollaboration,
    this.lessons,
    this.teamManager,
    (goal: string, priority: number) => this.reprioritizeGoal(goal, priority)
  );
  private loopTimer: NodeJS.Timeout | null = null;

  subscribe = this.notification.subscribe.bind(this.notification);
  unsubscribe = this.notification.unsubscribe.bind(this.notification);
  private notify = this.notification.notify.bind(this.notification);

  private constructor() {}

  static getInstance() {
    if (!UnifiedAGICore.instance) {
      UnifiedAGICore.instance = new UnifiedAGICore();
    }
    return UnifiedAGICore.instance;
  }

  async start() {
    if (this.stateManager.getState().running) {
      this.log("AGI already running.");
      return;
    }
    this.stateManager.setState({ running: true });
    this.log("🔄 Unified Functional AGI Started.");
    // NEW: Put recent world state into AGI memory before loop starts
    await this.absorbWorldState();
    await this.stateManager.persistState();
    this.loop();
    this.notify();
  }

  stop() {
    this.stateManager.setState({ running: false });
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    this.log("⏹️ AGI stopped.");
    this.stateManager.persistState();
    this.notify();
  }

  async loop() {
    if (!this.stateManager.getState().running) return;
    await this.agentLoop.runLoop(
      this.stateManager.getState(),
      (msg) => this.log(msg),
      () => this.stateManager.persistState()
    );
    this.loopTimer = setTimeout(() => this.loop(), 2000);
  }

  log(msg: string) {
    const state = this.stateManager.getState();
    const timestamp = new Date().toISOString();
    state.logs.unshift(`[${timestamp}] ${msg}`);
    if (state.logs.length > 60) state.logs = state.logs.slice(0, 60);
    this.notify();
  }
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

  public async reset() {
    this.stop();
    await this.stateManager.clear();
    this.lessons.clear();
    this.pluginHandler.clear();
    this.goalScheduler.clear();
    // NEW: Absorb world state
    await this.absorbWorldState();
    this.log("🔄 AGI memory, goals, lessons, plugins, and queue cleared. State reset.");
    this.stateManager.persistState();
    this.notify();
  }

  public async setGoal(goal: string, priority: number = 1) {
    this.addGoal(goal, priority);
    this.notify();
  }

  public async addMemory(key: string, value: any) {
    const state = this.stateManager.getState();
    await this.stateManager.persistState({
      memoryKeys: [...state.memoryKeys, key],
    });
    this.log(`🧠 Memory stored under key "${key}"`);
    try {
      await this.memoryOps.storeToVectorMemory(key, value, {});
      this.log(`🧬 Vector memory: stored "${(value ?? "").slice(0, 48)}..."`);
    } catch (e) {
      this.log("Vector memory error: " + (e?.message || e));
    }
    this.notify();
  }

  // NEW: Method to fuse world data
  private async absorbWorldState() {
    this.log("🌎 Absorbing real-world state: fetching news, RSS, and APIs.");
    // Demo: use processRSSFeed for world news/tech
    try {
      await DataFusionEngine.processRSSFeed(
        "https://www.cnbc.com/id/100003114/device/rss/rss.html",
        "core-agi-agent"
      );
      await DataFusionEngine.processRSSFeed(
        "https://www.reutersagency.com/feed/?best-sectors=technology",
        "core-agi-agent"
      );
      this.log("🌎 World data fused into agent memory.");
      // Optionally: surface in state
      const latestMemories = await vectorMemoryService.retrieveMemories(
        "core-agi-agent",
        "world news",
        5
      );
      this.stateManager.setState({
        lastRecalledWorldState: latestMemories
      });
    } catch (e) {
      this.log("Warning: Could not fuse world state: " + (e.message || e));
    }
  }

  getState() {
    return {
      ...this.stateManager.getState(),
      lessonsLearned: this.lessons.getLessons(),
      plugins: this.pluginHandler.getPlugins().map((p) => p.name),
      goalQueue: this.goalScheduler.getQueue(),
      recentCollaborationFeedback: this.stateManager.getState()["recentCollaborationFeedback"] || [],
      lastRecalledVectorMemories: this.stateManager.getState()["lastRecalledVectorMemories"] || [],
      // NEW: expose world state knowledge
      lastRecalledWorldState: this.stateManager.getState()["lastRecalledWorldState"] || [],
    };
  }
}

export const unifiedAGI = UnifiedAGICore.getInstance();
