
export class AgentTaskQueue {
  static async enqueue(task: any) {
    console.log('🔄 [AgentTaskQueue] Task queued:', task);
    
    // Store task in localStorage as fallback
    try {
      const existingTasks = JSON.parse(localStorage.getItem('agent_tasks') || '[]');
      existingTasks.push({
        ...task,
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        queued_at: new Date().toISOString()
      });
      localStorage.setItem('agent_tasks', JSON.stringify(existingTasks));
      console.log('✅ [AgentTaskQueue] Task stored successfully');
    } catch (error) {
      console.error('❌ [AgentTaskQueue] Failed to store task:', error);
    }
    
    return true;
  }

  static async dequeue() {
    try {
      const tasks = JSON.parse(localStorage.getItem('agent_tasks') || '[]');
      if (tasks.length > 0) {
        const task = tasks.shift();
        localStorage.setItem('agent_tasks', JSON.stringify(tasks));
        console.log('📤 [AgentTaskQueue] Task dequeued:', task);
        return task;
      }
    } catch (error) {
      console.error('❌ [AgentTaskQueue] Failed to dequeue task:', error);
    }
    return null;
  }

  static async getQueueLength() {
    try {
      const tasks = JSON.parse(localStorage.getItem('agent_tasks') || '[]');
      return tasks.length;
    } catch (error) {
      return 0;
    }
  }
}
