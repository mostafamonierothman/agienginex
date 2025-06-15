import { vectorMemoryService } from "@/services/VectorMemoryService";
import { LessonManager } from "./LessonManager";

export class AGIMemoryOps {
  private lessons: LessonManager;
  private vectorMemoryId: string;

  constructor(lessons: LessonManager, vectorMemoryId: string) {
    this.lessons = lessons;
    this.vectorMemoryId = vectorMemoryId;
  }

  async storeToVectorMemory(key: string, value: any, memory: any) {
    const summary = (typeof value === "string") ? value : (value?.goal || "") + " | " + (value?.result || "");
    // The new vectorMemoryService now persists to Supabase
    await vectorMemoryService.storeMemory(
      this.vectorMemoryId,
      summary,
      "core-agi-loop",
      0.7
    );
  }

  // ---- NEW: Store in episodic (chronological, long-term) memory ----
  async storeEpisodicEvent(event: { type: string; [key: string]: any }) {
    let content = "";
    let source = "episodic";
    let importance = 0.95; // Long-term memory by default
    let tags: string[] = [];

    if (event.type === "completed_goal") {
      content = `[COMPLETED GOAL] Goal: ${event.goal} | Result: ${event.result}`;
      tags = ["episodic", "completed_goal"];
    } else if (event.type === "lesson_learned") {
      content = `[LESSON] ${event.lesson}`;
      tags = ["episodic", "lesson"];
    } else {
      content = `[EPISODIC] ${JSON.stringify(event)}`;
      tags = ["episodic"];
    }

    await vectorMemoryService.storeMemory(
      this.vectorMemoryId,
      content,
      source,
      importance
    );
    // Optionally: pass tags to the vector memory service if future version supports it
  }

  async recallFromVectorMemory(goal: string) {
    return await vectorMemoryService.retrieveMemories(
      this.vectorMemoryId,
      goal,
      3
    );
  }

  addLesson(lesson: string) {
    this.lessons.addLesson(lesson);
  }
}
