
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { tabsConfig } from '../config/tabsConfig';

interface TabsNavigationProps {
  activeTab: string;
}

const TabsNavigation = ({ activeTab }: TabsNavigationProps) => {
  return (
    <div className="w-full overflow-x-auto bg-slate-800/50 border border-slate-600/30 rounded-lg p-2">
      <TabsList className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-1 bg-transparent w-full h-auto">
        {tabsConfig.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center justify-center gap-1 p-2 md:p-3 min-h-[80px] md:min-h-[100px] data-[state=active]:bg-purple-600 data-[state=active]:text-white transition-all duration-200 hover:bg-slate-700 text-center relative"
            >
              <div className="flex flex-col items-center gap-1">
                <IconComponent className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                {tab.badge && (
                  <Badge 
                    className={`text-xs px-1 py-0 ${tab.badgeColor} text-white`}
                  >
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs leading-tight text-center break-words max-w-full">
                <span className="hidden lg:inline">{tab.label}</span>
                <span className="lg:hidden">{tab.shortLabel}</span>
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </div>
  );
};

export default TabsNavigation;
