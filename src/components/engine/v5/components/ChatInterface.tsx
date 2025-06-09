
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic } from 'lucide-react';
import { sendChatToAgent } from '@/services/EnhancedChatService';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
}

const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      setIsProcessing(true);
      
      try {
        console.log('[ChatInterface] Processing message:', message);
        
        // Send user message first
        onSendMessage(`User: ${message}`);
        
        // Send to enhanced chat service
        const result = await sendChatToAgent(message);
        
        if (result.success) {
          // Send the AI response with agent info
          const agentInfo = result.agent_used ? ` (${result.agent_used})` : '';
          onSendMessage(`AGI${agentInfo}: ${result.message}`);
        } else {
          onSendMessage(`Error: ${result.error || result.message || 'Agent execution failed'}`);
        }
        
      } catch (error) {
        console.error('[ChatInterface] Error processing message:', error);
        onSendMessage('AGI: Sorry, I encountered an error processing your message. The deep loop system is working to resolve any issues.');
      } finally {
        setIsProcessing(false);
        setMessage('');
      }
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardContent className="p-3 md:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isProcessing ? "AGI is processing..." : "Send a command to AGI..."}
            disabled={isProcessing}
            className="flex-1 bg-slate-700 border-slate-600 text-white h-11 md:h-10"
          />
          <div className="flex gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-slate-500 text-slate-200 hover:bg-slate-700 h-11 md:h-10 px-3 md:px-4"
              disabled={isProcessing}
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || !message.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 h-11 md:h-10 px-3 md:px-4"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
        {isProcessing && (
          <div className="mt-2 text-sm text-purple-400">
            🤖 AGI is processing your request via enhanced system...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
