
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { sendChatUpdate } from '@/utils/sendChatUpdate';

interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  messageType: 'task_request' | 'task_response' | 'error_alert' | 'status_update' | 'collaboration';
  payload: any;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
}

export class AgentCommunicationBus {
  private messageQueue: AgentMessage[] = [];
  private activeAgents: Map<string, any> = new Map();
  private subscriptions: Map<string, Function[]> = new Map();

  async sendMessage(message: AgentMessage) {
    console.log(`[AgentCommunicationBus] Message: ${message.fromAgent} → ${message.toAgent}: ${message.messageType}`);
    
    this.messageQueue.push(message);
    await this.routeMessage(message);
    
    // Notify subscribers
    const subscribers = this.subscriptions.get(message.toAgent) || [];
    subscribers.forEach(callback => callback(message));
  }

  async routeMessage(message: AgentMessage) {
    const targetAgent = this.activeAgents.get(message.toAgent);
    
    if (targetAgent && message.messageType === 'task_request') {
      await sendChatUpdate(`📡 AgentBus: Routing ${message.messageType} from ${message.fromAgent} to ${message.toAgent}`);
      
      // Execute the target agent with the message payload
      try {
        const response = await targetAgent.runner({
          input: message.payload,
          user_id: 'agent_communication_bus'
        });
        
        // Send response back
        await this.sendMessage({
          id: `response_${Date.now()}`,
          fromAgent: message.toAgent,
          toAgent: message.fromAgent,
          messageType: 'task_response',
          payload: response,
          timestamp: new Date().toISOString(),
          priority: message.priority
        });
      } catch (error) {
        console.error(`[AgentCommunicationBus] Error executing ${message.toAgent}:`, error);
      }
    }
  }

  registerAgent(agentName: string, agentInstance: any) {
    this.activeAgents.set(agentName, agentInstance);
    console.log(`[AgentCommunicationBus] Registered agent: ${agentName}`);
  }

  subscribe(agentName: string, callback: Function) {
    if (!this.subscriptions.has(agentName)) {
      this.subscriptions.set(agentName, []);
    }
    this.subscriptions.get(agentName)!.push(callback);
  }

  async broadcastErrorAlert(errorInfo: any) {
    const errorMessage: AgentMessage = {
      id: `error_${Date.now()}`,
      fromAgent: 'SystemMonitor',
      toAgent: 'ALL',
      messageType: 'error_alert',
      payload: errorInfo,
      timestamp: new Date().toISOString(),
      priority: 'emergency'
    };

    await sendChatUpdate(`🚨 Broadcasting error alert to all agents: ${errorInfo.type}`);
    
    // Send to all error-fixing agents
    const errorFixingAgents = ['ConsoleLogAgent', 'CodeFixerAgent', 'SystemHealthAgent', 'SystemRepairAgent'];
    
    for (const agentName of errorFixingAgents) {
      if (this.activeAgents.has(agentName)) {
        await this.sendMessage({
          ...errorMessage,
          toAgent: agentName,
          id: `error_${agentName}_${Date.now()}`
        });
      }
    }
  }

  async coordinateErrorFixing(errors: any[]) {
    await sendChatUpdate(`🎯 Coordinating ${errors.length} error-fixing tasks across agent network...`);
    
    // Distribute errors among available fixing agents
    const fixingAgents = ['CodeFixerAgent', 'SystemRepairAgent', 'DatabaseErrorAgent'];
    
    for (let i = 0; i < errors.length; i++) {
      const targetAgent = fixingAgents[i % fixingAgents.length];
      
      await this.sendMessage({
        id: `fix_task_${i}_${Date.now()}`,
        fromAgent: 'ErrorCoordinator',
        toAgent: targetAgent,
        messageType: 'task_request',
        payload: { error: errors[i], urgency: 'high' },
        timestamp: new Date().toISOString(),
        priority: 'high'
      });
    }
  }

  getMessageHistory(agentName?: string) {
    if (agentName) {
      return this.messageQueue.filter(msg => 
        msg.fromAgent === agentName || msg.toAgent === agentName
      );
    }
    return this.messageQueue;
  }

  getSystemStats() {
    return {
      totalMessages: this.messageQueue.length,
      activeAgents: this.activeAgents.size,
      subscriptions: this.subscriptions.size,
      recentActivity: this.messageQueue.slice(-10)
    };
  }
}

export const agentCommunicationBus = new AgentCommunicationBus();
