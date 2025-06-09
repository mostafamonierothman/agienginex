
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import ExecutionLog from '../components/ExecutionLog';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background p-2 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <ChatInterface className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]" />
        </div>
        <div className="lg:col-span-1">
          <ExecutionLog />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
