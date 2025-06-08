
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            🚀 AGI V5 Operating System
          </CardTitle>
          <CardDescription className="text-gray-300 text-sm md:text-base">
            Complete AGI Operating System • 19+ Enhanced Agents • Full Project Management • Real-time Chat Interface
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <div className="w-full">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="inline-flex h-12 md:h-10 items-center justify-start w-max space-x-1 rounded-md bg-slate-800/50 p-1 text-muted-foreground md:grid md:w-full md:grid-cols-7">
              <TabsTrigger 
                value="dashboard" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <Activity className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Dash</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <Database className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Proj</span>
              </TabsTrigger>
              <TabsTrigger 
                value="agents"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <Users className="h-3 w-3 md:h-4 md:w-4" />
                <span>Agents</span>
              </TabsTrigger>
              <TabsTrigger 
                value="chat"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="logs"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <ScrollText className="h-3 w-3 md:h-4 md:w-4" />
                <span>Logs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="memory"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <HardDrive className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Memory</span>
                <span className="sm:hidden">Mem</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm min-w-[80px] md:min-w-0 gap-1 md:gap-2"
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Set</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

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
