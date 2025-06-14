
export class LessonManager {
  private lessons: string[] = [];

  addLesson(lesson: string) {
    if (!this.lessons.includes(lesson)) {
      this.lessons.unshift(lesson);
      if (this.lessons.length > 40) this.lessons = this.lessons.slice(0, 40);
    }
  }

  getLessons(): string[] {
    return [...this.lessons];
  }

  clear() {
    this.lessons = [];
  }

  setLessons(newLessons: string[]) {
    this.lessons = [...newLessons];
  }
}
