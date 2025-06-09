
import React from 'react';
import ChatInterface from '../components/ChatInterface';
import ExecutionLog from '../components/ExecutionLog';
import CRMDashboard from '../components/CRMDashboard';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-background p-2 md:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top row - Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="lg:col-span-2">
            <ChatInterface className="h-[calc(50vh-2rem)] md:h-[calc(50vh-2rem)] lg:h-[calc(60vh-3rem)]" />
          </div>
          <div className="lg:col-span-1">
            <ExecutionLog />
          </div>
        </div>
        
        {/* Bottom row - CRM Dashboard */}
        <div className="w-full">
          <CRMDashboard />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
