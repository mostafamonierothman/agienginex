
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, Database, Settings, Zap, Users, MessageSquare, ScrollText, HardDrive } from 'lucide-react';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import AgentsPage from './pages/AgentsPage';
import ChatPage from './pages/ChatPage';
import LogsPage from './pages/LogsPage';
import MemoryPage from './pages/MemoryPage';
import SettingsPage from './pages/SettingsPage';

const AGIV5Dashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-purple-400" />
            🚀 AGI V5 Operating System
          </CardTitle>
          <CardDescription className="text-gray-300">
            Complete AGI Operating System • 19+ Enhanced Agents • Full Project Management • Real-time Chat Interface
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7 bg-slate-800/50">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="memory" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Memory
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <DashboardPage />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectsPage />
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <AgentsPage />
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <ChatPage />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <LogsPage />
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <MemoryPage />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AGIV5Dashboard;
