
import React, { useState } from 'react';
import { routeChatMessage } from '@/engine/routeChatMessage';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await routeChatMessage({
        input: { message: input, sessionId: 'user-session-1' }
      });

      const assistantMessage = {
        role: response.role || 'assistant',
        content: response.content || response.message || 'No response'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: 'Error reaching agent.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <div className="h-[400px] overflow-y-scroll border border-gray-300 p-3 mb-4 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="font-semibold">{msg.role}:</span> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message"
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
