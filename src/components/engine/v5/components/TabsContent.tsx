
import React from 'react';
import { TabsContent as ShadcnTabsContent } from '@/components/ui/tabs';
import { tabsConfig } from '../config/tabsConfig';

const TabsContent = () => {
  return (
    <>
      {tabsConfig.map((tab) => {
        const Component = tab.component;
        return (
          <ShadcnTabsContent key={tab.id} value={tab.id} className="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <Component />
          </ShadcnTabsContent>
        );
      })}
    </>
  );
};

export default TabsContent;
