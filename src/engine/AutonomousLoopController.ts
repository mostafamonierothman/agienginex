
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
import { SupervisorAgent } from '@/agents/SupervisorAgent';

let running = false;
let loopInterval: any = null;

export interface AutonomousLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
}

const saveLoopState = (isRunning: boolean) => {
    localStorage.setItem('autonomousLoopActive', isRunning ? 'true' : 'false');
};

const loadLoopState = (): boolean => {
    return localStorage.getItem('autonomousLoopActive') === 'true';
};

export const startAutonomousLoop = (
    supervisorAgent: SupervisorAgent, 
    agents: any[], 
    setAgents: Function, 
    setLogs: Function, 
    setKpis: Function, 
    config: AutonomousLoopConfig
) => {
    if (running) return; // prevent multiple loops
    running = true;
    saveLoopState(true); // Save state

    let cycles = 0;

    loopInterval = setInterval(async () => {
        cycles += 1;

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        try {
            randomAgent.status = "RUNNING";
            setAgents([...agents]);

            const response = await randomAgent.runner({
                input: {}
            });

            randomAgent.status = "IDLE";
            randomAgent.lastAction = response.output;

            setLogs(prev => [...prev, {
                agent: randomAgent.name,
                action: "Autonomous Loop Run",
                result: response.output
            }]);

            setAgents([...agents]);

        } catch (error) {
            randomAgent.status = "ERROR";
            randomAgent.lastAction = `Error: ${error.message}`;
            setLogs(prev => [...prev, {
                agent: randomAgent.name,
                action: "Error",
                result: error.message
            }]);
            setAgents([...agents]);
        }

        setKpis(prev => ({ ...prev, cycles, loopSpeed: config.loopDelayMs }));

        if (config.maxCycles && cycles >= config.maxCycles) {
            stopAutonomousLoop();
        }
    }, config.loopDelayMs);
};

export const stopAutonomousLoop = () => {
    if (loopInterval) {
        clearInterval(loopInterval);
        loopInterval = null;
        running = false;
        saveLoopState(false); // Save state
    }
};

export const isAutonomousLoopRunning = (): boolean => {
    return running;
};

export const shouldAutoStartLoop = (): boolean => {
    return loadLoopState();
};
