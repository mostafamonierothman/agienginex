import { AGIPluginHandler } from "./AGIPluginHandler";
import { GoalScheduler } from "./GoalScheduler";
import { AGIAgentCollaborationManager, PeerFeedback } from "./AGIAgentCollaborationManager";
import { AGIMemoryOps } from "./AGIMemoryOps";
import { LessonManager } from "./LessonManager";
import { AgentTeamManager } from "./AgentTeamManager";

export class AGIAgentLoop {
  private pluginHandler: AGIPluginHandler;
  private goalScheduler: GoalScheduler;
  private memoryOps: AGIMemoryOps;
  private agentCollaboration: AGIAgentCollaborationManager;
  private lessonManager: LessonManager;
  private teamManager: AgentTeamManager;

  constructor(
    pluginHandler: AGIPluginHandler,
    goalScheduler: GoalScheduler,
    memoryOps: AGIMemoryOps,
    agentCollaboration: AGIAgentCollaborationManager,
    lessonManager: LessonManager,
    teamManager: AgentTeamManager
  ) {
    this.pluginHandler = pluginHandler;
    this.goalScheduler = goalScheduler;
    this.memoryOps = memoryOps;
    this.agentCollaboration = agentCollaboration;
    this.lessonManager = lessonManager;
    this.teamManager = teamManager;
  }

  async runLoop(state: any, log: (msg: string) => void, persist: () => Promise<void>) {
    state.generation++;
    log(`🔁 AGI Generation ${state.generation}...`);
    // 1. Goal selection
    if (!state.currentGoal) {
      const newGoal = this.goalScheduler.popNextGoal() || this.autoGenerateGoal();
      state.currentGoal = newGoal;
      log(`🎯 Fetched goal: "${newGoal}"`);
    }

    // === 2. Memory recall (symbolic and vector) ===
    let recalledVectorMemories = [];
    try {
      if (state.currentGoal) {
        recalledVectorMemories = await this.memoryOps.recallFromVectorMemory(state.currentGoal);
        state["lastRecalledVectorMemories"] = recalledVectorMemories;
        if (recalledVectorMemories.length) {
          log(
            `🧠 Recalled ${recalledVectorMemories.length} vector memories for "${state.currentGoal}":\n` +
            recalledVectorMemories.map((m: any) => `- "${m.memory_value || m}"`).join("\n")
          );
        } else {
          log(`🧠 No relevant vector memories found for "${state.currentGoal}".`);
        }
      }
    } catch (err) {
      log(`🧠 Vector memory recall failed: ${err instanceof Error ? err.message : "Unknown error"}`);
      state["lastRecalledVectorMemories"] = [];
    }

    // 3. Plugin and default action
    // Simulated result logic here:
    let result = "[mocked result]";
    // The below can later be replaced with actual plugin/action output.
    // e.g. result = await this.pluginHandler.run(...);

    // === Automatically store the completed goal/result in vector memory ===
    if (state.currentGoal && result) {
      try {
        await this.memoryOps.storeToVectorMemory(state.currentGoal, { goal: state.currentGoal, result }, {});
        log(`💾 Stored completed goal/result in vector memory for "${state.currentGoal}"`);
      } catch (e: any) {
        log(`⚠️ Failed to store to vector memory: ${e?.message || e}`);
      }
    }

    // 4. Peer feedback and teamwork
    let peerFeedback: PeerFeedback[] = [];
    try {
      peerFeedback = await this.agentCollaboration.requestPeerFeedback(
        state.currentGoal!,
        result
      );
      state["recentCollaborationFeedback"] = [
        ...(state["recentCollaborationFeedback"] || []),
        ...peerFeedback,
      ].slice(-10);
      peerFeedback.forEach(fb =>
        log(`🤝 Peer ${fb.agent}: ${fb.feedback}`)
      );
      // Team collaboration step!
      if (Math.random() < 0.3) {
        const team = this.teamManager.getOrFormTeam("core-agi-agent", state.currentGoal!);
        team.forEach(agent => log(`👥 Team member "${agent}" collaborating on "${state.currentGoal}"`));
      }
    } catch (e: any) {
      log(`Team/Peer Feedback error: ${e.message || e}`);
    }
    // ... continue loop logic, update, persist
    await persist();
  }

  private autoGenerateGoal(): string {
    return "Refactored AGI to enable teamwork and meta-cognitive loops!";
  }
}
