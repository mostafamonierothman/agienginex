
import React from 'react';
import AGIV4Dashboard from '@/components/engine/AGIV4Dashboard';
import AGIV4Controls from '@/components/engine/AGIV4Controls';

const AGIV4 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AGIV4Controls />
        <AGIV4Dashboard />
      </div>
    </div>
  );
};

export default AGIV4;
