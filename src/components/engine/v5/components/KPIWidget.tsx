
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface KPIWidgetProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const KPIWidget = ({ label, value, icon, color = 'blue' }: KPIWidgetProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-400 border-green-400';
      case 'blue': return 'text-blue-400 border-blue-400';
      case 'purple': return 'text-purple-400 border-purple-400';
      case 'cyan': return 'text-cyan-400 border-cyan-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-gray-400 text-xs md:text-sm truncate">{label}</div>
            <div className={`text-lg md:text-2xl font-bold ${getColorClasses(color)} truncate`}>
              {value}
            </div>
          </div>
          {icon && (
            <div className={`${getColorClasses(color)} ml-2 flex-shrink-0`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIWidget;
