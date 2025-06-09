import { AgentContext } from '@/types/AgentTypes';
import { EnhancedMetaAgent } from '@/agents/EnhancedMetaAgent';
import { DeepLoopErrorRecovery } from '@/services/DeepLoopErrorRecovery';
import { DeepLoopAgentSelection } from '@/services/DeepLoopAgentSelection';
import { DeepLoopCollaboration } from '@/services/DeepLoopCollaboration';

let running = false;
let loopInterval: any = null;
let deepLoopMetrics = {
    cycles: 0,
    handoffs: 0,
    collaborations: 0,
    optimizations: 0,
    errors: 0,
    recoveries: 0
};

export interface DeepLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
    enableHandoffs?: boolean;
    enableCollaborations?: boolean;
    adaptiveSpeed?: boolean;
    enableAutoRecovery?: boolean;
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

    let currentLoopSpeed = config.loopDelayMs;
    let agentPriority: Record<string, number> = {};

    console.log('[DEEP LOOP] Starting enhanced deep autonomous loop with auto-recovery...');

    // Initialize agent priorities
    agents.forEach(agent => {
        agentPriority[agent.name] = Math.floor(Math.random() * 3) + 1;
    });

    loopInterval = setInterval(async () => {
        deepLoopMetrics.cycles += 1;

        try {
            // Enhanced error detection and recovery every 5 cycles
            if (deepLoopMetrics.cycles % 5 === 0 && config.enableAutoRecovery) {
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

            // Meta-agent system analysis every 10 cycles
            if (deepLoopMetrics.cycles % 10 === 0) {
                try {
                    const analysis = await metaAgent.analyzeSystemPerformance();
                    console.log(`[DEEP LOOP] Meta-analysis: ${JSON.stringify(analysis.metrics)}`);
                    deepLoopMetrics.optimizations += 1;

                    // Adaptive speed based on system performance
                    if (config.adaptiveSpeed && analysis.metrics.avgSuccessRate && !errorRecovery.getErrorRecoveryMode()) {
                        if (analysis.metrics.avgSuccessRate > 85) {
                            currentLoopSpeed = Math.max(1000, currentLoopSpeed * 0.9); // Speed up
                        } else if (analysis.metrics.avgSuccessRate < 60) {
                            currentLoopSpeed = Math.min(10000, currentLoopSpeed * 1.2); // Slow down
                        }
                    }
                } catch (metaError) {
                    console.error('[DEEP LOOP] Meta-agent error:', metaError);
                    deepLoopMetrics.errors += 1;
                }
            }

            // Goal-driven agent selection with error recovery priority
            const { selectedAgent, goalTask } = agentSelection.selectAgent(
                agents, 
                agentPriority, 
                errorRecovery.getErrorRecoveryMode()
            );

            console.log(`[DEEP LOOP] Cycle ${deepLoopMetrics.cycles}: Running ${selectedAgent.name}${errorRecovery.getErrorRecoveryMode() ? ' (RECOVERY MODE)' : ''}`);

            selectedAgent.status = "RUNNING";
            setAgents([...agents]);

            // Prepare enhanced context with error recovery info
            const context: AgentContext = {
                input: { 
                    cycle: deepLoopMetrics.cycles,
                    errorRecoveryMode: errorRecovery.getErrorRecoveryMode(),
                    consecutiveErrors: errorRecovery.getConsecutiveErrors(),
                    priority: errorRecovery.getErrorRecoveryMode() ? 'high' : 'normal'
                },
                user_id: 'deep_loop_system'
            };

            // Enhanced error handling for agent execution
            let response;
            try {
                response = await Promise.race([
                    selectedAgent.runner(context),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Agent timeout')), 10000)
                    )
                ]);

                selectedAgent.status = "IDLE";
                selectedAgent.lastAction = response.message || response.output || 'Completed';

            } catch (agentError) {
                errorRecovery.handleAgentError(selectedAgent.name, agentError, agentPriority);
                
                selectedAgent.status = "ERROR";
                selectedAgent.lastAction = `Error: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`;
                
                deepLoopMetrics.errors += 1;
                
                // Create error response
                response = {
                    success: false,
                    message: `Agent error: ${agentError instanceof Error ? agentError.message : 'Unknown error'}`,
                    timestamp: new Date().toISOString()
                };
            }

            // Enhanced handoff logic
            if (config.enableHandoffs && response.nextAgent) {
                const handoffSuccessful = await collaboration.handleHandoff(
                    selectedAgent,
                    response,
                    agents,
                    goalTask,
                    setLogs
                );
                
                if (handoffSuccessful) {
                    deepLoopMetrics.handoffs += 1;
                }
            }

            // Collaboration initiation (every 15 cycles)
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
                action: errorRecovery.getErrorRecoveryMode() ? "Recovery Mode Run" : "Deep Loop Run",
                result: response.message || response.output || 'No result'
            }]);

            // Update agent priority based on success
            if (response.success !== false) {
                agentPriority[selectedAgent.name] = Math.min(5, (agentPriority[selectedAgent.name] || 1) + 1);
            }

            setAgents([...agents]);

        } catch (err) {
            deepLoopMetrics.errors += 1;
            console.error(`[DEEP LOOP ERROR] Cycle ${deepLoopMetrics.cycles}: ${err}`);
            
            // Enhanced error recovery
            const errorAgent = agents.find(a => a.status === "RUNNING");
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

            setAgents([...agents]);
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
            lastAgent: agents.find(a => a.status === "RUNNING")?.name || 'None',
            errorRecoveryMode: errorRecovery.getErrorRecoveryMode()
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
        errors: 0,
        recoveries: 0
    };
    saveLoopState(running);
};
