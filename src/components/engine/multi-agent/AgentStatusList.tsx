
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Agent } from '@/services/MultiAgentSupervisor';
import AgentStatusCard from './AgentStatusCard';

interface AgentStatusListProps {
  agents: Agent[];
}

const AgentStatusList = ({ agents }: AgentStatusListProps) => {
  if (agents.length === 0) return null;

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">🤖 Agent Status & Hybrid Coordination</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <AgentStatusCard key={agent.id} agent={agent} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentStatusList;
