
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Bot } from 'lucide-react';

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([
    { sender: "AGI V5", text: "Welcome to AGI V5! I can help you manage agents, monitor projects, and execute tasks.", timestamp: new Date().toISOString() },
    { sender: "System", text: "All 19 agents are online and ready for commands.", timestamp: new Date().toISOString() }
  ]);

  const handleSendMessage = (message: string) => {
    const userMessage = {
      sender: "User",
      text: message,
      timestamp: new Date().toISOString()
    };

    const systemResponse = {
      sender: "AGI V5",
      text: `Executing: ${message}. Routing to appropriate agents...`,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage, systemResponse]);
  };

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
              <button 
                onClick={() => handleSendMessage("Start all agents")}
                className="w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-slate-700/50"
              >
                • Start all agents
              </button>
              <button 
                onClick={() => handleSendMessage("Show system status")}
                className="w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-slate-700/50"
              >
                • Show system status
              </button>
              <button 
                onClick={() => handleSendMessage("Run research task")}
                className="w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-slate-700/50"
              >
                • Run research task
              </button>
              <button 
                onClick={() => handleSendMessage("Create new project")}
                className="w-full text-left text-sm text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-slate-700/50"
              >
                • Create new project
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-white">Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto space-y-2">
            {chatHistory.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="font-semibold text-purple-400">{msg.sender}:</span>
                <span className="text-white ml-2">{msg.text}</span>
                <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
