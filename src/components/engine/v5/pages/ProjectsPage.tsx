
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, Target } from 'lucide-react';

const ProjectsPage = () => {
  const [projects] = useState([
    {
      name: "Medical AI Research",
      status: "Running",
      progress: 95,
      kpis: "95% Complete",
      activeAgents: ["ResearchAgent", "OpportunityAgent", "SecurityAgent"],
      description: "Advanced medical research using AI agents"
    },
    {
      name: "AGI V6 Development",
      status: "Planning",
      progress: 15,
      kpis: "15% Complete",
      activeAgents: ["MetaAgent", "GoalAgent", "CreativityAgent"],
      description: "Next generation AGI system development"
    },
    {
      name: "Financial Market Analysis",
      status: "Active",
      progress: 78,
      kpis: "78% Complete",
      activeAgents: ["APIConnectorAgent", "StrategicAgent", "LearningAgentV2"],
      description: "Real-time financial market analysis and prediction"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-green-500';
      case 'Active': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <Badge variant="outline" className="text-blue-400 border-blue-400">
          {projects.length} Active Projects
        </Badge>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-600/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  {project.name}
                </CardTitle>
                <Badge className={`${getStatusColor(project.status)} text-white`}>
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">{project.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">Active Agents:</span>
                <div className="flex flex-wrap gap-1">
                  {project.activeAgents.map((agent, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                      {agent}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">KPIs:</span>
                <span className="text-green-400">{project.kpis}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
