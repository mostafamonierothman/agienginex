
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Play, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const INITIAL_GOALS = [
  {
    goal_text: 'Optimize cross-agent communication protocols for enhanced coordination',
    priority: 9,
    status: 'active'
  },
  {
    goal_text: 'Develop advanced learning mechanisms for autonomous knowledge acquisition',
    priority: 8,
    status: 'active'
  },
  {
    goal_text: 'Implement real-time performance monitoring and self-optimization',
    priority: 7,
    status: 'active'
  },
  {
    goal_text: 'Create adaptive decision-making frameworks for complex scenarios',
    priority: 8,
    status: 'active'
  },
  {
    goal_text: 'Establish efficient memory consolidation and retrieval systems',
    priority: 6,
    status: 'active'
  }
];

interface AGIV4DataInitializerProps {
  onDataInitialized: () => void;
}

const AGIV4DataInitializer = ({ onDataInitialized }: AGIV4DataInitializerProps) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasGoals, setHasGoals] = useState(false);

  const checkExistingData = async () => {
    try {
      const { data: goals } = await supabase
        .from('agi_goals_enhanced')
        .select('goal_id')
        .limit(1);

      setHasGoals((goals?.length || 0) > 0);
    } catch (error) {
      console.error('Error checking existing data:', error);
    }
  };

  const initializeSystemData = async () => {
    setIsInitializing(true);
    try {
      // Insert initial goals
      const { error: goalsError } = await supabase
        .from('agi_goals_enhanced')
        .insert(INITIAL_GOALS);

      if (goalsError) {
        throw goalsError;
      }

      toast({
        title: "🎯 System Initialized",
        description: `Added ${INITIAL_GOALS.length} initial goals for the AGI system`,
      });

      setHasGoals(true);
      onDataInitialized();
    } catch (error) {
      console.error('Error initializing system data:', error);
      toast({
        title: "Error",
        description: "Failed to initialize system data",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkExistingData();
  }, []);

  if (hasGoals) {
    return (
      <Card className="bg-emerald-900/30 border border-emerald-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-300">
            <Database className="h-5 w-5" />
            System Ready
          </CardTitle>
          <CardDescription className="text-emerald-200">
            AGI goals and data structures are initialized
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-900/30 border border-amber-500/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <Database className="h-5 w-5" />
          System Initialization Required
        </CardTitle>
        <CardDescription className="text-amber-200">
          Initialize the AGI system with starter goals and data structures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={initializeSystemData}
          disabled={isInitializing}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isInitializing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Initialize System
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AGIV4DataInitializer;
