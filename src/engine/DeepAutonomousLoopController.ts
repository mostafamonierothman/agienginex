import { AgentContext } from '@/types/AgentTypes';
import { EnhancedMetaAgent } from '@/agents/EnhancedMetaAgent';
import { DeepLoopErrorRecovery } from '@/services/DeepLoopErrorRecovery';
import { DeepLoopAgentSelection } from '@/services/DeepLoopAgentSelection';
import { DeepLoopCollaboration } from '@/services/DeepLoopCollaboration';
import { ConsoleLogAgentRunner } from '@/services/ConsoleLogAgent';
import { CodeFixerAgentRunner } from '@/services/CodeFixerAgent';
import { SystemHealthAgentRunner } from '@/services/SystemHealthAgent';
import { IntelligentAgentFactoryRunner } from '@/services/IntelligentAgentFactory';

let running = false;
let loopInterval: any = null;
let deepLoopMetrics = {
    cycles: 0,
    handoffs: 0,
    collaborations: 0,
    optimizations: 0,
    errors: 0,
    recoveries: 0,
    agentsCreated: 0,
    errorsFixes: 0
};

export interface DeepLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
    enableHandoffs?: boolean;
    enableCollaborations?: boolean;
    adaptiveSpeed?: boolean;
    enableAutoRecovery?: boolean;
    enableIntelligentAgents?: boolean;
}

const saveLoopState = (isRunning: boolean) => {
    try {
        localStorage.setItem('deepAutonomousLoopActive', isRunning ? 'true' : 'false');
        localStorage.setItem('deepLoopMetrics', JSON.stringify(deepLoopMetrics));
    } catch (error) {
        console.error('[DeepLoop] Failed to save state:', error);
    }
};

const loadLoopState = (): boolean => {
    try {
        const saved = localStorage.getItem('deepLoopMetrics');
        if (saved) {
            deepLoopMetrics = { ...deepLoopMetrics, ...JSON.parse(saved) };
        }
        return localStorage.getItem('deepAutonomousLoopActive') === 'true';
    } catch (error) {
        console.error('[DeepLoop] Failed to load state:', error);
        return false;
    }
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

    // Initialize services
    const metaAgent = new EnhancedMetaAgent();
    const errorRecovery = new DeepLoopErrorRecovery();
    const agentSelection = new DeepLoopAgentSelection();
    const collaboration = new DeepLoopCollaboration();

    // Add intelligent agents to the pool
    const intelligentAgents = [
        { name: 'ConsoleLogAgent', runner: ConsoleLogAgentRunner, status: 'IDLE', lastAction: 'Error detection' },
        { name: 'CodeFixerAgent', runner: CodeFixerAgentRunner, status: 'IDLE', lastAction: 'Code repair' },
        { name: 'SystemHealthAgent', runner: SystemHealthAgentRunner, status: 'IDLE', lastAction: 'Health monitoring' },
        { name: 'IntelligentAgentFactory', runner: IntelligentAgentFactoryRunner, status: 'IDLE', lastAction: 'Agent creation' }
    ];

    // Merge with existing agents
    const allAgents = [...agents, ...intelligentAgents];
    let currentLoopSpeed = config.loopDelayMs;
    let agentPriority: Record<string, number> = {};

    console.log('[DEEP LOOP] Starting INTELLIGENT deep autonomous loop with AI-powered error fixing...');

    // Initialize agent priorities with higher priority for error-fixing agents
    allAgents.forEach(agent => {
        if (agent.name.includes('Error') || agent.name.includes('Health') || agent.name.includes('Fixer')) {
            agentPriority[agent.name] = 5; // High priority for error-fixing agents
        } else {
            agentPriority[agent.name] = Math.floor(Math.random() * 3) + 1;
        }
    });

    loopInterval = setInterval(async () => {
        deepLoopMetrics.cycles += 1;
        let goalTask = null; // Declare goalTask at the beginning of each cycle

        try {
            // PHASE 1: Error Detection and Recovery (every cycle for rapid response)
            if (config.enableAutoRecovery) {
                const recoveryResult = await errorRecovery.checkAndRecoverErrors(
                    deepLoopMetrics.cycles, 
                    setLogs
                );
                
                if (recoveryResult.newLoopSpeed) {
                    currentLoopSpeed = recoveryResult.newLoopSpeed;
                }
                
                if (recoveryResult.errorRecoveryMode) {
                    deepLoopMetrics.recoveries += 1;
                }
            }

            // PHASE 2: Intelligent Error Detection (every 2 cycles)
            if (deepLoopMetrics.cycles % 2 === 0) {
                try {
                    const consoleLogAgent = allAgents.find(a => a.name === 'ConsoleLogAgent');
                    if (consoleLogAgent) {
                        const errorResult = await consoleLogAgent.runner({
                            input: { cycle: deepLoopMetrics.cycles },
                            user_id: 'deep_loop_system'
                        });

                        if (errorResult.data?.fixingRequired) {
                            // Immediately trigger code fixer
                            const codeFixerAgent = allAgents.find(a => a.name === 'CodeFixerAgent');
                            if (codeFixerAgent) {
                                const fixResult = await codeFixerAgent.runner({
                                    input: { errors: errorResult.data.errors },
                                    user_id: 'deep_loop_system'
                                });
                                
                                if (fixResult.data?.fixesApplied > 0) {
                                    deepLoopMetrics.errorsFixes += fixResult.data.fixesApplied;
                                    deepLoopMetrics.errors = Math.max(0, deepLoopMetrics.errors - fixResult.data.fixesApplied);
                                }
                            }
                        }
                    }
                } catch (errorDetectionError) {
                    console.error('[DEEP LOOP] Error detection failed:', errorDetectionError);
                }
            }

            // PHASE 3: System Health Monitoring (every 5 cycles)
            if (deepLoopMetrics.cycles % 5 === 0) {
                try {
                    const healthAgent = allAgents.find(a => a.name === 'SystemHealthAgent');
                    if (healthAgent) {
                        const healthResult = await healthAgent.runner({
                            input: { cycle: deepLoopMetrics.cycles },
                            user_id: 'deep_loop_system'
                        });

                        if (healthResult.data?.criticalIssues > 0) {
                            // Trigger emergency agent creation
                            const factoryAgent = allAgents.find(a => a.name === 'IntelligentAgentFactory');
                            if (factoryAgent) {
                                const creationResult = await factoryAgent.runner({
                                    input: { 
                                        requiredSkills: ['error_fixer', 'performance_optimizer'],
                                        urgencyLevel: 'emergency'
                                    },
                                    user_id: 'deep_loop_system'
                                });
                                
                                if (creationResult.data?.createdAgents) {
                                    deepLoopMetrics.agentsCreated += creationResult.data.createdAgents.length;
                                }
                            }
                        }
                    }
                } catch (healthError) {
                    console.error('[DEEP LOOP] Health monitoring failed:', healthError);
                }
            }

            // PHASE 4: Meta-agent system analysis (every 10 cycles)
            if (deepLoopMetrics.cycles % 10 === 0) {
                try {
                    const analysis = await metaAgent.analyzeSystemPerformance();
                    console.log(`[DEEP LOOP] Meta-analysis: ${JSON.stringify(analysis.metrics)}`);
                    deepLoopMetrics.optimizations += 1;

                    // Adaptive speed based on system performance
                    if (config.adaptiveSpeed && analysis.metrics.avgSuccessRate && !errorRecovery.getErrorRecoveryMode()) {
                        if (analysis.metrics.avgSuccessRate > 85) {
                            currentLoopSpeed = Math.max(500, currentLoopSpeed * 0.8); // Speed up more aggressively
                        } else if (analysis.metrics.avgSuccessRate < 60) {
                            currentLoopSpeed = Math.min(5000, currentLoopSpeed * 1.1); // Slow down less
                        }
                    }
                } catch (metaError) {
                    console.error('[DEEP LOOP] Meta-agent error:', metaError);
                    deepLoopMetrics.errors += 1;
                }
            }

            // PHASE 5: Standard Agent Execution
            const { selectedAgent, goalTask: currentGoalTask } = agentSelection.selectAgent(
                allAgents, 
                agentPriority, 
                errorRecovery.getErrorRecoveryMode()
            );

            goalTask = currentGoalTask; // Assign to the declared variable

            console.log(`[DEEP LOOP] Cycle ${deepLoopMetrics.cycles}: Running ${selectedAgent.name}${errorRecovery.getErrorRecoveryMode() ? ' (RECOVERY MODE)' : ''}`);

            selectedAgent.status = "RUNNING";
            setAgents([...allAgents]);

            const context: AgentContext = {
                input: { 
                    cycle: deepLoopMetrics.cycles,
                    errorRecoveryMode: errorRecovery.getErrorRecoveryMode(),
                    consecutiveErrors: errorRecovery.getConsecutiveErrors(),
                    priority: errorRecovery.getErrorRecoveryMode() ? 'high' : 'normal',
                    goalTask: goalTask
                },
                user_id: 'deep_loop_system'
            };

            let response;
            try {
                response = await Promise.race([
                    selectedAgent.runner(context),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Agent timeout')), 8000)
                    )
                ]);

                selectedAgent.status = "IDLE";
                selectedAgent.lastAction = response.message || response.output || 'Completed';

            } catch (agentError) {
                errorRecovery.handleAgentError(selectedAgent.name, agentError, agentPriority);
                
                selectedAgent.status = "ERROR";
                selectedAgent.lastAction = `Error: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`;
                
                deepLoopMetrics.errors += 1;
                
                response = {
                    success: false,
                    message: `Agent error: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString()
                };
            }

            // PHASE 6: Enhanced handoff and collaboration
            if (config.enableHandoffs && response.nextAgent) {
                const handoffSuccessful = await collaboration.handleHandoff(
                    selectedAgent,
                    response,
                    allAgents,
                    goalTask,
                    setLogs
                );
                
                if (handoffSuccessful) {
                    deepLoopMetrics.handoffs += 1;
                }
            }

            if (config.enableCollaborations && deepLoopMetrics.cycles % 15 === 0) {
                const collaborationSuccessful = await collaboration.initiateCollaboration(
                    deepLoopMetrics.cycles,
                    goalTask,
                    setLogs
                );
                
                if (collaborationSuccessful) {
                    deepLoopMetrics.collaborations += 1;
                }
            }

            setLogs(prev => [...prev, {
                agent: selectedAgent.name,
                action: errorRecovery.getErrorRecoveryMode() ? "Recovery Mode Run" : "Intelligent Deep Loop Run",
                result: response.message || response.output || 'No result'
            }]);

            if (response.success !== false) {
                agentPriority[selectedAgent.name] = Math.min(5, (agentPriority[selectedAgent.name] || 1) + 1);
            }

            setAgents([...allAgents]);

        } catch (err) {
            deepLoopMetrics.errors += 1;
            console.error(`[DEEP LOOP ERROR] Cycle ${deepLoopMetrics.cycles}: ${err}`);
            
            const errorAgent = allAgents.find(a => a.status === "RUNNING");
            if (errorAgent) {
                errorAgent.status = "ERROR";
                errorAgent.lastAction = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
                agentPriority[errorAgent.name] = Math.max(1, (agentPriority[errorAgent.name] || 1) - 2);
            }

            setLogs(prev => [...prev, {
                agent: errorAgent?.name || 'Unknown',
                action: "System Error",
                result: err instanceof Error ? err.message : 'Unknown error'
            }]);

            setAgents([...allAgents]);
        }

        setKpis(prev => ({
            ...prev,
            cycles: deepLoopMetrics.cycles,
            loopSpeed: currentLoopSpeed,
            errors: deepLoopMetrics.errors,
            recoveries: deepLoopMetrics.recoveries,
            handoffs: deepLoopMetrics.handoffs,
            collaborations: deepLoopMetrics.collaborations,
            optimizations: deepLoopMetrics.optimizations,
            agentsCreated: deepLoopMetrics.agentsCreated,
            errorsFixes: deepLoopMetrics.errorsFixes,
            lastAgent: allAgents.find(a => a.status === "RUNNING")?.name || 'None',
            errorRecoveryMode: errorRecovery.getErrorRecoveryMode(),
            lastResult: `Fixed ${deepLoopMetrics.errorsFixes} errors, Created ${deepLoopMetrics.agentsCreated} agents`
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
        console.log('[DEEP LOOP] Stopped intelligent deep autonomous loop.');
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
        errors: 0,
        recoveries: 0,
        agentsCreated: 0,
        errorsFixes: 0
    };
    saveLoopState(running);
};
