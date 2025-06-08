
import { AgentContext, EnhancedAgentResponse } from '@/types/AgentTypes';
import { EnhancedMetaAgent } from '@/agents/EnhancedMetaAgent';
import { EnhancedGoalAgent } from '@/agents/EnhancedGoalAgent';
import { EnhancedCollaborationAgent } from '@/agents/EnhancedCollaborationAgent';

let running = false;
let loopInterval: any = null;
let deepLoopMetrics = {
    cycles: 0,
    handoffs: 0,
    collaborations: 0,
    optimizations: 0,
    errors: 0
};

export interface DeepLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
    enableHandoffs?: boolean;
    enableCollaborations?: boolean;
    adaptiveSpeed?: boolean;
}

const saveLoopState = (isRunning: boolean) => {
    localStorage.setItem('deepAutonomousLoopActive', isRunning ? 'true' : 'false');
    localStorage.setItem('deepLoopMetrics', JSON.stringify(deepLoopMetrics));
};

const loadLoopState = (): boolean => {
    const saved = localStorage.getItem('deepLoopMetrics');
    if (saved) {
        deepLoopMetrics = { ...deepLoopMetrics, ...JSON.parse(saved) };
    }
    return localStorage.getItem('deepAutonomousLoopActive') === 'true';
};

export const startDeepAutonomousLoop = (
    agents: any[],
    setAgents: Function,
    setLogs: Function,
    setKpis: Function,
    config: DeepLoopConfig
) => {
    if (running) return;
    running = true;
    saveLoopState(true);

    const metaAgent = new EnhancedMetaAgent();
    const goalAgent = new EnhancedGoalAgent();
    const collaborationAgent = new EnhancedCollaborationAgent();

    let currentLoopSpeed = config.loopDelayMs;
    let agentPriority: Record<string, number> = {};
    let lastHandoffTime = 0;
    let consecutiveErrors = 0;

    console.log('[DEEP LOOP] Starting enhanced deep autonomous loop with handoffs and collaborations...');

    // Initialize agent priorities
    agents.forEach(agent => {
        agentPriority[agent.name] = Math.floor(Math.random() * 3) + 1;
    });

    loopInterval = setInterval(async () => {
        deepLoopMetrics.cycles += 1;

        try {
            // Meta-agent system analysis every 10 cycles
            if (deepLoopMetrics.cycles % 10 === 0) {
                const analysis = await metaAgent.analyzeSystemPerformance();
                console.log(`[DEEP LOOP] Meta-analysis: ${JSON.stringify(analysis.metrics)}`);
                deepLoopMetrics.optimizations += 1;

                // Adaptive speed based on system performance
                if (config.adaptiveSpeed && analysis.metrics.avgSuccessRate) {
                    if (analysis.metrics.avgSuccessRate > 85) {
                        currentLoopSpeed = Math.max(1000, currentLoopSpeed * 0.9); // Speed up
                    } else if (analysis.metrics.avgSuccessRate < 60) {
                        currentLoopSpeed = Math.min(10000, currentLoopSpeed * 1.2); // Slow down
                    }
                }
            }

            // Goal-driven agent selection
            const goalTask = goalAgent.getNextSubgoal();
            let selectedAgent: any;

            if (goalTask) {
                // Select agent based on goal requirements
                const goalKeywords = goalTask.subgoal.toLowerCase();
                if (goalKeywords.includes('research')) {
                    selectedAgent = agents.find(a => a.name.includes('Research')) || agents[0];
                } else if (goalKeywords.includes('learn')) {
                    selectedAgent = agents.find(a => a.name.includes('Learning')) || agents[0];
                } else if (goalKeywords.includes('strategic')) {
                    selectedAgent = agents.find(a => a.name.includes('Strategic')) || agents[0];
                } else {
                    // Weighted random selection
                    const weightedAgents = agents.flatMap(agent =>
                        Array(agentPriority[agent.name] || 1).fill(agent)
                    );
                    selectedAgent = weightedAgents[Math.floor(Math.random() * weightedAgents.length)];
                }
            } else {
                // Fallback to weighted selection
                const weightedAgents = agents.flatMap(agent =>
                    Array(agentPriority[agent.name] || 1).fill(agent)
                );
                selectedAgent = weightedAgents[Math.floor(Math.random() * weightedAgents.length)];
            }

            console.log(`[DEEP LOOP] Cycle ${deepLoopMetrics.cycles}: Running ${selectedAgent.name}${goalTask ? ` for goal: ${goalTask.subgoal}` : ''}`);

            selectedAgent.status = "RUNNING";
            setAgents([...agents]);

            // Prepare enhanced context
            const context: AgentContext = {
                input: goalTask ? { 
                    goal: goalTask.goal,
                    subgoal: goalTask.subgoal,
                    priority: goalTask.priority,
                    cycle: deepLoopMetrics.cycles
                } : { cycle: deepLoopMetrics.cycles },
                user_id: 'deep_loop_system'
            };

            const response = await selectedAgent.runner(context);

            selectedAgent.status = "IDLE";
            selectedAgent.lastAction = response.message || response.output || 'Completed';
            consecutiveErrors = 0;

            // Enhanced handoff logic
            if (config.enableHandoffs && response.nextAgent && Date.now() - lastHandoffTime > 5000) {
                const nextAgent = agents.find(a => a.name === response.nextAgent);
                if (nextAgent) {
                    console.log(`[DEEP LOOP] ${selectedAgent.name} → Handoff to ${response.nextAgent}`);
                    
                    const handoff = await collaborationAgent.coordinateAgentHandoff(
                        selectedAgent.name,
                        response.nextAgent,
                        { previousOutput: response.message, goalContext: goalTask }
                    );

                    if (handoff.success) {
                        deepLoopMetrics.handoffs += 1;
                        lastHandoffTime = Date.now();

                        const nextResponse = await nextAgent.runner({
                            input: { 
                                handoffData: handoff.handoffData,
                                previousAgent: selectedAgent.name,
                                cycle: deepLoopMetrics.cycles
                            },
                            user_id: 'deep_loop_system'
                        });

                        setLogs(prev => [...prev, {
                            agent: nextAgent.name,
                            action: `Handoff from ${selectedAgent.name}`,
                            result: nextResponse.message || nextResponse.output || 'No response'
                        }]);
                    }
                }
            }

            // Collaboration initiation (every 15 cycles)
            if (config.enableCollaborations && deepLoopMetrics.cycles % 15 === 0) {
                const collaborationResponse = await collaborationAgent.runner({
                    input: { 
                        action: 'coordinate',
                        topic: goalTask ? goalTask.goal : 'System optimization',
                        cycle: deepLoopMetrics.cycles
                    },
                    user_id: 'deep_loop_system'
                });

                if (collaborationResponse.success) {
                    deepLoopMetrics.collaborations += 1;
                    setLogs(prev => [...prev, {
                        agent: 'EnhancedCollaborationAgent',
                        action: 'Multi-agent collaboration',
                        result: collaborationResponse.message || 'Collaboration initiated'
                    }]);
                }
            }

            setLogs(prev => [...prev, {
                agent: selectedAgent.name,
                action: goalTask ? `Goal: ${goalTask.subgoal}` : "Deep Loop Run",
                result: response.message || response.output || 'No result'
            }]);

            // Update agent priority based on success
            if (response.success !== false) {
                agentPriority[selectedAgent.name] = Math.min(5, (agentPriority[selectedAgent.name] || 1) + 1);
            } else {
                agentPriority[selectedAgent.name] = Math.max(1, (agentPriority[selectedAgent.name] || 1) - 1);
            }

            setAgents([...agents]);

        } catch (err) {
            deepLoopMetrics.errors += 1;
            consecutiveErrors += 1;
            console.error(`[DEEP LOOP ERROR] Cycle ${deepLoopMetrics.cycles}: ${err}`);
            
            const errorAgent = agents.find(a => a.status === "RUNNING");
            if (errorAgent) {
                errorAgent.status = "ERROR";
                errorAgent.lastAction = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
                agentPriority[errorAgent.name] = Math.max(1, (agentPriority[errorAgent.name] || 1) - 2);
            }

            setLogs(prev => [...prev, {
                agent: errorAgent?.name || 'Unknown',
                action: "Error",
                result: err instanceof Error ? err.message : 'Unknown error'
            }]);

            // Adaptive error handling
            if (consecutiveErrors > 3) {
                currentLoopSpeed = Math.min(currentLoopSpeed * 1.5, 10000);
                console.log(`[DEEP LOOP] Slowing down due to consecutive errors: ${currentLoopSpeed}ms`);
            }

            setAgents([...agents]);
        }

        setKpis(prev => ({
            ...prev,
            cycles: deepLoopMetrics.cycles,
            loopSpeed: currentLoopSpeed,
            errors: deepLoopMetrics.errors,
            handoffs: deepLoopMetrics.handoffs,
            collaborations: deepLoopMetrics.collaborations,
            optimizations: deepLoopMetrics.optimizations,
            lastAgent: agents.find(a => a.status === "RUNNING")?.name || 'None'
        }));

        saveLoopState(true);

        if (config.maxCycles && deepLoopMetrics.cycles >= config.maxCycles) {
            stopDeepAutonomousLoop();
        }
    }, currentLoopSpeed);
};

export const stopDeepAutonomousLoop = () => {
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
        running = false;
        saveLoopState(false);
        console.log('[DEEP LOOP] Stopped deep autonomous loop.');
        console.log(`[DEEP LOOP] Final metrics:`, deepLoopMetrics);
    }
};

export const isDeepAutonomousLoopRunning = (): boolean => {
    return running;
};

export const shouldAutoStartDeepLoop = (): boolean => {
    return loadLoopState();
};

export const getDeepLoopMetrics = () => {
    return { ...deepLoopMetrics, running };
};

export const resetDeepLoopMetrics = () => {
    deepLoopMetrics = {
        cycles: 0,
        handoffs: 0,
        collaborations: 0,
        optimizations: 0,
        errors: 0
    };
    saveLoopState(running);
};
