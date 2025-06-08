
import React from 'react';
import AGIChatInterface from './AGIChatInterface';
import AGISystemControls from './AGISystemControls';
import DynamicAgentRunner from './multi-agent/DynamicAgentRunner';
import LiveBackendData from './multi-agent/LiveBackendData';
import { useBackendPolling } from '@/hooks/useBackendPolling';

const AGIDashboard = () => {
  const { backendData, isConnected, isPolling, refreshData } = useBackendPolling();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGIengineX Full System</h2>
        <p className="text-gray-400">Complete AI Agent System with Chat, Controls, and Automation</p>
      </div>

      <AGISystemControls />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AGIChatInterface />
        <div className="space-y-6">
          <DynamicAgentRunner />
          <LiveBackendData 
            backendData={backendData}
            isConnected={isConnected}
            isPolling={isPolling}
            onRefresh={refreshData}
          />
        </div>
      </div>
    </div>
  );
};

export default AGIDashboard;
