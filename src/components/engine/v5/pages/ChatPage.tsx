
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Bot } from 'lucide-react';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "AGI V5", 
      text: "Welcome to AGI V5! I can help you manage agents, monitor projects, and execute tasks. Ask me anything about the system!", 
      timestamp: new Date().toISOString(),
      isUser: false
    },
    { 
      sender: "System", 
      text: "All 22 agents are online and ready for commands. Try asking about system status, improvements, or planning.", 
      timestamp: new Date().toISOString(),
      isUser: false
    }
  ]);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      sender: message.startsWith('Error:') || message.startsWith('Sorry,') ? "AGI V5" : "User",
      text: message,
      timestamp: new Date().toISOString(),
      isUser: !message.startsWith('Error:') && !message.startsWith('Sorry,') && message !== "User"
    };

    setChatHistory(prev => [...prev, newMessage]);
  };

  const quickCommands = [
    { label: "What is the system status?", action: () => handleSendMessage("What is the system status?") },
    { label: "How can the system be improved?", action: () => handleSendMessage("How can the system be improved?") },
    { label: "Plan a research project", action: () => handleSendMessage("Plan a research project") },
    { label: "Show agent coordination", action: () => handleSendMessage("Show agent coordination") }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Chat with AGI V5</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface onSendMessage={handleSendMessage} />
        </div>

        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-400" />
                Quick Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickCommands.map((cmd, index) => (
                <button 
                  key={index}
                  onClick={cmd.action}
                  className="w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-slate-700/50 transition-colors"
                >
                  • {cmd.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
