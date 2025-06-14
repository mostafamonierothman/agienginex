
import React from 'react';

interface DashboardHeaderProps {
  intelligenceLevel: number;
  systemStatus: string;
}

const DashboardHeader = ({ intelligenceLevel, systemStatus }: DashboardHeaderProps) => {
  return (
    <div className="text-center space-y-4 mb-8">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
        Autonomous Artificial General Intelligence
      </h1>
      <p className="text-lg md:text-xl text-gray-200 font-medium">
        Self-healing and continuous learning system
      </p>
      
      {/* Status Badges */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <div className="bg-green-500/30 text-green-100 px-4 py-2 rounded-full border border-green-400/50 shadow-lg backdrop-blur-sm">
          <span className="font-semibold">✅ REAL AGI - Autonomous & Self-Improving</span>
        </div>
        <div className="bg-pink-500/30 text-pink-100 px-4 py-2 rounded-full border border-pink-400/50 shadow-lg backdrop-blur-sm">
          <span className="font-semibold">🧠 AGI ACTIVE - Learning & Evolving</span>
        </div>
      </div>

      {/* System Status */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
        <div className="bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-600/50">
          <span className="text-yellow-300 font-medium">System: </span>
          <span className="text-white">{systemStatus}</span>
        </div>
        <div className="bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-600/50">
          <span className="text-blue-300 font-medium">AGI: </span>
          <span className="text-white">autonomous</span>
        </div>
        <div className="bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-600/50">
          <span className="text-cyan-300 font-medium">Intelligence: </span>
          <span className="text-white">{intelligenceLevel.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
