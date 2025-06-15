
import React, { useEffect, useState } from 'react';
import AGIChatInterface from './AGIChatInterface';
import AGISystemControls from './AGISystemControls';
import DynamicAgentRunner from './multi-agent/DynamicAgentRunner';
import LiveBackendData from './multi-agent/LiveBackendData';
import LovableAGIStatus from './LovableAGIStatus';
import AGIPhase1Dashboard from './AGIPhase1Dashboard';
import OptimizationDashboard from './OptimizationDashboard';
import SelfModifyingMasterDashboard from './SelfModifyingMasterDashboard';
import { useBackendPolling } from '@/hooks/useBackendPolling';
import { pollBackendAGIState } from '@/services/AGIengineXService';
import { SystemExecutionPanel } from './SystemExecutionPanel';

const AGIDashboard = () => {
  const { backendData, isConnected, isPolling, refreshData } = useBackendPolling(true, 2000);
  const [activeTab, setActiveTab] = useState<'main' | 'self-modify' | 'optimization'>('self-modify');

  // Real-Time AGI polling (backend)
  const [backendAGIState, setBackendAGIState] = useState<any>(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const state = await pollBackendAGIState();
        setBackendAGIState(state);
      } catch (e) {
        // Optionally handle error state
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧬 AGIengineX - Self-Evolving System</h2>
        <p className="text-gray-400">Advanced AI Agent System with Self-Modifying Code Generation Capabilities</p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setActiveTab('self-modify')}
            className={`px-4 py-2 rounded ${activeTab === 'self-modify' 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            🧬 Self-Modifying AGI (All 5 Phases)
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded ${activeTab === 'main' 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Main Dashboard
          </button>
          <button
            onClick={() => setActiveTab('optimization')}
            className={`px-4 py-2 rounded ${activeTab === 'optimization' 
              ? 'bg-purple-600 text-white' 
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            Optimization Plan
          </button>
        </div>
      </div>

      {activeTab === 'self-modify' && <SelfModifyingMasterDashboard />}

      {activeTab === 'main' && (
        <>
          {/* New System Execution Panel */}
          <SystemExecutionPanel />

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

          {/* Example: Display backend AGI sync info */}
          {backendAGIState && (
            <div className="bg-slate-800/60 p-4 rounded mt-2 border border-slate-700 text-sm text-white">
              <div>
                <strong>Backend AGI (Real-Time Sync):</strong>
                <pre className="text-xs overflow-auto max-h-52 mt-2 bg-black/30 p-2 rounded">{JSON.stringify(backendAGIState, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'optimization' && <OptimizationDashboard />}
    </div>
  );
};

export default AGIDashboard;
