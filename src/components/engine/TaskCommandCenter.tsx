
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskCommandCenterProps {
  taskName: string;
  setTaskName: (name: string) => void;
  triggerTask: () => void;
}

const TaskCommandCenter = ({ taskName, setTaskName, triggerTask }: TaskCommandCenterProps) => {
  const quickActions = [
    { name: 'execute_best_action_now', label: 'Best Action Now' },
    { name: 'optimize_agent_scaling', label: 'Scale Agents' },
    { name: 'start_pipeline_optimizer_loop', label: 'Start Pipeline' },
    { name: 'push_leadgen_campaign', label: 'Push Leadgen' },
    { name: 'spawn_agents_main_medjourney', label: 'Spawn MedJourney' },
    { name: 'spawn_agents_geo_expansion', label: 'Spawn Geo' },
    { name: 'start_learning_loop', label: 'Start Learning' },
    { name: 'refresh_dashboard_stream', label: 'Refresh Dashboard' },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">⚡ Task Command Center</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter task name or select from quick actions below"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white flex-1"
            onKeyPress={(e) => e.key === 'Enter' && triggerTask()}
          />
          <Button 
            onClick={triggerTask}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Trigger Task
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
          {quickActions.map((action) => (
            <Button 
              key={action.name}
              variant="outline" 
              size="sm"
              onClick={() => setTaskName(action.name)}
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCommandCenter;
