
import React from 'react';
import AGIV5Dashboard from '@/components/engine/v5/AGIV5Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <AGIV5Dashboard />
      </div>
    </div>
  );
};

export default Index;
