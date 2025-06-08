
import React from 'react';
import AGIV4Controls from './AGIV4Controls';
import AgentMarketplace from './AgentMarketplace';
import BackgroundLoopController from './BackgroundLoopController';
import LiveBackendData from './multi-agent/LiveBackendData';
import { useBackendPolling } from '@/hooks/useBackendPolling';

const AGIProDashboard = () => {
  const { backendData, isConnected, isPolling, refreshData } = useBackendPolling(true, 3000);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🚀 AGI V4 Pro Platform</h2>
        <p className="text-gray-400">Enterprise-Level Multi-Agent System with Marketplace & Automation</p>
      </div>

      {/* Core V4 Controls */}
      <AGIV4Controls />

      {/* Pro Features Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Agent Marketplace */}
        <AgentMarketplace />
        
        {/* Background Loop Controller */}
        <BackgroundLoopController />
      </div>

      {/* Live Data & System Status */}
      <LiveBackendData 
        backendData={backendData}
        isConnected={isConnected}
        isPolling={isPolling}
        onRefresh={refreshData}
      />

      {/* Pro Features Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
          <div className="text-2xl font-bold text-green-400">✅</div>
          <div className="text-white text-sm mt-1">V4 Core</div>
          <div className="text-gray-400 text-xs">6 Agents Active</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
          <div className="text-2xl font-bold text-blue-400">🏪</div>
          <div className="text-white text-sm mt-1">Marketplace</div>
          <div className="text-gray-400 text-xs">Install/Uninstall</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
          <div className="text-2xl font-bold text-orange-400">🔄</div>
          <div className="text-white text-sm mt-1">Auto Loop</div>
          <div className="text-gray-400 text-xs">Background Exec</div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 text-center">
          <div className="text-2xl font-bold text-purple-400">🧠</div>
          <div className="text-white text-sm mt-1">OpenAI</div>
          <div className="text-gray-400 text-xs">Enhanced AI</div>
        </div>
      </div>
    </div>
  );
};

export default AGIProDashboard;
