
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Zap, Target, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ChatProcessorAgentRunner } from '@/server/agents/ChatProcessorAgent';
import { ExecutionAgentRunner } from '@/agents/ExecutionAgent';
import { MedicalTourismResearchAgentRunner } from '@/agents/MedicalTourismResearchAgent';
import { trillionPathEngine } from '@/engine/TrillionPathEngine';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: string;
    revenue?: number;
    success?: boolean;
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
      content: '🚀 AGI Executive Assistant Ready! I can help you execute real business tasks to reach the trillion-dollar goal. Try: "Find medical tourism opportunities" or "Create a landing page" or "Send cold emails to prospects"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const executeBusinessTask = async (task: string): Promise<{success: boolean, result: string, revenue?: number}> => {
    try {
      // Determine which agent to use based on task content
      if (task.toLowerCase().includes('medical') || task.toLowerCase().includes('tourism') || task.toLowerCase().includes('research')) {
        const result = await MedicalTourismResearchAgentRunner({
          input: { query: task, mode: 'execution' },
          user_id: 'chat_user'
        });
        return {
          success: result.success,
          result: result.message,
          revenue: result.data?.revenue || 0
        };
      } else if (task.toLowerCase().includes('execute') || task.toLowerCase().includes('create') || task.toLowerCase().includes('launch')) {
        const result = await ExecutionAgentRunner({
          input: { task, mode: 'real_execution' },
          user_id: 'chat_user'
        });
        return {
          success: result.success,
          result: result.message,
          revenue: result.data?.revenueGenerated || 0
        };
      } else {
        // Use chat processor for general conversation
        const result = await ChatProcessorAgentRunner({
          input: { message: task },
          user_id: 'chat_user'
        });
        return {
          success: result.success,
          result: result.message
        };
      }
    } catch (error) {
      return {
        success: false,
        result: `Error executing task: ${error instanceof Error ? error.message : 'Unknown error'}`
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
      // Check if this is a business task or general conversation
      const isBusinessTask = inputValue.toLowerCase().includes('execute') || 
                           inputValue.toLowerCase().includes('create') || 
                           inputValue.toLowerCase().includes('find') ||
                           inputValue.toLowerCase().includes('send') ||
                           inputValue.toLowerCase().includes('launch') ||
                           inputValue.toLowerCase().includes('research');

      const result = await executeBusinessTask(inputValue.trim());

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.result,
        timestamp: new Date(),
        metadata: {
          action: isBusinessTask ? 'business_execution' : 'conversation',
          revenue: result.revenue || 0,
          success: result.success
        }
      };

      setMessages(prev => [...prev, aiMessage]);

      // Show toast for successful business actions with revenue
      if (result.success && result.revenue && result.revenue > 0) {
        toast({
          title: "💰 Revenue Generated!",
          description: `Task completed successfully: +$${result.revenue.toLocaleString()}`,
        });
      } else if (result.success && isBusinessTask) {
        toast({
          title: "✅ Task Completed",
          description: "Business action executed successfully",
        });
      }

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    "Find medical tourism market opportunities",
    "Create consultation booking landing page", 
    "Send outreach emails to potential clients",
    "Research Swedish healthcare market",
    "Launch AGI consultancy service"
  ];

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-sm md:text-lg">
          <Bot className="h-5 w-5 text-primary" />
          <span>AGI Executive Assistant</span>
          <span className="text-xs text-muted-foreground ml-auto">Real Task Execution</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-3 md:p-6 space-y-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
          <div className="space-y-3 pr-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type !== 'user' && (
                  <div className="flex-shrink-0">
                    {message.type === 'system' ? (
                      <Zap className="h-6 w-6 text-orange-400 mt-1" />
                    ) : (
                      <Bot className="h-6 w-6 text-primary mt-1" />
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : message.type === 'system'
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-800'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  
                  {message.metadata && (
                    <div className="mt-2 pt-2 border-t border-current/20 text-xs opacity-75">
                      <div className="flex items-center gap-2 flex-wrap">
                        {message.metadata.revenue && message.metadata.revenue > 0 && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            +${message.metadata.revenue.toLocaleString()}
                          </span>
                        )}
                        {message.metadata.action && (
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {message.metadata.action}
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
                    <span className="text-sm">Executing task...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Actions */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Quick Actions:</div>
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
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a business task or question... (e.g., 'Find medical tourism opportunities')"
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
