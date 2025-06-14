
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
    await vectorMemoryService.storeMemory(
      this.vectorMemoryId,
      summary,
      "core-agi-loop",
      0.7
    );
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
