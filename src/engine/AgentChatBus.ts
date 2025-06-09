
interface ChatMessage {
  agent: string;
  message: string;
  timestamp: string;
}

class AgentChatBus {
  private messages: ChatMessage[] = [];
  private listeners: ((message: ChatMessage) => void)[] = [];

  postMessage(message: ChatMessage) {
    this.messages.push(message);
    this.listeners.forEach(listener => listener(message));
    console.log(`[AgentChatBus] ${message.agent}: ${message.message.substring(0, 100)}...`);
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
}

export const agentChatBus = new AgentChatBus();
