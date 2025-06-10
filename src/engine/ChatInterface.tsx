import { routeChatMessage } from '@/engine/routeChatMessage';

const handleSend = async (message: string) => {
  const res = await routeChatMessage({ input: { message, sessionId: 'user1' } });
  setMessages((prev) => [...prev, { role: 'assistant', content: res.content }]);
};
