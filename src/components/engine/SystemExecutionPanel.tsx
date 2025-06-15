
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Play, Activity } from 'lucide-react';
import { unifiedAGI } from '@/agi/UnifiedAGICore';
import { sendChatUpdate } from '@/utils/sendChatUpdate';
import { OrchestratorAgentRunner } from '@/agents/OrchestratorAgent';

export const SystemExecutionPanel = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 10));
    };

    const handleExecutePlan = async () => {
        setIsRunning(true);
        setLogs([]); // Clear logs on new run
        addLog('🚀 Starting full system initialization...');
        await sendChatUpdate('🚀 Starting full system initialization...');

        // 1. Initialize AGI Core
        try {
            addLog('🧠 Initializing AGI Core...');
            await unifiedAGI.start();
            addLog('✅ AGI Core is running.');
            await sendChatUpdate('✅ AGI Core is running.');
            
            // 2. Run Orchestrator Agent to execute the rest of the plan
            addLog('🤖 Activating Orchestrator Agent...');
            await sendChatUpdate('🤖 Activating Orchestrator Agent to execute the system plan...');
            
            const orchestratorResponse = await OrchestratorAgentRunner({
                input: 'Execute full system initialization plan.',
                user_id: 'system_init'
            });
    
            if (orchestratorResponse.success) {
                addLog('✅ Orchestration complete.');
                await sendChatUpdate(`✅ System Plan Execution Complete: ${orchestratorResponse.message}`);
            } else {
                addLog(`❌ Orchestration failed: ${orchestratorResponse.message}`);
                await sendChatUpdate(`❌ System Plan Execution Failed: ${orchestratorResponse.message}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addLog(`💥 Critical Error: ${errorMessage}`);
            await sendChatUpdate(`💥 Critical Error during system initialization: ${errorMessage}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Card className="bg-slate-800/60 border-slate-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Activity />
                    System Execution Plan
                </CardTitle>
                <CardDescription>
                    Initiate the full AGI system based on the latest assessment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleExecutePlan} disabled={isRunning} className="w-full bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    {isRunning ? 'Executing Plan...' : 'Execute Full System Plan'}
                </Button>
                {logs.length > 0 && (
                    <div className="mt-4 bg-black/30 p-3 rounded-md text-xs font-mono text-gray-300 max-h-48 overflow-y-auto">
                        {logs.map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
