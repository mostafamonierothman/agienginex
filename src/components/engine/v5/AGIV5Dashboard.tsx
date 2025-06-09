
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, MessageCircle, Database, Users, BarChart3, Settings, Logs, Target, Eye, Heart } from 'lucide-react';

// Import pages
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import MemoryPage from './pages/MemoryPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import MedicalTourismAgentsPage from './pages/MedicalTourismAgentsPage';

const AGIV5Dashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, component: ChatPage },
    { id: 'medical-agents', label: 'Medical Tourism', icon: Eye, component: MedicalTourismAgentsPage },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, component: DashboardPage },
    { id: 'agents', label: 'Agents', icon: Users, component: AgentsPage },
    { id: 'memory', label: 'Memory', icon: Database, component: MemoryPage },
    { id: 'logs', label: 'Logs', icon: Logs, component: LogsPage },
    { id: 'settings', label: 'Settings', icon: Settings, component: SettingsPage },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ChatPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <Card className="bg-slate-800/50 border-slate-600/30 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-600/30 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl md:text-2xl">AGI V7 Executive Assistant</CardTitle>
                  <p className="text-gray-300 text-sm">Advanced autonomous intelligence with real business execution</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">ONLINE</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-slate-700/50 border-b border-slate-600/30 rounded-none justify-start overflow-x-auto">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-slate-600/50 whitespace-nowrap"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="p-4 md:p-6">
                    <tab.component />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AGIV5Dashboard;
