
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Activity, 
  Settings, 
  Users, 
  MessageSquare, 
  Database,
  BarChart3,
  FileText,
  Bot,
  Zap,
  Target
} from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import AgentsPage from './pages/AgentsPage';
import ProjectsPage from './pages/ProjectsPage';
import MemoryPage from './pages/MemoryPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import DeepAgentsPage from './pages/DeepAgentsPage';

const AGIV5Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AGI Operating System</h1>
              <p className="text-gray-400">Advanced General Intelligence Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              22 Agents Active
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/10">
              <Zap className="w-3 h-3 mr-1" />
              V7.5 Enhanced
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-slate-800/50 p-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Agents</span>
            </TabsTrigger>
            <TabsTrigger value="deep-agents" className="flex items-center gap-2 text-sm">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Deep</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Memory</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardPage />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatPage />
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <AgentsPage />
          </TabsContent>

          <TabsContent value="deep-agents" className="mt-6">
            <DeepAgentsPage />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsPage />
          </TabsContent>

          <TabsContent value="memory" className="mt-6">
            <MemoryPage />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <LogsPage />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AGIV5Dashboard;
