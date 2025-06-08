
import { AgentContext, EnhancedAgentResponse } from '@/types/AgentTypes';

let running = false;
let loopInterval: any = null;

export interface DeepLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
}

const saveLoopState = (isRunning: boolean) => {
    localStorage.setItem('deepAutonomousLoopActive', isRunning ? 'true' : 'false');
};

const loadLoopState = (): boolean => {
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

    let cycles = 0;
    let errorCount = 0;
    let agentPriority: Record<string, number> = {};

    console.log('[DEEP LOOP] Starting deep autonomous loop...');

    loopInterval = setInterval(async () => {
        cycles += 1;

        // Initialize agent priorities
        agents.forEach(agent => {
            if (!agentPriority[agent.name]) agentPriority[agent.name] = 1;
        });

        // Pick agent with priority weight
        const weightedAgents = agents.flatMap(agent =>
            Array(agentPriority[agent.name] || 1).fill(agent)
        );
        const selectedAgent = weightedAgents[Math.floor(Math.random() * weightedAgents.length)];

        console.log(`[DEEP LOOP] Cycle ${cycles}: Running agent: ${selectedAgent.name}`);

        try {
            selectedAgent.status = "RUNNING";
            setAgents([...agents]);

            const response = await selectedAgent.runner({ input: {} });

            selectedAgent.status = "IDLE";
            selectedAgent.lastAction = response.message || 'Completed';

            setLogs(prev => [...prev, {
                agent: selectedAgent.name,
                action: "Deep Loop Run",
                result: response.message || 'No message'
            }]);

            // Agent handoff to next agent if defined
            if (response.nextAgent) {
                console.log(`[DEEP LOOP] ${selectedAgent.name} → Handoff to ${response.nextAgent}`);
                const nextAgent = agents.find(a => a.name === response.nextAgent);
                if (nextAgent) {
                    const nextResponse = await nextAgent.runner({
                        input: { previousOutput: response.message }
                    });
                    setLogs(prev => [...prev, {
                        agent: nextAgent.name,
                        action: `Handoff from ${selectedAgent.name}`,
                        result: nextResponse.message || 'No message'
                    }]);
                }
            }

            // Update agent priority based on success
            if (response.success) {
                agentPriority[selectedAgent.name] = Math.min(5, (agentPriority[selectedAgent.name] || 1) + 1);
            } else {
                agentPriority[selectedAgent.name] = Math.max(1, (agentPriority[selectedAgent.name] || 1) - 1);
            }

            setAgents([...agents]);

        } catch (err) {
            errorCount += 1;
            console.error(`[DEEP LOOP ERROR] Agent ${selectedAgent.name}: ${err}`);
            selectedAgent.status = "ERROR";
            selectedAgent.lastAction = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setLogs(prev => [...prev, {
                agent: selectedAgent.name,
                action: "Error",
                result: err instanceof Error ? err.message : 'Unknown error'
            }]);
            
            // Decrease priority for failing agents
            agentPriority[selectedAgent.name] = Math.max(1, (agentPriority[selectedAgent.name] || 1) - 2);
            
            setAgents([...agents]);
        }

        setKpis(prev => ({
            ...prev,
            cycles,
            loopSpeed: config.loopDelayMs,
            errors: errorCount,
            lastAgent: selectedAgent.name,
            lastResult: selectedAgent.lastAction || 'No result'
        }));

        if (config.maxCycles && cycles >= config.maxCycles) {
            stopDeepAutonomousLoop();
        }
    }, config.loopDelayMs);
};

export const stopDeepAutonomousLoop = () => {
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
        running = false;
        saveLoopState(false);
        console.log('[DEEP LOOP] Stopped deep autonomous loop.');
    }
};

export const isDeepAutonomousLoopRunning = (): boolean => {
    return running;
};

export const shouldAutoStartDeepLoop = (): boolean => {
    return loadLoopState();
};

export const getSystemMetrics = () => {
    return {
        running,
        cycles: 0, // This would be tracked in actual implementation
        errors: 0
    };
};
