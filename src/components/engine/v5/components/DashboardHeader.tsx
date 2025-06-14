
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

const DashboardHeader = () => {
  return (
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
  );
};

export default DashboardHeader;
