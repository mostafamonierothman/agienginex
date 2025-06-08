import React from 'react';
import AGIV4Dashboard from '@/components/engine/v4/AGIV4Dashboard';

const AGIV4 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="container mx-auto max-w-7xl">
        <AGIV4Dashboard />
      </div>
    </div>
  );
};

export default AGIV4;
