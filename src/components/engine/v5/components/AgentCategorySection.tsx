
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target } from 'lucide-react';
import AgentCard from './AgentCard';

interface AgentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
}

interface AgentCategorySectionProps {
  category: string;
  agents: AgentInfo[];
  runningAgents: Set<string>;
  onRunAgent: (agentName: string) => Promise<void>;
  getCategoryColor: (category: string) => string;
}

const AgentCategorySection = ({ 
  category, 
  agents, 
  runningAgents, 
  onRunAgent, 
  getCategoryColor 
}: AgentCategorySectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          {category} Agents
          <Badge variant="outline" className={getCategoryColor(category)}>
            {Array.isArray(agents) ? agents.length : 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="grid gap-3">
            {Array.isArray(agents) && agents.map((agent) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                isRunning={runningAgents.has(agent.name)}
                onRun={onRunAgent}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AgentCategorySection;
