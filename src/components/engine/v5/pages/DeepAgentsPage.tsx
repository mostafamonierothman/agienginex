
import React, { useState, useEffect } from 'react';
import { agentRegistry } from '@/config/AgentRegistry';
import AgentCard from '../components/AgentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Play, Users, RotateCcw, Square, Brain, Network, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
    startDeepAutonomousLoop, 
    stopDeepAutonomousLoop, 
    shouldAutoStartDeepLoop,
    getSystemMetrics,
    isDeepAutonomousLoopRunning
} from '@/engine/DeepAutonomousLoopController';

const DeepAgentsPage = () => {
    const [agents, setAgents] = useState([]);
    const [runningAgents, setRunningAgents] = useState(new Set());
    const [isDeepAutonomousRunning, setIsDeepAutonomousRunning] = useState(false);
    const [showCore, setShowCore] = useState(true);
    const [showEnhanced, setShowEnhanced] = useState(true);
    const [cycles, setCycles] = useState(0);
    const [logs, setLogs] = useState([]);
    const [systemMetrics, setSystemMetrics] = useState({
        handoffs: 0,
        collaborationChains: 0,
        systemHealth: 0,
        activeGoals: 0
    });

    useEffect(() => {
        const registeredAgents = agentRegistry.getAllAgents();
        const agentData = registeredAgents.map(agent => ({
            name: agent.name,
            status: runningAgents.has(agent.name) ? 'RUNNING' : 'IDLE',
            lastAction: 'Ready for deep collaboration',
            category: agent.category,
            description: agent.description,
            version: agent.version,
            runner: agent.runner
        }));
        setAgents(agentData);

        // Auto-start deep autonomous loop if it was previously running
        if (shouldAutoStartDeepLoop() && agentData.length > 0) {
            console.log('Auto-starting Deep Autonomous Loop...');
            setIsDeepAutonomousRunning(true);
            startDeepAutonomousLoop(
                null,
                agentData,
                setAgents,
                setLogs,
                (kpis) => {
                    setCycles(kpis.cycles);
                    setSystemMetrics({
                        handoffs: kpis.handoffs || 0,
                        collaborationChains: kpis.collaborationChains || 0,
                        systemHealth: kpis.systemHealth || 0,
                        activeGoals: kpis.activeGoals || 0
                    });
                },
                { loopDelayMs: 2000, maxCycles: 50000 }
            );
            toast({
                title: "🧠 Auto-Resumed Deep Autonomous Loop",
                description: "Advanced AGI system automatically resumed with collaboration",
            });
        }
    }, [runningAgents]);

    useEffect(() => {
        // Update system metrics periodically
        const metricsInterval = setInterval(() => {
            if (isDeepAutonomousRunning) {
                try {
                    const metrics = getSystemMetrics();
                    if (metrics) {
                        console.log('[DeepAgentsPage] System metrics:', metrics);
                    }
                } catch (error) {
                    console.log('[DeepAgentsPage] Metrics not available yet');
                }
            }
        }, 5000);

        return () => clearInterval(metricsInterval);
    }, [isDeepAutonomousRunning]);

    const handleRunAgent = async (agentName: string, params = {}) => {
        if (runningAgents.has(agentName)) return;

        setRunningAgents(prev => new Set(prev).add(agentName));

        try {
            const context = {
                input: {
                    ...params,
                    deepMode: true,
                    collaborationEnabled: true
                },
                user_id: 'deep_v5_interface',
                timestamp: new Date().toISOString()
            };

            const result = await agentRegistry.runAgent(agentName, context);
            
            setAgents(prev => prev.map(agent => 
                agent.name === agentName 
                    ? { ...agent, status: 'IDLE', lastAction: result.message || 'Deep task completed' }
                    : agent
            ));
            
            toast({
                title: `🧠 ${agentName} Executed (Deep Mode)`,
                description: result.message || `${agentName} completed with deep collaboration`,
            });
        } catch (error) {
            setAgents(prev => prev.map(agent => 
                agent.name === agentName 
                    ? { ...agent, status: 'ERROR', lastAction: `Error: ${error.message}` }
                    : agent
            ));
            
            toast({
                title: `❌ ${agentName} Failed`,
                description: error.message,
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

    const handleStartDeepAutonomousLoop = () => {
        setIsDeepAutonomousRunning(true);
        startDeepAutonomousLoop(
            null,
            agents,
            setAgents,
            setLogs,
            (kpis) => {
                setCycles(kpis.cycles);
                setSystemMetrics({
                    handoffs: kpis.handoffs || 0,
                    collaborationChains: kpis.collaborationChains || 0,
                    systemHealth: kpis.systemHealth || 0,
                    activeGoals: kpis.activeGoals || 0
                });
            },
            { loopDelayMs: 2000, maxCycles: 50000 }
        );
        toast({
            title: "🧠 Deep Autonomous Loop Started",
            description: "Advanced AGI with agent collaboration and self-optimization activated",
        });
    };

    const handleStopDeepAutonomousLoop = () => {
        setIsDeepAutonomousRunning(false);
        stopDeepAutonomousLoop();
        toast({
            title: "⏹️ Deep Autonomous Loop Stopped",
            description: "Advanced AGI system deactivated",
        });
    };

    const coreAgents = agents.filter(a => a.category === 'core');
    const enhancedAgents = agents.filter(a => a.category === 'enhanced');

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    <Brain className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
                    Deep AGI Agents
                </h1>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {coreAgents.length} Core
                    </Badge>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                        {enhancedAgents.length} Enhanced
                    </Badge>
                    {isDeepAutonomousRunning && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
                            Deep AGI • Cycle #{cycles}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Deep System Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-slate-800/50 border-slate-600/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Network className="h-4 w-4 text-green-400" />
                            <div className="text-sm text-gray-400">Agent Handoffs</div>
                        </div>
                        <div className="text-xl font-bold text-white">{systemMetrics.handoffs}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-600/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-400" />
                            <div className="text-sm text-gray-400">Collaboration Chains</div>
                        </div>
                        <div className="text-xl font-bold text-white">{systemMetrics.collaborationChains}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-600/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-400" />
                            <div className="text-sm text-gray-400">System Health</div>
                        </div>
                        <div className="text-xl font-bold text-white">{systemMetrics.systemHealth.toFixed(1)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-600/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-cyan-400" />
                            <div className="text-sm text-gray-400">Active Goals</div>
                        </div>
                        <div className="text-xl font-bold text-white">{systemMetrics.activeGoals}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Deep Control Panel */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {!isDeepAutonomousRunning ? (
                    <Button
                        onClick={handleStartDeepAutonomousLoop}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-11 md:h-10"
                    >
                        <Brain className="h-4 w-4 mr-2" />
                        Start Deep AGI Loop
                    </Button>
                ) : (
                    <Button
                        onClick={handleStopDeepAutonomousLoop}
                        className="bg-red-600 hover:bg-red-700 text-white h-11 md:h-10"
                    >
                        <Square className="h-4 w-4 mr-2" />
                        Stop Deep AGI Loop
                    </Button>
                )}
            </div>

            {/* Agent Display */}
            <div className="space-y-4 md:space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-purple-400">🧠 Enhanced Deep Agents</h2>
                        <Button
                            onClick={() => setShowEnhanced(!showEnhanced)}
                            variant="outline"
                            size="sm"
                            className="border-purple-400 text-purple-400 hover:bg-purple-400/20"
                        >
                            {showEnhanced ? 'Collapse' : 'Expand'}
                        </Button>
                    </div>
                    {showEnhanced && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {enhancedAgents.map((agent, index) => (
                                <AgentCard
                                    key={index}
                                    agentName={agent.name}
                                    status={agent.status}
                                    lastAction={agent.lastAction}
                                    description={`${agent.description} • Deep collaboration enabled`}
                                    version={agent.version}
                                    category={agent.category}
                                    onRunAgent={handleRunAgent}
                                    isRunning={runningAgents.has(agent.name)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-blue-400">⚙️ Core Deep Agents</h2>
                        <Button
                            onClick={() => setShowCore(!showCore)}
                            variant="outline"
                            size="sm"
                            className="border-blue-400 text-blue-400 hover:bg-blue-400/20"
                        >
                            {showCore ? 'Collapse' : 'Expand'}
                        </Button>
                    </div>
                    {showCore && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            {coreAgents.map((agent, index) => (
                                <AgentCard
                                    key={index}
                                    agentName={agent.name}
                                    status={agent.status}
                                    lastAction={agent.lastAction}
                                    description={`${agent.description} • Core AGI functionality`}
                                    version={agent.version}
                                    category={agent.category}
                                    onRunAgent={handleRunAgent}
                                    isRunning={runningAgents.has(agent.name)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Deep System Status */}
            {isDeepAutonomousRunning && (
                <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-400" />
                            Deep AGI System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-yellow-400 animate-pulse">
                            🧠 Advanced AGI operating with deep agent collaboration, self-optimization, and goal-driven behavior...
                        </div>
                        <div className="mt-4 text-sm text-gray-300">
                            • Agent handoffs: {systemMetrics.handoffs} | Collaboration chains: {systemMetrics.collaborationChains}
                        </div>
                        <div className="text-sm text-gray-300">
                            • System health: {systemMetrics.systemHealth.toFixed(1)} | Active goals: {systemMetrics.activeGoals}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DeepAgentsPage;
