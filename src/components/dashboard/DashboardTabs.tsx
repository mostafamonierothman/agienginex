
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AGIDashboard from '@/components/engine/AGIDashboard';
import AGIV4Controls from '@/components/engine/AGIV4Controls';
import EnhancedAGIEngine from '@/components/engine/EnhancedAGIEngine';
import MultiAgentDashboard from '@/components/engine/MultiAgentDashboard';
import TrillionPathDashboard from '@/components/engine/TrillionPathDashboard';
import OpportunityDetectorDashboard from '@/components/engine/OpportunityDetectorDashboard';
import MarketResearchDashboard from '@/components/engine/MarketResearchDashboard';

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="market-research" className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-slate-800 border-slate-700">
        <TabsTrigger value="market-research" className="text-xs">Market Research</TabsTrigger>
        <TabsTrigger value="trillion-path" className="text-xs">Trillion Path</TabsTrigger>
        <TabsTrigger value="opportunities" className="text-xs">Opportunities</TabsTrigger>
        <TabsTrigger value="v4" className="text-xs">AGI V4</TabsTrigger>
        <TabsTrigger value="enhanced" className="text-xs">Enhanced</TabsTrigger>
        <TabsTrigger value="multi-agent" className="text-xs">Multi-Agent</TabsTrigger>
        <TabsTrigger value="classic" className="text-xs">Classic</TabsTrigger>
      </TabsList>
      
      <TabsContent value="market-research" className="mt-6">
        <MarketResearchDashboard />
      </TabsContent>
      
      <TabsContent value="trillion-path" className="mt-6">
        <TrillionPathDashboard />
      </TabsContent>
      
      <TabsContent value="opportunities" className="mt-6">
        <OpportunityDetectorDashboard />
      </TabsContent>
      
      <TabsContent value="v4" className="mt-6">
        <AGIV4Controls />
      </TabsContent>
      
      <TabsContent value="enhanced" className="mt-6">
        <EnhancedAGIEngine />
      </TabsContent>
      
      <TabsContent value="multi-agent" className="mt-6">
        <MultiAgentDashboard />
      </TabsContent>
      
      <TabsContent value="classic" className="mt-6">
        <AGIDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
