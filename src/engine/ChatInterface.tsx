import React, { useState } from 'react';
import { routeChatMessage } from '@/engine/routeChatMessage';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const handleSend = async (message: string) => {
    const res = await routeChatMessage({ input: { message, sessionId: 'user1' } });
    setMessages((prev) => [...prev, { role: 'assistant', content: res.content || res.message }]);
  };

  return <div>ChatInterface Component</div>;
};
