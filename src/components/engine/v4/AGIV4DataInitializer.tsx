
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
  const [isLoading, setIsLoading] = useState(true);

  const checkExistingData = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Checking existing goals in database...');
      
      const { data: goals, error } = await supabase
        .from('agi_goals_enhanced')
        .select('goal_id')
        .limit(1);

      if (error) {
        console.error('Error checking existing data:', error);
        setHasGoals(false);
      } else {
        const hasData = (goals?.length || 0) > 0;
        console.log(`📊 Found ${goals?.length || 0} existing goals`);
        setHasGoals(hasData);
      }
    } catch (error) {
      console.error('Error checking existing data:', error);
      setHasGoals(false);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSystemData = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    console.log('🚀 Starting system initialization...');
    
    try {
      // Insert initial goals
      console.log('📝 Inserting initial goals...');
      const { data: insertedGoals, error: goalsError } = await supabase
        .from('agi_goals_enhanced')
        .insert(INITIAL_GOALS)
        .select();

      if (goalsError) {
        console.error('Error inserting goals:', goalsError);
        throw goalsError;
      }

      console.log('✅ Successfully inserted goals:', insertedGoals);

      // Log system initialization in supervisor queue
      console.log('📝 Logging system initialization...');
      const { error: logError } = await supabase
        .from('supervisor_queue')
        .insert({
          user_id: 'system_user',
          agent_name: 'system_initializer',
          action: 'initialize_system',
          input: JSON.stringify({ goals_count: INITIAL_GOALS.length }),
          status: 'completed',
          output: `System initialized with ${INITIAL_GOALS.length} goals`
        });

      if (logError) {
        console.error('Error logging initialization:', logError);
        // Don't throw here, initialization was successful
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
        description: `Failed to initialize system: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkExistingData();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border border-slate-600/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Checking System Status...
          </CardTitle>
          <CardDescription className="text-slate-300">
            Verifying AGI system initialization
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (hasGoals) {
    return (
      <Card className="bg-emerald-900/30 border border-emerald-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-300">
            <Database className="h-5 w-5" />
            System Ready
          </CardTitle>
          <CardDescription className="text-emerald-200">
            AGI goals and data structures are initialized and ready for autonomous operation
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
              Initializing System...
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
