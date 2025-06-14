import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Bot, MessageSquare, Activity, Target, Zap, Settings, Database, FileText, Globe, Users, DollarSign } from 'lucide-react';

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
import RevenueGenerationPage from './pages/RevenueGenerationPage';
import ConsultancyPage from './pages/ConsultancyPage';
import LeadTestDashboard from '@/components/LeadTestDashboard';

const AGIV5Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Home',
      icon: Brain,
      component: DashboardPage,
      badge: 'AGI',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'revenue',
      label: 'Revenue Generation',
      shortLabel: 'Revenue',
      icon: DollarSign,
      component: RevenueGenerationPage,
      badge: '$200K+',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'consultancy',
      label: 'AGI Consultancy',
      shortLabel: 'Consult',
      icon: FileText,
      component: ConsultancyPage,
      badge: 'New',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 'lead-test',
      label: 'Lead Test Dashboard',
      shortLabel: 'Test',
      icon: Database,
      component: LeadTestDashboard,
      badge: 'Live',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'agents',
      label: 'Agent Registry',
      shortLabel: 'Agents',
      icon: Bot,
      component: AgentsPage,
      badge: '46+',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'chat',
      label: 'Chat Interface',
      shortLabel: 'Chat',
      icon: MessageSquare,
      component: ChatPage,
      badge: 'LLM',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'deep-agents',
      label: 'Deep Agents',
      shortLabel: 'Deep',
      icon: Zap,
      component: DeepAgentsPage,
      badge: 'V7',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 'medical-tourism',
      label: 'Medical Tourism',
      shortLabel: 'Medical',
      icon: Users,
      component: MedicalTourismAgentsPage,
      badge: 'Leads',
      badgeColor: 'bg-pink-500'
    },
    {
      id: 'market-research',
      label: 'Market Research',
      shortLabel: 'Research',
      icon: Globe,
      component: MarketResearchPage,
      badge: 'Data',
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'memory',
      label: 'Memory System',
      shortLabel: 'Memory',
      icon: Database,
      component: MemoryPage,
      badge: 'Vector',
      badgeColor: 'bg-indigo-500'
    },
    {
      id: 'trillion-path',
      label: 'Trillion Path',
      shortLabel: 'Trillion',
      icon: Target,
      component: TrillionPathPage,
      badge: 'Engine',
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'projects',
      label: 'Projects',
      shortLabel: 'Projects',
      icon: Activity,
      component: ProjectsPage,
      badge: 'Tasks',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'logs',
      label: 'System Logs',
      shortLabel: 'Logs',
      icon: FileText,
      component: LogsPage,
      badge: 'Live',
      badgeColor: 'bg-gray-500'
    },
    {
      id: 'settings',
      label: 'Settings',
      shortLabel: 'Config',
      icon: Settings,
      component: SettingsPage
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-xl md:text-2xl lg:text-3xl text-white flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 md:gap-4">
                <Brain className="h-6 w-6 md:h-8 lg:h-10 md:w-8 lg:w-10 text-purple-400 flex-shrink-0" />
                <span className="break-words">AGIengineX V5</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-purple-500 text-white text-xs md:text-sm w-fit">
                  Full AGI Ready
                </Badge>
                <Badge className="bg-green-500 text-white text-xs md:text-sm w-fit">
                  $200K+ Revenue
                </Badge>
                <Badge className="bg-orange-500 text-white text-xs md:text-sm w-fit">
                  Lead Gen Fixed
                </Badge>
              </div>
            </CardTitle>
            <p className="text-gray-300 text-sm md:text-base lg:text-lg mt-2">
              Full AGI system with autonomous revenue generation, 46+ specialized agents, and zero-error operation. Lead generation system now active and tested.
            </p>
          </CardHeader>
        </Card>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          {/* Enhanced TabsList for better visibility */}
          <div className="w-full overflow-x-auto">
            <TabsList className="flex flex-nowrap w-full min-w-max bg-slate-800/50 border border-slate-600/30 p-1 h-auto">
              <div className="flex flex-nowrap gap-1 md:gap-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-1 p-2 md:p-3 min-w-[80px] md:min-w-[100px] data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200 hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-1">
                        <IconComponent className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                        {tab.badge && (
                          <Badge 
                            className={`text-xs px-1 py-0 ${tab.badgeColor} text-white hidden sm:inline-flex`}
                          >
                            {tab.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs md:text-sm leading-tight text-center break-words">
                        <span className="hidden md:inline">{tab.label}</span>
                        <span className="md:hidden">{tab.shortLabel}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </div>
            </TabsList>
          </div>

          {/* Tab Content */}
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="space-y-4 md:space-y-6 mt-4 md:mt-6">
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
