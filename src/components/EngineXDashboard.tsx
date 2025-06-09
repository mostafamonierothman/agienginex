
import React from 'react';
import EngineHeader from './engine/EngineHeader';
import DashboardTabs from './dashboard/DashboardTabs';
import { useEngineXState } from '@/hooks/useEngineXState';

const EngineXDashboard = () => {
  const {
    engineState,
    apiUrl,
    setApiUrl,
    apiKey,
    setApiKey,
    taskName,
    setTaskName,
    isConnected,
    lastUpdate,
    triggerTask
  } = useEngineXState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <EngineHeader 
          isConnected={isConnected}
          apiKey={apiKey}
          lastUpdate={lastUpdate}
        />

        <DashboardTabs />
      </div>
    </div>
  );
};

export default EngineXDashboard;
