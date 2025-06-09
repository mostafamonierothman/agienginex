
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import ChatInterface from '../components/ChatInterface';
import { MessageSquare, Bot, User, Brain, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { agentChatBus } from '@/engine/AgentChatBus';

interface ChatMessage {
  sender: string;
  text: string;
  timestamp: string;
  isUser?: boolean;
}

interface MemoryEntry {
  agent_name: string;
  memory_value: string;
  timestamp: string;
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
      text: "All agents are online and ready for commands. Try asking about system status, improvements, or planning.", 
      timestamp: new Date().toISOString(),
      isUser: false
    }
  ]);

  const [systemMemory, setSystemMemory] = useState<MemoryEntry[]>([]);
  const [liveChatCount, setLiveChatCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const loadSystemMemory = async () => {
      try {
        const { data, error } = await supabase
          .from('agent_memory')
          .select('agent_name, memory_value, timestamp')
          .order('timestamp', { ascending: false })
          .limit(50);

        if (!error && data) {
          setSystemMemory(data);
        }
      } catch (error) {
        console.error('Failed to load system memory:', error);
      }
    };

    loadSystemMemory();

    // Subscribe to live chat bus updates
    const unsubscribe = agentChatBus.subscribe(() => {
      setLiveChatCount(agentChatBus.getMessages().length);
    });

    // Refresh memory every 10 seconds
    const memoryInterval = setInterval(loadSystemMemory, 10000);

    return () => {
      unsubscribe();
      clearInterval(memoryInterval);
    };
  }, []);

  const handleSendMessage = (message: string) => {
    const isUserMessage = message.startsWith('User:');
    const newMessage: ChatMessage = {
      sender: isUserMessage ? "User" : "AGI",
      text: message,
      timestamp: new Date().toISOString(),
      isUser: isUserMessage
    };

    setChatHistory(prev => [...prev, newMessage]);
    
    // Refresh system memory after new messages
    setTimeout(async () => {
      const { data } = await supabase
        .from('agent_memory')
        .select('agent_name, memory_value, timestamp')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) {
        setSystemMemory(data);
      }
    }, 1000);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Chat with AGI</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface - Takes 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <ChatInterface onSendMessage={handleSendMessage} />

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

        {/* System Memory Panel - Takes 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <Card className="bg-slate-800/50 border-slate-600/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                System Memory
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  {systemMemory.length} stored
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {liveChatCount} live
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {systemMemory.length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No memory yet. Agents will start building context as they run.</p>
                  </div>
                )}
                <div className="space-y-2">
                  {systemMemory.map((entry, idx) => (
                    <div key={idx} className="bg-slate-700/30 rounded p-2 border border-slate-600/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-3 w-3 text-blue-400" />
                        <span className="text-blue-400 font-medium text-sm">
                          {entry.agent_name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {entry.memory_value.length > 150 
                          ? `${entry.memory_value.substring(0, 150)}...` 
                          : entry.memory_value
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
