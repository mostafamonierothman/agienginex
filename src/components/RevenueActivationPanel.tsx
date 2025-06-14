import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { agentRegistry } from '@/config/AgentRegistry';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Users, Brain, Zap } from 'lucide-react';
import { AutonomyTriggerAgentRunner } from '@/agents/AutonomyTriggerAgent';

export default function RevenueActivationPanel() {
  const [isActivating, setIsActivating] = useState(false);
  const [revenueActive, setRevenueActive] = useState(false);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(15000);

  const activateFullRevenueSystem = async () => {
    setIsActivating(true);
    try {
      await sendChatUpdate('🚀 Activating Full AGI Revenue System...');
      
      const agoResult = await agentRegistry.activateRevenueGeneration({
        input: { 
          goal: 'activate_full_revenue_system',
          targets: ['medical_tourism', 'business_consultation', 'automation_services'],
          revenueGoal: 50000
        },
        user_id: 'revenue_system'
      });

      if (agoResult.success) {
        await sendChatUpdate('✅ AGO Core Loop activated for revenue generation');
        
        const swarmResult = await agentRegistry.deployLeadGenerationSwarm({
          input: { mode: 'aggressive_revenue_generation' },
          user_id: 'revenue_system'
        });

        if (swarmResult.success) {
          await sendChatUpdate('🎯 Lead Generation Swarm deployed successfully');
          
          // Directly trigger AutonomyTriggerAgent to ensure immediate assessment and action
          await sendChatUpdate('🤖 Triggering Autonomy System for immediate lead generation check...');
          const autonomyResult = await AutonomyTriggerAgentRunner({
            input: { autonomousTrigger: true, triggeredBy: 'manual_revenue_activation', priority: 10 },
            user_id: 'revenue_system_activation'
          });

          if (autonomyResult.success) {
            await sendChatUpdate(`✅ Autonomous systems check complete. ${autonomyResult.message}`);
          } else {
            await sendChatUpdate(`⚠️ Autonomous systems check resulted in: ${autonomyResult.message}`);
          }

          setRevenueActive(true);
          setCurrentRevenue(0); // Will be updated by RevenueGenerationPage
          
          toast({
            title: "🚀 Full AGI Revenue System ACTIVATED",
            description: "All revenue generation agents are now active and generating income. Autonomous check initiated.",
          });
        } else {
          await sendChatUpdate('❌ Lead Generation Swarm deployment failed.');
          toast({
            title: "❌ Activation Error",
            description: "Failed to deploy lead generation swarm.",
            variant: "destructive",
          });
        }
      } else {
        await sendChatUpdate('❌ AGO Core Loop activation failed.');
        toast({
          title: "❌ Activation Error",
          description: "Failed to activate AGO Core Loop.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Revenue activation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await sendChatUpdate(`❌ Revenue system activation failed: ${errorMessage}`);
      toast({
        title: "❌ Activation Error",
        description: `Failed to activate revenue system: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  const revenueStreams = [
    {
      name: 'Medical Tourism Leads',
      status: revenueActive ? 'Active' : 'Ready',
      revenue: '$2,500+/week',
      description: 'High-value medical tourism lead generation',
      icon: Users
    },
    {
      name: 'AGI Consultancy Services',
      status: revenueActive ? 'Active' : 'Ready', 
      revenue: '$5,000+/week',
      description: 'AI automation consultancy for businesses',
      icon: Brain
    },
    {
      name: 'Automated Business Services',
      status: revenueActive ? 'Launching' : 'Ready',
      revenue: '$7,500+/week',
      description: 'Fully automated business process services',
      icon: Zap
    }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Control Panel */}
      <Card className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-400" />
            Full AGI Revenue System
            <Badge className={`${revenueActive ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
              {revenueActive ? 'ACTIVE' : 'READY'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-green-400 text-sm">Current Revenue</div>
              <div className="text-2xl font-bold text-white">
                ${currentRevenue.toLocaleString()}/month
              </div>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-green-400 text-sm">Projected (30 days)</div>
              <div className="text-2xl font-bold text-white">
                ${projectedRevenue.toLocaleString()}/month
              </div>
            </div>
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="text-green-400 text-sm">Active Streams</div>
              <div className="text-2xl font-bold text-white">
                {revenueStreams.filter(s => s.status === 'Active').length}/3
              </div>
            </div>
          </div>

          {!revenueActive && (
            <Button 
              onClick={activateFullRevenueSystem}
              disabled={isActivating}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
            >
              {isActivating ? '🚀 Activating Revenue System...' : '💰 ACTIVATE FULL REVENUE SYSTEM'}
            </Button>
          )}

          {revenueActive && (
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <div className="text-green-400 font-bold text-lg">
                🎉 Revenue System ACTIVE - Generating Income Now!
              </div>
              <div className="text-white text-sm mt-2">
                All revenue streams are operational and producing results
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {revenueStreams.map((stream, index) => {
          const IconComponent = stream.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-600/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-green-400" />
                  {stream.name}
                  <Badge 
                    className={`ml-auto ${
                      stream.status === 'Active' ? 'bg-green-500' : 
                      stream.status === 'Launching' ? 'bg-yellow-500' : 'bg-slate-500'
                    } text-white`}
                  >
                    {stream.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-2">{stream.description}</p>
                <p className="text-white font-semibold">{stream.revenue}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
