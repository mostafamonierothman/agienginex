
interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
  role?: string;
  content?: string;
}

class AgentChatBus {
  private messages: ChatMessage[] = [];
  private listeners: ((message: ChatMessage) => void)[] = [];

  postMessage(message: ChatMessage) {
    // Normalize message format
    const normalizedMessage = {
      agent: message.agent,
      message: message.message || message.content || '',
      timestamp: message.timestamp,
      role: message.role
    };

    this.messages.push(normalizedMessage);
    this.listeners.forEach(listener => listener(normalizedMessage));
    console.log(`[AgentChatBus] ${normalizedMessage.agent}: ${normalizedMessage.message.substring(0, 100)}...`);
  }

  // Alias for different message formats
  publish(message: { role: string; content: string }) {
    this.postMessage({
      agent: message.role,
      message: message.content,
      timestamp: new Date().toISOString(),
      role: message.role
    });
  }

  emit(event: string, data: any) {
    console.log(`[AgentChatBus] Event: ${event}`, data);
    // In a real implementation, this would trigger event handlers
  }

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  subscribe(listener: (message: ChatMessage) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  clear() {
    this.messages = [];
  }

  getRecentMessages(count: number = 10): ChatMessage[] {
    return this.messages.slice(-count);
  }
}

export const agentChatBus = new AgentChatBus();
