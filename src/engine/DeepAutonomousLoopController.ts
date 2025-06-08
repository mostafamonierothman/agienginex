
import { AgentContext, AgentResponse } from '@/types/AgentTypes';

let running = false;
let loopInterval: any = null;

export interface DeepAutonomousLoopConfig {
    loopDelayMs: number;
    maxCycles?: number;
}

// Enhanced AgentResponse with handoff capability
export interface EnhancedAgentResponse extends AgentResponse {
    nextAgent?: string;
    priority?: number;
    shouldContinue?: boolean;
}

class MetaLoopOptimizer {
    private agentPriority: Record<string, number> = {};
    private agentPerformance: Record<string, { success: number; errors: number; total: number }> = {};

    analyzeLoop(agents: any[], logs: any[]) {
        agents.forEach(agent => {
            if (!this.agentPriority[agent.name]) this.agentPriority[agent.name] = 1;
            if (!this.agentPerformance[agent.name]) {
                this.agentPerformance[agent.name] = { success: 0, errors: 0, total: 0 };
            }

            // Calculate performance from recent logs
            const agentLogs = logs.filter(l => l.agent === agent.name).slice(-10);
            const successCount = agentLogs.filter(l => l.result && !l.result.startsWith('Error')).length;
            const errorCount = agentLogs.filter(l => l.result && l.result.startsWith('Error')).length;

            this.agentPerformance[agent.name].success = successCount;
            this.agentPerformance[agent.name].errors = errorCount;
            this.agentPerformance[agent.name].total = agentLogs.length;

            // Adjust priority based on performance
            if (successCount > 3) {
                this.agentPriority[agent.name] = Math.min(5, this.agentPriority[agent.name] + 1);
            } else if (errorCount > 2) {
                this.agentPriority[agent.name] = Math.max(1, this.agentPriority[agent.name] - 1);
            }

            // Boost priority for agents that haven't run recently
            if (agent.status === 'IDLE' && agentLogs.length === 0) {
                this.agentPriority[agent.name] = Math.min(3, this.agentPriority[agent.name] + 0.5);
            }
        });

        console.log('[MetaOptimizer] Agent priorities:', this.agentPriority);
    }

    getAgentPriority(agentName: string): number {
        return this.agentPriority[agentName] || 1;
    }

    selectWeightedAgent(agents: any[]): any {
        const weightedAgents = agents.flatMap(agent => 
            Array(Math.ceil(this.getAgentPriority(agent.name))).fill(agent)
        );
        return weightedAgents[Math.floor(Math.random() * weightedAgents.length)];
    }

    getSystemHealth(): { avgPriority: number; totalErrors: number; activeAgents: number } {
        const priorities = Object.values(this.agentPriority);
        const performance = Object.values(this.agentPerformance);
        
        return {
            avgPriority: priorities.reduce((a, b) => a + b, 0) / priorities.length,
            totalErrors: performance.reduce((sum, p) => sum + p.errors, 0),
            activeAgents: performance.filter(p => p.total > 0).length
        };
    }
}

class GoalDrivenEngine {
    private goals: Array<{ goal: string; subgoals: string[]; priority: number }> = [];
    private currentGoalIndex = 0;

    constructor() {
        // Initialize with default goals
        this.setLongTermGoal('System optimization and efficiency improvement', 3);
        this.setLongTermGoal('Enhanced inter-agent collaboration', 2);
        this.setLongTermGoal('Knowledge acquisition and processing', 1);
    }

    setLongTermGoal(goal: string, priority: number = 1) {
        const subgoals = [
            `Research and analyze ${goal}`,
            `Develop strategy for ${goal}`,
            `Implement solutions for ${goal}`,
            `Evaluate results of ${goal}`
        ];
        
        this.goals.push({ goal, subgoals: [...subgoals], priority });
        this.goals.sort((a, b) => b.priority - a.priority);
        
        console.log(`[GoalEngine] Set goal: ${goal} (Priority: ${priority})`);
    }

    getNextSubgoal(): string | null {
        // Cycle through goals to ensure variety
        for (let i = 0; i < this.goals.length; i++) {
            const goalIndex = (this.currentGoalIndex + i) % this.goals.length;
            const goal = this.goals[goalIndex];
            
            if (goal.subgoals.length > 0) {
                this.currentGoalIndex = goalIndex;
                return goal.subgoals.shift() || null;
            }
        }
        
        // If all subgoals completed, generate new ones
        this.regenerateGoals();
        return this.getNextSubgoal();
    }

    private regenerateGoals() {
        console.log('[GoalEngine] Regenerating goals...');
        this.goals = [];
        this.setLongTermGoal('Advanced system capabilities development', 3);
        this.setLongTermGoal('Cross-domain knowledge integration', 2);
        this.setLongTermGoal('Autonomous decision-making enhancement', 1);
    }

    getActiveGoals(): Array<{ goal: string; remaining: number; priority: number }> {
        return this.goals.map(g => ({
            goal: g.goal,
            remaining: g.subgoals.length,
            priority: g.priority
        }));
    }
}

const metaOptimizer = new MetaLoopOptimizer();
const goalEngine = new GoalDrivenEngine();

const saveLoopState = (isRunning: boolean) => {
    localStorage.setItem('deepAutonomousLoopActive', isRunning ? 'true' : 'false');
};

const loadLoopState = (): boolean => {
    return localStorage.getItem('deepAutonomousLoopActive') === 'true';
};

export const startDeepAutonomousLoop = (
    supervisorAgent: any,
    agents: any[],
    setAgents: Function,
    setLogs: Function,
    setKpis: Function,
    config: DeepAutonomousLoopConfig
) => {
    if (running) return;
    running = true;
    saveLoopState(true);

    let cycles = 0;
    let handoffCount = 0;
    let collaborationChains = 0;

    console.log('[DEEP LOOP] Starting deep autonomous loop with agent collaboration...');

    loopInterval = setInterval(async () => {
        cycles += 1;

        try {
            // 1. Meta-optimization: Analyze system and adjust priorities
            const logs = JSON.parse(localStorage.getItem('deepLoopLogs') || '[]');
            metaOptimizer.analyzeLoop(agents, logs);

            // 2. Goal-driven selection: Get current subgoal
            const currentSubgoal = goalEngine.getNextSubgoal();

            // 3. Intelligent agent selection based on subgoal and priorities
            let selectedAgent;
            if (currentSubgoal) {
                // Route subgoal to appropriate agent type
                selectedAgent = routeSubgoalToAgent(currentSubgoal, agents) || metaOptimizer.selectWeightedAgent(agents);
            } else {
                selectedAgent = metaOptimizer.selectWeightedAgent(agents);
            }

            console.log(`[DEEP LOOP] Cycle ${cycles}: ${selectedAgent.name} | Goal: ${currentSubgoal || 'System maintenance'}`);

            selectedAgent.status = "RUNNING";
            setAgents([...agents]);

            // 4. Execute agent with enhanced context
            const enhancedInput = {
                cycle: cycles,
                subgoal: currentSubgoal,
                systemHealth: metaOptimizer.getSystemHealth(),
                activeGoals: goalEngine.getActiveGoals(),
                collaborationMode: true
            };

            const response: EnhancedAgentResponse = await selectedAgent.runner({
                input: enhancedInput
            });

            selectedAgent.status = "IDLE";
            selectedAgent.lastAction = response.message || response.output || 'Task completed';

            const logEntry = {
                agent: selectedAgent.name,
                action: currentSubgoal || "Autonomous execution",
                result: response.message || response.output || 'Completed',
                cycle: cycles,
                timestamp: new Date().toISOString()
            };

            setLogs(prev => {
                const newLogs = [...prev, logEntry];
                // Store logs for meta-analysis
                localStorage.setItem('deepLoopLogs', JSON.stringify(newLogs.slice(-100)));
                return newLogs;
            });

            // 5. Agent handoff and collaboration chains
            if (response.nextAgent && response.shouldContinue !== false) {
                handoffCount++;
                collaborationChains++;
                
                console.log(`[COLLABORATION] ${selectedAgent.name} → ${response.nextAgent}`);
                
                const nextAgent = agents.find(a => a.name === response.nextAgent);
                if (nextAgent) {
                    const handoffResponse = await executeAgentHandoff(
                        selectedAgent, 
                        nextAgent, 
                        response, 
                        enhancedInput,
                        setLogs
                    );

                    // Chain can continue if next agent also specifies handoff
                    if (handoffResponse.nextAgent && collaborationChains < 3) {
                        await executeCollaborationChain(
                            agents, 
                            handoffResponse, 
                            enhancedInput, 
                            setLogs, 
                            collaborationChains
                        );
                    }
                }
            }

            // 6. Update system metrics
            const systemHealth = metaOptimizer.getSystemHealth();
            setKpis(prev => ({
                ...prev,
                cycles,
                handoffs: handoffCount,
                collaborationChains,
                systemHealth: systemHealth.avgPriority,
                activeGoals: goalEngine.getActiveGoals().length,
                loopSpeed: config.loopDelayMs
            }));

            setAgents([...agents]);

        } catch (error) {
            console.error(`[DEEP LOOP ERROR] Cycle ${cycles}:`, error);
            
            setLogs(prev => [...prev, {
                agent: 'System',
                action: 'Error Recovery',
                result: `Recovered from error: ${error.message}`,
                cycle: cycles
            }]);
        }

        if (config.maxCycles && cycles >= config.maxCycles) {
            stopDeepAutonomousLoop();
        }
    }, config.loopDelayMs);
};

async function executeAgentHandoff(
    fromAgent: any, 
    toAgent: any, 
    response: EnhancedAgentResponse, 
    context: any,
    setLogs: Function
): Promise<EnhancedAgentResponse> {
    try {
        toAgent.status = "RUNNING";
        
        const handoffInput = {
            ...context,
            handoff: true,
            fromAgent: fromAgent.name,
            previousOutput: response.message || response.output,
            previousData: response.data
        };

        const handoffResponse = await toAgent.runner({ input: handoffInput });
        
        toAgent.status = "IDLE";
        toAgent.lastAction = handoffResponse.message || handoffResponse.output || 'Handoff completed';

        setLogs(prev => [...prev, {
            agent: toAgent.name,
            action: `Handoff from ${fromAgent.name}`,
            result: handoffResponse.message || handoffResponse.output || 'Completed',
            timestamp: new Date().toISOString()
        }]);

        return handoffResponse;
    } catch (error) {
        console.error(`[HANDOFF ERROR] ${fromAgent.name} → ${toAgent.name}:`, error);
        return { success: false, message: `Handoff failed: ${error.message}` };
    }
}

async function executeCollaborationChain(
    agents: any[], 
    response: EnhancedAgentResponse, 
    context: any, 
    setLogs: Function, 
    chainLength: number
): Promise<void> {
    if (chainLength >= 3 || !response.nextAgent) return;

    const nextAgent = agents.find(a => a.name === response.nextAgent);
    if (!nextAgent) return;

    console.log(`[CHAIN] Collaboration chain ${chainLength + 1}: ${response.nextAgent}`);

    const chainResponse = await executeAgentHandoff(
        { name: 'ChainAgent' }, 
        nextAgent, 
        response, 
        context, 
        setLogs
    );

    if (chainResponse.nextAgent) {
        await executeCollaborationChain(agents, chainResponse, context, setLogs, chainLength + 1);
    }
}

function routeSubgoalToAgent(subgoal: string, agents: any[]): any | null {
    const subgoalLower = subgoal.toLowerCase();
    
    if (subgoalLower.includes('research') || subgoalLower.includes('analyze')) {
        return agents.find(a => a.name.includes('Research') || a.name.includes('Analysis'));
    }
    if (subgoalLower.includes('strategy') || subgoalLower.includes('plan')) {
        return agents.find(a => a.name.includes('Strategic') || a.name.includes('Planning'));
    }
    if (subgoalLower.includes('collaboration') || subgoalLower.includes('coordination')) {
        return agents.find(a => a.name.includes('Collaboration') || a.name.includes('Coordination'));
    }
    if (subgoalLower.includes('memory') || subgoalLower.includes('knowledge')) {
        return agents.find(a => a.name.includes('Memory') || a.name.includes('Learning'));
    }
    
    return null;
}

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
        optimizer: metaOptimizer.getSystemHealth(),
        goals: goalEngine.getActiveGoals()
    };
};
