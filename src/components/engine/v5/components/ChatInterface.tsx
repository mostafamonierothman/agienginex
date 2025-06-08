
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mic } from 'lucide-react';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
}

const ChatInterface = ({ onSendMessage }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardContent className="p-3 md:p-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a command to AGI V5..."
            className="flex-1 bg-slate-700 border-slate-600 text-white h-11 md:h-10"
          />
          <div className="flex gap-2 md:gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-slate-500 text-slate-200 hover:bg-slate-700 h-11 md:h-10 px-3 md:px-4"
            >
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 h-11 md:h-10 px-3 md:px-4"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
