'use client';

import React, { useState, useRef, useEffect } from 'react';
import { routeChatMessage } from '@/engine/routeChatMessage';

type ChatMessage = {
  role: string;
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await routeChatMessage({
        input: { message: input, sessionId: 'user-session-1' }
      });

      const assistantMessage = {
        role: response.role || 'assistant',
        content: response.content || 'No response'
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: '⚠️ Failed to reach agent.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg shadow-md h-[85vh] flex flex-col">
      <h2 className="text-xl font-bold mb-2">💬 Talk to AGIengineX</h2>

      <div className="flex-1 overflow-y-auto bg-gray-50 border rounded p-3 mb-3 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="font-medium">{msg.role}:</span> {msg.content}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
