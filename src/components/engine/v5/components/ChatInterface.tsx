
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Zap, Target, DollarSign, Settings, Brain } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ChatProcessorAgentRunner } from '@/server/agents/ChatProcessorAgent';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { MedicalTourismResearchAgentRunner } from '@/agents/MedicalTourismResearchAgent';
import { trillionPathEngine } from '@/engine/TrillionPathEngine';
import OpenAIKeyConfig from './OpenAIKeyConfig';
import { agentChatBus } from '@/engine/AgentChatBus';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: string;
    revenue?: number;
    success?: boolean;
    taskType?: string;
    learning?: boolean;
  };
}

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface = ({ className }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: '🚀 AGI Executive Assistant Ready! I execute REAL business tasks and learn from each interaction. Try: "Generate 50 agents to find medical tourism leads" or "Create landing page for AGI consultancy"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Listen for agent chat updates
    const unsubscribe = agentChatBus.subscribe((message) => {
      const isLearningMessage = message.message.includes('Chat Learning') || message.message.includes('Chat has learned');
      
      const systemMessage: ChatMessage = {
        id: `agent_${Date.now()}_${Math.random()}`,
        type: 'system',
        content: message.message,
        timestamp: new Date(),
        metadata: {
          learning: isLearningMessage
        }
      };

      setMessages(prev => [...prev, systemMessage]);
    });

    return unsubscribe;
  }, []);

  const executeBusinessTask = async (task: string): Promise<{success: boolean, result: string, revenue?: number, taskType?: string}> => {
    try {
      // Check if OpenAI is configured for AI responses
      const hasOpenAIKey = localStorage.getItem('openai_api_key');
      
      // Determine if this is a business execution task
      const isBusinessTask = task.toLowerCase().includes('execute') || 
                           task.toLowerCase().includes('create') || 
                           task.toLowerCase().includes('find') ||
                           task.toLowerCase().includes('generate') ||
                           task.toLowerCase().includes('send') ||
                           task.toLowerCase().includes('launch') ||
                           task.toLowerCase().includes('research') ||
                           task.toLowerCase().includes('agents') ||
                           task.toLowerCase().includes('leads');

      if (isBusinessTask) {
        // Execute real business task
        const result = await ExecutionAgentRunner({
          input: { task, mode: 'real_execution' },
          user_id: 'chat_user'
        });
        return {
          success: result.success,
          result: result.message,
          revenue: result.data?.revenueGenerated || 0,
          taskType: result.data?.taskType
        };
      } else if (hasOpenAIKey) {
        // Use AI chat processor for conversation
        const result = await ChatProcessorAgentRunner({
          input: { message: task },
          user_id: 'chat_user'
        });
        return {
          success: result.success,
          result: result.message
        };
      } else {
        return {
          success: false,
          result: 'Please configure your OpenAI API key in settings to enable AI chat, or ask me to execute a specific business task.'
        };
      }
    } catch (error) {
      return {
        success: false,
        result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await executeBusinessTask(inputValue.trim());

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.result,
        timestamp: new Date(),
        metadata: {
          action: result.taskType ? 'business_execution' : 'conversation',
          revenue: result.revenue || 0,
          success: result.success,
          taskType: result.taskType
        }
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show toast for successful business actions with revenue
      if (result.success && result.revenue && result.revenue > 0) {
        toast({
          title: "💰 Real Revenue Generated!",
          description: `Task completed: +$${result.revenue.toLocaleString()} in business value`,
        });
      } else if (result.success && result.taskType) {
        toast({
          title: "✅ Real Business Task Executed",
          description: "Check execution log for actionable next steps",
        });
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        metadata: {
          success: false
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedActions = [
    "Generate 50 agents for medical tourism leads",
    "Send emails to first 50 leads in database",
    "Create landing page for consultation booking", 
    "Research AI consultancy market opportunities",
    "Launch content marketing campaign"
  ];

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-lg">
            <Bot className="h-5 w-5 text-primary" />
            <span>AGI Executive Assistant</span>
            <span className="text-xs text-green-600 ml-2">REAL EXECUTION</span>
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-purple-400">LEARNING</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-3 md:p-6 space-y-4 min-h-0 overflow-hidden">
        {/* Settings Panel */}
        {showSettings && (
          <div className="flex-shrink-0">
            <OpenAIKeyConfig />
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="space-y-3 pr-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <div className="flex-shrink-0">
                      {message.type === 'system' ? (
                        message.metadata?.learning ? (
                          <Brain className="h-6 w-6 text-purple-400 mt-1" />
                        ) : (
                          <Zap className="h-6 w-6 text-orange-400 mt-1" />
                        )
                      ) : (
                        <Bot className="h-6 w-6 text-primary mt-1" />
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg text-sm break-words ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : message.type === 'system'
                        ? message.metadata?.learning
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</div>
                    
                    {message.metadata && (
                      <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-75">
                        <div className="flex items-center gap-2 flex-wrap">
                          {message.metadata.revenue && message.metadata.revenue > 0 && (
                            <span className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              +${message.metadata.revenue.toLocaleString()} REAL
                            </span>
                          )}
                          {message.metadata.taskType && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {message.metadata.taskType}
                            </span>
                          )}
                          {message.metadata.learning && (
                            <span className="flex items-center gap-1 text-purple-500">
                              <Brain className="h-3 w-3" />
                              Learning
                            </span>
                          )}
                          <span className="text-xs">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-primary mt-1" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <Bot className="h-6 w-6 text-primary mt-1" />
                  <div className="bg-muted text-foreground p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span className="text-sm">Executing real business task and learning...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-2 flex-shrink-0">
          <div className="text-xs text-muted-foreground">Real Business Tasks (AI learns from each execution):</div>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedAction(action)}
                className="text-xs h-auto py-1 px-2 text-left whitespace-normal"
                disabled={isLoading}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 flex-shrink-0">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to execute business tasks... I learn from each interaction!"
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
