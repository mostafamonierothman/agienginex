
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dna, Users, Brain, Zap, TrendingUp } from 'lucide-react';
import { EvolutionaryFactory } from '@/utils/evolutionary_factory';
import { agentCollaborate, formAgentTeam } from '@/utils/agent_collaboration';
import { DataFusionEngine } from '@/utils/data_fusion';
import { toast } from '@/hooks/use-toast';

const EvolutionDashboard = () => {
  const [generation, setGeneration] = useState(1);
  const [evolvedAgents, setEvolvedAgents] = useState<string[]>([]);
  const [collaborations, setCollaborations] = useState(0);
  const [dataFusions, setDataFusions] = useState(0);
  const [isEvolving, setIsEvolving] = useState(false);

  const spawnEvolvedAgent = async () => {
    try {
      setIsEvolving(true);
      const genome = EvolutionaryFactory.generateRandomGenome();
      const agentName = await EvolutionaryFactory.spawnEvolvedAgent(genome, generation);
      
      setEvolvedAgents(prev => [...prev, agentName]);
      setGeneration(prev => prev + 1);
      
      toast({
        title: "🧬 Agent Evolved",
        description: `${agentName} has been spawned with new genetic traits`,
      });
    } catch (error) {
      console.error('Failed to spawn evolved agent:', error);
    } finally {
      setIsEvolving(false);
    }
  };

  const triggerCollaboration = async () => {
    if (evolvedAgents.length < 2) {
      toast({
        title: "Need More Agents",
        description: "Spawn at least 2 agents for collaboration",
        variant: "destructive"
      });
      return;
    }

    try {
      const agent1 = evolvedAgents[0];
      const agent2 = evolvedAgents[1];
      
      await agentCollaborate(
        agent1,
        agent2,
        "Let's collaborate on optimizing system performance together"
      );
      
      setCollaborations(prev => prev + 1);
      
      toast({
        title: "🤝 Collaboration Started",
        description: `${agent1} is now working with ${agent2}`,
      });
    } catch (error) {
      console.error('Collaboration failed:', error);
    }
  };

  const triggerDataFusion = async () => {
    if (evolvedAgents.length === 0) {
      toast({
        title: "Need Agents",
        description: "Spawn agents first for data fusion",
        variant: "destructive"
      });
      return;
    }

    try {
      const targetAgent = evolvedAgents[0];
      await DataFusionEngine.fetchAndFuseWebData('https://api.example.com/trends', targetAgent);
      
      setDataFusions(prev => prev + 1);
      
      toast({
        title: "🔄 Data Fusion Complete",
        description: `External data has been fused into ${targetAgent}`,
      });
    } catch (error) {
      console.error('Data fusion failed:', error);
    }
  };

  const formTeam = async () => {
    if (evolvedAgents.length < 3) {
      toast({
        title: "Need More Agents",
        description: "Need at least 3 agents to form a team",
        variant: "destructive"
      });
      return;
    }

    try {
      const leader = evolvedAgents[0];
      const members = evolvedAgents.slice(1, 3);
      
      await formAgentTeam(leader, members, "Optimize system performance and identify new opportunities");
      
      toast({
        title: "👥 Team Formed",
        description: `${leader} is now leading a team of ${members.length} agents`,
      });
    } catch (error) {
      console.error('Team formation failed:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Dna className="h-6 w-6 text-purple-400" />
          🧬 AGI Evolution Dashboard
        </CardTitle>
        <CardDescription className="text-gray-300">
          Advanced agent evolution, collaboration, and data fusion
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Evolution Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Dna className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Generation</span>
            </div>
            <span className="text-white font-bold text-xl">{generation}</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Evolved Agents</span>
            </div>
            <span className="text-white font-bold text-xl">{evolvedAgents.length}</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-green-400" />
              <span className="text-gray-400 text-sm">Collaborations</span>
            </div>
            <span className="text-white font-bold text-xl">{collaborations}</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Data Fusions</span>
            </div>
            <span className="text-white font-bold text-xl">{dataFusions}</span>
          </div>
        </div>

        {/* Evolution Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Button
            onClick={spawnEvolvedAgent}
            disabled={isEvolving}
            className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
          >
            <Dna className="h-4 w-4 mr-2" />
            {isEvolving ? 'Evolving...' : 'Spawn Evolution'}
          </Button>
          
          <Button
            onClick={triggerCollaboration}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Start Collaboration
          </Button>
          
          <Button
            onClick={triggerDataFusion}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Fuse External Data
          </Button>
          
          <Button
            onClick={formTeam}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Form Agent Team
          </Button>
        </div>

        {/* Evolved Agents List */}
        {evolvedAgents.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">🧬 Evolved Agents ({evolvedAgents.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {evolvedAgents.map((agent, index) => (
                <div key={index} className="bg-black/30 p-3 rounded-lg border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{agent}</span>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Gen {Math.floor(index / 3) + 1}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">Evolved Agent</div>
                  <Progress value={85 + Math.random() * 15} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evolution Status */}
        <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-400">
            <Dna className="h-4 w-4 animate-pulse" />
            <span className="font-medium">AGI Evolution Engine Active</span>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Agents are evolving through genetic algorithms, forming collaborations, and learning from external data sources.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolutionDashboard;
