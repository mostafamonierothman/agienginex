
import React, { useState } from 'react';
import { routeChatMessage } from '@/engine/routeChatMessage';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async (message: string) => {
    const res = await routeChatMessage(message);
    setMessages((prev) => [...prev, { role: 'assistant', content: res.content || 'No response' }]);
  };

  return <div>ChatInterface Component</div>;
};
