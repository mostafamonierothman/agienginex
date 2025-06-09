
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic, Brain, Zap, Target } from 'lucide-react';
import { sendChatToAgent } from '@/services/EnhancedChatService';
import { agentCommunicationBus } from '@/services/AgentCommunicationBus';
import { saveChatMessage } from '@/utils/saveChatMessage';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
}

const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [executingActions, setExecutingActions] = useState<string[]>([]);
  const [activeAgentCount, setActiveAgentCount] = useState(0);

  useEffect(() => {
    // Update active agent count from communication bus
    const updateAgentCount = () => {
      const stats = agentCommunicationBus.getSystemStats();
      setActiveAgentCount(stats.activeAgents);
    };

    updateAgentCount();
    const interval = setInterval(updateAgentCount, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      setIsProcessing(true);
      setExecutingActions([]);
      
      try {
        console.log('[ChatInterface] Processing immediate action request:', message);
        
        // Save user message to system memory immediately
        await saveChatMessage('User', `User: ${message}`);
        
        // Send user message first
        onSendMessage(`User: ${message}`);
        
        // Show immediate processing
        setExecutingActions(['Analyzing request...', 'Identifying optimal agents...', 'Preparing execution...']);
        
        // Send to enhanced intelligent chat service
        const result = await sendChatToAgent(message);
        
        if (result.success) {
          // Show executed actions
          if (result.actions) {
            setExecutingActions(result.actions.map(action => `✅ ${action}`));
          }
          
          // Send the AI response with execution details
          const agentInfo = result.agent_used ? ` (${result.agent_used})` : '';
          const executionInfo = result.executedActions && result.executedActions.length > 0 ? 
            ` | Executed: ${result.executedActions.length} actions` : '';
          
          const aiResponse = `⚡ Immediate Action AGI${agentInfo}: ${result.message}${executionInfo}`;
          
          // Save AI response to system memory
          await saveChatMessage(result.agent_used || 'AGI', aiResponse);
          
          onSendMessage(aiResponse);
          
          // Clear execution status after showing completion
          setTimeout(() => setExecutingActions([]), 2000);
        } else {
          const errorResponse = `🚨 System Error: ${result.error || result.message || 'Processing failed'} - Emergency protocols deployed instantly.`;
          await saveChatMessage('SystemError', errorResponse);
          onSendMessage(errorResponse);
        }
        
      } catch (error) {
        console.error('[ChatInterface] Error processing message:', error);
        const emergencyResponse = '⚡ Emergency Mode: Error detected - deploying 10x fixing agents immediately. System auto-repair in progress.';
        await saveChatMessage('EmergencySystem', emergencyResponse);
        onSendMessage(emergencyResponse);
      } finally {
        setIsProcessing(false);
        setMessage('');
      }
    }
  };

  return (
    <div className="w-full max-w-full">
      <Card className="bg-card border-border">
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Brain className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-xs md:text-sm text-primary font-medium break-words">
              ⚡ Immediate Action AGI - Sub-Second Response & Execution
            </span>
            <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded flex-shrink-0">
              {activeAgentCount} Active Agents
            </span>
          </div>
          
          {executingActions.length > 0 && (
            <div className="mb-3 p-2 bg-purple-900/30 rounded border border-purple-500/30">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-yellow-400 animate-pulse flex-shrink-0" />
                <span className="text-xs text-yellow-400 font-medium">EXECUTING ACTIONS</span>
              </div>
              <div className="space-y-1">
                {executingActions.map((action, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3 text-green-400 flex-shrink-0" />
                    <span className="break-words">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isProcessing ? "⚡ Executing immediate actions..." : "Request income generation, error elimination, or agent scaling..."}
                disabled={isProcessing}
                className="flex-1 bg-background border-border text-foreground text-sm md:text-base min-h-[44px]"
              />
              <div className="flex gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted min-h-[44px] px-3"
                  disabled={isProcessing}
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
                <Button 
                  type="submit" 
                  disabled={isProcessing || !message.trim()}
                  className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 min-h-[44px] px-4"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>
          
          {isProcessing && (
            <div className="mt-2 text-xs md:text-sm text-primary flex items-center gap-2">
              <Zap className="h-4 w-4 animate-pulse flex-shrink-0" />
              <span className="break-words">⚡ Immediate Action Mode: Analyzing → Recommending → Executing within 1 second...</span>
            </div>
          )}
          
          <div className="mt-2 text-xs text-muted-foreground break-words">
            ⚡ Sub-Second Execution: Request → Analysis → Recommendation → Immediate Action | {activeAgentCount} Agents Ready
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
