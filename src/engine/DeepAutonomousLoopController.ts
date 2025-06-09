import { AgentContext } from '@/types/AgentTypes';
import { EnhancedMetaAgent } from '@/agents/EnhancedMetaAgent';
import { DeepLoopErrorRecovery } from '@/services/DeepLoopErrorRecovery';
import { DeepLoopAgentSelection } from '@/services/DeepLoopAgentSelection';
import { DeepLoopCollaboration } from '@/services/DeepLoopCollaboration';
import { ConsoleLogAgentRunner } from '@/services/ConsoleLogAgent';
import { CodeFixerAgentRunner } from '@/services/CodeFixerAgent';
import { SystemHealthAgentRunner } from '@/services/SystemHealthAgent';
import { IntelligentAgentFactoryRunner } from '@/services/IntelligentAgentFactory';
import { DatabaseErrorAgentRunner } from '@/services/DatabaseErrorAgent';
import { SystemRepairAgentRunner } from '@/services/SystemRepairAgent';
import { AgentEvolutionEngineRunner } from '@/services/AgentEvolutionEngine';
import { agentCommunicationBus } from '@/services/AgentCommunicationBus';
import { agentTaskQueue } from '@/services/AgentTaskQueue';

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

    // Add intelligent agents to the pool with new error-fixing capabilities
    const intelligentAgents = [
        { name: 'ConsoleLogAgent', runner: ConsoleLogAgentRunner, status: 'IDLE', lastAction: 'Error detection' },
        { name: 'CodeFixerAgent', runner: CodeFixerAgentRunner, status: 'IDLE', lastAction: 'Code repair' },
        { name: 'SystemHealthAgent', runner: SystemHealthAgentRunner, status: 'IDLE', lastAction: 'Health monitoring' },
        { name: 'IntelligentAgentFactory', runner: IntelligentAgentFactoryRunner, status: 'IDLE', lastAction: 'Agent creation' },
        { name: 'DatabaseErrorAgent', runner: DatabaseErrorAgentRunner, status: 'IDLE', lastAction: 'Database repair' },
        { name: 'SystemRepairAgent', runner: SystemRepairAgentRunner, status: 'IDLE', lastAction: 'System repair' },
        { name: 'AgentEvolutionEngine', runner: AgentEvolutionEngineRunner, status: 'IDLE', lastAction: 'Agent evolution' }
    ];

    // Merge with existing agents
    const allAgents = [...agents, ...intelligentAgents];
    let currentLoopSpeed = config.loopDelayMs;
    let agentPriority: Record<string, number> = {};

    console.log('[DEEP LOOP] Starting PHASE 4: ERROR-FREE OPERATION - Full AI-powered self-healing system...');

    // Register agents with communication bus
    allAgents.forEach(agent => {
        agentCommunicationBus.registerAgent(agent.name, agent);
        
        if (agent.name.includes('Error') || agent.name.includes('Health') || agent.name.includes('Fixer') || agent.name.includes('Repair')) {
            agentPriority[agent.name] = 10; // Maximum priority for error-fixing agents
        } else {
            agentPriority[agent.name] = Math.floor(Math.random() * 3) + 1;
        }
    });

    loopInterval = setInterval(async () => {
        deepLoopMetrics.cycles += 1;
        let goalTask = null;

        try {
            // PHASE 4: REAL-TIME ERROR ELIMINATION (every cycle)
            if (deepLoopMetrics.cycles % 1 === 0) { // Every cycle!
                try {
                    // Detect errors with multiple agents in parallel
                    const errorDetectionPromises = [
                        ConsoleLogAgentRunner({ input: { cycle: deepLoopMetrics.cycles }, user_id: 'error_detection_system' }),
                        DatabaseErrorAgentRunner({ input: { cycle: deepLoopMetrics.cycles }, user_id: 'error_detection_system' })
                    ];

                    const errorResults = await Promise.all(errorDetectionPromises);
                    
                    let totalErrors = 0;
                    let allErrors = [];

                    errorResults.forEach(result => {
                        if (result.data?.errors) {
                            totalErrors += result.data.errors.length;
                            allErrors = [...allErrors, ...result.data.errors];
                        }
                    });

                    if (totalErrors > 0) {
                        console.log(`[DEEP LOOP] 🚨 EMERGENCY: ${totalErrors} errors detected - deploying mass error-fixing agents!`);
                        
                        // Deploy 10x error-fixing agents for every error found
                        const errorFixingTasks = [];
                        
                        for (let i = 0; i < Math.min(totalErrors * 10, 50); i++) {
                            errorFixingTasks.push(
                                agentTaskQueue.addTask({
                                    type: 'error_fix',
                                    priority: 'emergency',
                                    payload: { 
                                        errors: allErrors, 
                                        agentIndex: i,
                                        massFixing: true 
                                    }
                                })
                            );
                        }

                        await Promise.all(errorFixingTasks);
                        deepLoopMetrics.errors = Math.max(0, deepLoopMetrics.errors - totalErrors);
                        
                        // Broadcast error alert to all agents
                        await agentCommunicationBus.broadcastErrorAlert({
                            type: 'mass_error_detection',
                            count: totalErrors,
                            errors: allErrors,
                            response: 'emergency_fixing_deployed'
                        });
                    }
                } catch (errorDetectionError) {
                    console.error('[DEEP LOOP] Error detection failed:', errorDetectionError);
                }
            }

            // PHASE 4: PREDICTIVE ERROR PREVENTION (every 3 cycles)
            if (deepLoopMetrics.cycles % 3 === 0) {
                try {
                    // Use SystemHealthAgent for predictive analysis
                    const healthResult = await SystemHealthAgentRunner({
                        input: { 
                            cycle: deepLoopMetrics.cycles,
                            mode: 'predictive_analysis'
                        },
                        user_id: 'predictive_system'
                    });

                    if (healthResult.data?.criticalIssues > 0) {
                        // Deploy preventive agents
                        await agentTaskQueue.addTask({
                            type: 'system_repair',
                            priority: 'high',
                            payload: { 
                                mode: 'preventive',
                                issues: healthResult.data
                            }
                        });
                        
                        deepLoopMetrics.recoveries += 1;
                    }
                } catch (predictiveError) {
                    console.error('[DEEP LOOP] Predictive analysis failed:', predictiveError);
                }
            }

            // PHASE 4: AGENT EVOLUTION AND SCALING (every 7 cycles)
            if (deepLoopMetrics.cycles % 7 === 0) {
                try {
                    const evolutionResult = await AgentEvolutionEngineRunner({
                        input: { 
                            cycle: deepLoopMetrics.cycles,
                            targetErrorRate: 0 // Target zero errors!
                        },
                        user_id: 'evolution_system'
                    });

                    if (evolutionResult.data?.agentsEvolved > 0) {
                        deepLoopMetrics.optimizations += evolutionResult.data.agentsEvolved;
                        
                        // Create additional specialized agents based on current error patterns
                        const factoryResult = await IntelligentAgentFactoryRunner({
                            input: { 
                                requiredSkills: ['ultra_error_fixer', 'zero_tolerance_repair'],
                                urgencyLevel: 'optimization',
                                count: 5
                            },
                            user_id: 'scaling_system'
                        });
                        
                        if (factoryResult.data?.createdAgents) {
                            deepLoopMetrics.agentsCreated += factoryResult.data.createdAgents.length;
                        }
                    }
                } catch (evolutionError) {
                    console.error('[DEEP LOOP] Evolution failed:', evolutionError);
                }
            }

            // PHASE 5: Standard Agent Execution
            const { selectedAgent, goalTask: currentGoalTask } = agentSelection.selectAgent(
                allAgents, 
                agentPriority, 
                errorRecovery.getErrorRecoveryMode()
            );

            goalTask = currentGoalTask;

            console.log(`[DEEP LOOP] Cycle ${deepLoopMetrics.cycles}: Running ${selectedAgent.name}${errorRecovery.getErrorRecoveryMode() ? ' (RECOVERY MODE)' : ''} | Queue: ${agentTaskQueue.getQueueStats().pendingTasks} tasks`);

            selectedAgent.status = "RUNNING";
            setAgents([...allAgents]);

            const context: AgentContext = {
                input: { 
                    cycle: deepLoopMetrics.cycles,
                    errorRecoveryMode: errorRecovery.getErrorRecoveryMode(),
                    consecutiveErrors: errorRecovery.getConsecutiveErrors(),
                    priority: errorRecovery.getErrorRecoveryMode() ? 'high' : 'normal',
                    goalTask: goalTask,
                    taskQueueStats: agentTaskQueue.getQueueStats(),
                    communicationBusStats: agentCommunicationBus.getSystemStats()
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
                
                // Add emergency error fixing task
                await agentTaskQueue.addTask({
                    type: 'error_fix',
                    priority: 'emergency',
                    payload: { 
                        agentError: agentError,
                        failedAgent: selectedAgent.name
                    }
                });
                
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
                action: errorRecovery.getErrorRecoveryMode() ? "Recovery Mode Run" : "Phase 4: Error-Free Operation",
                result: response.message || response.output || 'No result'
            }]);

            if (response.success !== false) {
                agentPriority[selectedAgent.name] = Math.min(10, (agentPriority[selectedAgent.name] || 1) + 1);
            }

            setAgents([...allAgents]);

        } catch (err) {
            deepLoopMetrics.errors += 1;
            console.error(`[DEEP LOOP ERROR] Cycle ${deepLoopMetrics.cycles}: ${err}`);
            
            // Emergency error handling
            await agentTaskQueue.addTask({
                type: 'error_fix',
                priority: 'emergency',
                payload: { 
                    systemError: err,
                    cycle: deepLoopMetrics.cycles
                }
            });

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

        // Enhanced KPI updates with new metrics
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
            lastResult: `Phase 4: ${deepLoopMetrics.errorsFixes} fixes, ${deepLoopMetrics.agentsCreated} agents, Queue: ${agentTaskQueue.getQueueStats().pendingTasks}`,
            queueStats: agentTaskQueue.getQueueStats(),
            busStats: agentCommunicationBus.getSystemStats()
        }));

        saveLoopState(true);

        if (config.maxCycles && deepLoopMetrics.cycles >= config.maxCycles) {
            stopDeepAutonomousLoop();
        }
    }, Math.max(500, currentLoopSpeed)); // Faster minimum speed for error elimination
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
