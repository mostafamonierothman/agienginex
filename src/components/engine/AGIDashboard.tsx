import React, { useEffect } from 'react';
import AGIChatInterface from './AGIChatInterface';
import AGISystemControls from './AGISystemControls';
import DynamicAgentRunner from './multi-agent/DynamicAgentRunner';
import LiveBackendData from './multi-agent/LiveBackendData';
import LovableAGIStatus from './LovableAGIStatus';
import AGIPhase1Dashboard from './AGIPhase1Dashboard';
import { useBackendPolling } from '@/hooks/useBackendPolling';

const AGIDashboard = () => {
  const { backendData, isConnected, isPolling, refreshData } = useBackendPolling(true, 2000);

  // --- REMOVE AUTOSTART useEffect ---
  // useEffect(() => {
  //   unifiedAGI.start();
  //   autonomousLoop.start();
  // }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGIengineX Full System</h2>
        <p className="text-gray-400">Complete AI Agent System with Phase 1 AGI Achievement</p>
      </div>

      {/* Phase 1 AGI Status - Top Priority */}
      <AGIPhase1Dashboard />

      {/* LovableAGIAgent Status - Core System */}
      <LovableAGIStatus />

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
