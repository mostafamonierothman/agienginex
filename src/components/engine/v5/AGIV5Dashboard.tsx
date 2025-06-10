
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Bot, MessageSquare, Activity, Target, Zap, Settings, Database, FileText, Globe, Users } from 'lucide-react';

// Import all page components
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import ChatPage from './pages/ChatPage';
import MemoryPage from './pages/MemoryPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import TrillionPathPage from './pages/TrillionPathPage';
import DeepAgentsPage from './pages/DeepAgentsPage';
import MedicalTourismAgentsPage from './pages/MedicalTourismAgentsPage';
import MarketResearchPage from './pages/MarketResearchPage';
import ProjectsPage from './pages/ProjectsPage';

const AGIV5Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'AGI Dashboard',
      icon: Brain,
      component: DashboardPage,
      badge: 'AGO',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'agents',
      label: 'Agent Registry',
      icon: Bot,
      component: AgentsPage,
      badge: '46+',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'chat',
      label: 'Chat Interface',
      icon: MessageSquare,
      component: ChatPage,
      badge: 'LLM',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'deep-agents',
      label: 'Deep Agents',
      icon: Zap,
      component: DeepAgentsPage,
      badge: 'V7',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 'medical-tourism',
      label: 'Medical Tourism',
      icon: Users,
      component: MedicalTourismAgentsPage,
      badge: 'Leads',
      badgeColor: 'bg-pink-500'
    },
    {
      id: 'market-research',
      label: 'Market Research',
      icon: Globe,
      component: MarketResearchPage,
      badge: 'Research',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'memory',
      label: 'Memory System',
      icon: Database,
      component: MemoryPage,
      badge: 'Vector',
      badgeColor: 'bg-indigo-500'
    },
    {
      id: 'trillion-path',
      label: 'Trillion Path',
      icon: Target,
      component: TrillionPathPage,
      badge: 'Engine',
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Activity,
      component: ProjectsPage,
      badge: 'Tasks',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'logs',
      label: 'System Logs',
      icon: FileText,
      component: LogsPage,
      badge: 'Live',
      badgeColor: 'bg-gray-500'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: SettingsPage
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-white flex items-center gap-4">
              <Brain className="h-10 w-10 text-purple-400" />
              AGIengineX V5 Dashboard
              <Badge className="bg-purple-500 text-white">
                Advanced AGI Operations
              </Badge>
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Complete AGI system with 46+ specialized agents, autonomous loops, memory systems, and real-world integrations
            </p>
          </CardHeader>
        </Card>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full bg-slate-800/50 border border-slate-600/30">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">{tab.label.split(' ')[0]}</span>
                  {tab.badge && (
                    <Badge 
                      className={`text-xs px-1 py-0 ${tab.badgeColor} text-white`}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default AGIV5Dashboard;
