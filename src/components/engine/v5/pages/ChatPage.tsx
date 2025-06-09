
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background p-2 md:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <ChatInterface className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]" />
      </div>
    </div>
  );
};

export default ChatPage;
