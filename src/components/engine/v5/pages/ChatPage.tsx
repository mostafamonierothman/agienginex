
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Bot, User } from 'lucide-react';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "AGI", 
      text: "Welcome to AGI! I can help you manage agents, monitor projects, and execute tasks. Ask me anything about the system!", 
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      sender: message.startsWith('Error:') || message.startsWith('Sorry,') ? "AGI" : "User",
      text: message,
      timestamp: new Date().toISOString(),
      isUser: !message.startsWith('Error:') && !message.startsWith('Sorry,') && message !== "User"
    };

    setChatHistory(prev => [...prev, newMessage]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Chat with AGI</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ChatInterface onSendMessage={handleSendMessage} />
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto space-y-3">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser ? 'bg-blue-600' : 'bg-purple-600'
                  }`}>
                    {msg.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-white'
                  }`}>
                    <div className="text-sm font-semibold mb-1">{msg.sender}</div>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
