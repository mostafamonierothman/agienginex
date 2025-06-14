
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import DashboardHeader from './components/DashboardHeader';
import TabsNavigation from './components/TabsNavigation';
import TabsContent from './components/TabsContent';

const AGIV5Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          {/* Enhanced TabsList with better responsive design */}
          <TabsNavigation activeTab={activeTab} />

          {/* Tab Content */}
          <TabsContent />
        </Tabs>
      </div>
    </div>
  );
};

export default AGIV5Dashboard;
