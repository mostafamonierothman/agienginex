
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
import EvolutionDashboard from './EvolutionDashboard';
import HumanLoopDashboard from './HumanLoopDashboard';

const AGIProDashboard = () => {
  return (
    <div className="space-y-6">
      <EngineHeader title="AGI Pro Enterprise Platform V6.5+" subtitle="Next-Gen Autonomous AGI with Evolution, Collaboration & Human-in-the-Loop" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutonomousLoopController />
        <ParallelFarmController />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvolutionDashboard />
        <HumanLoopDashboard />
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
