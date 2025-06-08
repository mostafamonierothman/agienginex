
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm">{label}</div>
            <div className={`text-2xl font-bold ${getColorClasses(color)}`}>{value}</div>
          </div>
          {icon && (
            <div className={`${getColorClasses(color)}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIWidget;
