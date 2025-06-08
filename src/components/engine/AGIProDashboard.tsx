import React from 'react';
import EngineHeader from './EngineHeader';
import AGIV4Dashboard from './AGIV4Dashboard';
import AgentMarketplace from './AgentMarketplace';
import BackgroundLoopController from './BackgroundLoopController';
import AutonomousLoopController from './AutonomousLoopController';
import AgentAnalyticsDashboard from './AgentAnalyticsDashboard';
import EnterpriseAgentRegistry from './EnterpriseAgentRegistry';
import LLMConfiguration from './LLMConfiguration';
import ParallelFarmController from './ParallelFarmController';

const AGIProDashboard = () => {
  return (
    <div className="space-y-6">
      <EngineHeader title="AGI Pro Enterprise Platform" subtitle="V5+ Autonomous AGI System with Enterprise Features" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutonomousLoopController />
        <ParallelFarmController />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BackgroundLoopController />
        <LLMConfiguration />
      </div>
      
      <EnterpriseAgentRegistry />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AGIV4Dashboard />
        <AgentMarketplace />
      </div>

      <AgentAnalyticsDashboard />
    </div>
  );
};

export default AGIProDashboard;
