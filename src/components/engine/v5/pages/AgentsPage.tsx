
import React, { useState, useEffect } from 'react';
import { agentRegistry } from '@/config/AgentRegistry';
import { SupabaseMemoryService } from '@/services/SupabaseMemoryService';
import { toast } from '@/hooks/use-toast';
import AgentSystemOverview from '../components/AgentSystemOverview';
import AgentCategorySection from '../components/AgentCategorySection';

interface AgentInfo {
  name: string;
  description: string;
  category: string;
  version: string;
}

const AgentsPage = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [runningAgents, setRunningAgents] = useState(new Set());
  const [systemStats, setSystemStats] = useState(null);

  useEffect(() => {
    try {
      const allAgents = agentRegistry.getAllAgents();
      const stats = agentRegistry.getSystemStatus();
      // Ensure allAgents is an array
      const agentsArray = Array.isArray(allAgents) ? allAgents : [];
      setAgents(agentsArray);
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading agents:', error);
      setAgents([]); // Fallback to empty array
    }
  }, []);

  const runAgent = async (agentName: string) => {
    const agentKey = agentName.toLowerCase().replace(/\s+/g, '_');
    setRunningAgents(prev => new Set([...prev, agentName]));
    
    try {
      console.log(`🚀 Running agent: ${agentName} (${agentKey})`);
      
      const result = await agentRegistry.runAgent(agentKey, {
        input: { 
          trigger: 'manual_execution', 
          timestamp: new Date().toISOString(),
          source: 'agents_page'
        },
        user_id: 'dashboard_user'
      });

      console.log(`✅ Agent ${agentName} completed:`, result);
      
      // Save execution log
      await SupabaseMemoryService.saveExecutionLog(agentName, 'manual_run', result);
      
      toast({
        title: `✅ ${agentName} Completed`,
        description: result.message || 'Agent executed successfully',
      });

    } catch (error) {
      console.error(`❌ Agent ${agentName} failed:`, error);
      
      // Save error log
      await SupabaseMemoryService.saveExecutionLog(agentName, 'manual_run_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: `❌ ${agentName} Failed`,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setRunningAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentName);
        return newSet;
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Core': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Coordination': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Strategic': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Tool': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Enhanced': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'V7': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Emergency': 'bg-red-500/20 text-red-400 border-red-500/30',
      'AGO': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Ensure agents is always an array before using reduce
  const groupedAgents = Array.isArray(agents) ? agents.reduce((groups, agent) => {
    const category = agent.category || 'Uncategorized';
    if (!groups[category]) groups[category] = [];
    groups[category].push(agent);
    return groups;
  }, {} as Record<string, AgentInfo[]>) : {};

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <AgentSystemOverview 
        systemStats={systemStats}
        totalAgents={agents.length}
      />

      {/* Agent Categories */}
      <div className="grid gap-6">
        {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
          <AgentCategorySection
            key={category}
            category={category}
            agents={categoryAgents}
            runningAgents={runningAgents}
            onRunAgent={runAgent}
            getCategoryColor={getCategoryColor}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentsPage;
