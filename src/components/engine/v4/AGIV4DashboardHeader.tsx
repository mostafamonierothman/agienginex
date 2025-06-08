
import React from 'react';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AGIV4DashboardHeaderProps {
  agentCount: number;
}

const AGIV4DashboardHeader = ({ agentCount }: AGIV4DashboardHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-white text-xl">
        <Brain className="h-6 w-6 text-cyan-400" />
        AGI V4 Autonomous System Dashboard
      </CardTitle>
      <CardDescription className="text-slate-300 text-base">
        Complete AGI V4 system with {agentCount} active agents running
      </CardDescription>
    </CardHeader>
  );
};

export default AGIV4DashboardHeader;
