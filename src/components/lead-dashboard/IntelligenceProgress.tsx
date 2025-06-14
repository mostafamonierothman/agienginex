
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface IntelligenceProgressProps {
  intelligenceLevel: number;
}

const IntelligenceProgress = ({ intelligenceLevel }: IntelligenceProgressProps) => {
  return (
    <Card className="bg-slate-800/60 border-slate-600/50 shadow-xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
          <Brain className="text-pink-400 w-5 h-5 md:w-6 md:h-6" />
          AGI Intelligence Level & Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-200 font-medium">Intelligence Level: {intelligenceLevel.toFixed(1)}%</span>
          <span className="text-gray-200 font-medium">Target: Full AGI (100%)</span>
        </div>
        <div className="w-full bg-slate-700/60 rounded-full h-4 border border-slate-600/50">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500 shadow-inner"
            style={{ width: `${intelligenceLevel}%` }}
          />
        </div>
        <p className="text-green-300 text-sm md:text-base font-medium">🌱 Basic Intelligence - Learning patterns</p>
      </CardContent>
    </Card>
  );
};

export default IntelligenceProgress;
