
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { agentCommunicationBus } from './AgentCommunicationBus';

interface Task {
  id: string;
  type: 'error_fix' | 'system_repair' | 'code_generation' | 'optimization' | 'lead_generation';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  assignedAgent?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';
  payload: any;
  createdAt: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
}

export class AgentTaskQueue {
  private taskQueue: Task[] = [];
  private activeAgents: Set<string> = new Set();
  private completedTasks: Task[] = [];
  private maxConcurrentTasks = 10;

  async addTask(taskData: Omit<Task, 'id' | 'status' | 'createdAt' | 'retryCount' | 'maxRetries'>) {
    const task: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    };

    this.taskQueue.push(task);
    await sendChatUpdate(`📋 Added ${task.type} task to queue (Priority: ${task.priority})`);
    
    // Sort queue by priority
    this.taskQueue.sort((a, b) => {
      const priorityOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    // Try to process immediately
    await this.processQueue();
    
    return task.id;
  }

  async processQueue() {
    const availableSlots = this.maxConcurrentTasks - this.activeAgents.size;
    const pendingTasks = this.taskQueue.filter(task => task.status === 'pending');

    for (let i = 0; i < Math.min(availableSlots, pendingTasks.length); i++) {
      const task = pendingTasks[i];
      await this.assignTask(task);
    }
  }

  private async assignTask(task: Task) {
    const availableAgent = await this.findBestAgent(task);
    
    if (!availableAgent) {
      await sendChatUpdate(`⏳ No available agents for ${task.type} task - queuing...`);
      return;
    }

    task.assignedAgent = availableAgent;
    task.status = 'assigned';
    this.activeAgents.add(availableAgent);

    await sendChatUpdate(`🎯 Assigned ${task.type} task to ${availableAgent}`);

    // Execute task
    this.executeTask(task).catch(error => {
      console.error(`Task execution failed: ${task.id}`, error);
      this.handleTaskFailure(task, error);
    });
  }

  private async findBestAgent(task: Task): Promise<string | null> {
    const agentCapabilities = {
      'error_fix': ['ConsoleLogAgent', 'CodeFixerAgent', 'SystemRepairAgent'],
      'system_repair': ['SystemRepairAgent', 'SystemHealthAgent'],
      'code_generation': ['IntelligentAgentFactory', 'CodeFixerAgent'],
      'optimization': ['AgentEvolutionEngine', 'SystemHealthAgent'],
      'lead_generation': ['LeadGenerationMasterAgent', 'MedicalTourismLeadFactory']
    };

    const suitableAgents = agentCapabilities[task.type] || [];
    
    // Find first available agent
    for (const agentName of suitableAgents) {
      if (!this.activeAgents.has(agentName)) {
        return agentName;
      }
    }

    return null;
  }

  private async executeTask(task: Task) {
    try {
      task.status = 'in_progress';
      await sendChatUpdate(`⚡ Executing ${task.type} task with ${task.assignedAgent}...`);

      // If it's a lead generation task, trigger immediate lead generation
      if (task.type === 'lead_generation') {
        await this.executeLeadGenerationTask(task);
      } else {
        // Send task to agent via communication bus
        await agentCommunicationBus.sendMessage({
          id: `execute_${task.id}`,
          fromAgent: 'TaskQueue',
          toAgent: task.assignedAgent!,
          messageType: 'task_request',
          payload: task.payload,
          timestamp: new Date().toISOString(),
          priority: task.priority
        });
      }

      // Simulate task execution time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));

      // Mark as completed
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      this.activeAgents.delete(task.assignedAgent!);
      
      // Move to completed tasks
      this.completedTasks.push(task);
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);

      await sendChatUpdate(`✅ Task completed: ${task.type} by ${task.assignedAgent}`);

      // Process next tasks in queue
      await this.processQueue();

    } catch (error) {
      await this.handleTaskFailure(task, error);
    }
  }

  private async executeLeadGenerationTask(task: Task) {
    try {
      const { LeadGenerationMasterAgentRunner } = await import('@/agents/LeadGenerationMasterAgent');
      
      const result = await LeadGenerationMasterAgentRunner({
        input: { 
          keyword: 'emergency LASIK surgery abroad',
          agentId: `emergency_agent_${Date.now()}`
        },
        user_id: 'emergency_system'
      });

      if (result.success) {
        await sendChatUpdate(`✅ Emergency lead generation completed: ${result.data?.leadsGenerated || 0} leads`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  }

  private async handleTaskFailure(task: Task, error: any) {
    task.retryCount++;
    this.activeAgents.delete(task.assignedAgent!);

    if (task.retryCount < task.maxRetries) {
      task.status = 'pending';
      task.assignedAgent = undefined;
      await sendChatUpdate(`🔄 Retrying failed task: ${task.type} (Attempt ${task.retryCount + 1}/${task.maxRetries})`);
      await this.processQueue();
    } else {
      task.status = 'failed';
      await sendChatUpdate(`❌ Task failed permanently: ${task.type} after ${task.maxRetries} attempts`);
      this.completedTasks.push(task);
      this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
    }
  }

  async addEmergencyLeadGenerationTasks(count: number = 5) {
    await sendChatUpdate(`🚨 Adding ${count} emergency lead generation tasks to queue`);
    
    const taskPromises = Array.from({ length: count }, (_, i) => 
      this.addTask({
        type: 'lead_generation',
        priority: 'emergency',
        payload: { 
          keyword: `emergency medical tourism ${i + 1}`,
          mode: 'emergency_generation'
        }
      })
    );

    const taskIds = await Promise.all(taskPromises);
    
    await sendChatUpdate(`⚡ Emergency lead generation tasks queued: ${taskIds.length} agents deployed`);
    return taskIds;
  }

  getQueueStats() {
    return {
      pendingTasks: this.taskQueue.filter(t => t.status === 'pending').length,
      activeTasks: this.taskQueue.filter(t => t.status === 'in_progress').length,
      completedTasks: this.completedTasks.length,
      failedTasks: this.completedTasks.filter(t => t.status === 'failed').length,
      activeAgents: this.activeAgents.size,
      queueCapacity: this.maxConcurrentTasks
    };
  }

  getTasks(status?: string) {
    if (status) {
      return [...this.taskQueue, ...this.completedTasks].filter(t => t.status === status);
    }
    return [...this.taskQueue, ...this.completedTasks];
  }
}

export const agentTaskQueue = new AgentTaskQueue();
