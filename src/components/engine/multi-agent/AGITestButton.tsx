
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TestTube } from 'lucide-react';

const AGITestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const runAgent = async (agentName: string, inputData: any) => {
    const response = await fetch("https://agienginex-clean.mostafamonier13.workers.dev/run_agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer supersecrettoken123"
      },
      body: JSON.stringify({
        agent_name: agentName,
        input: inputData
      })
    });

    const data = await response.json();
    console.log("AGIengineX response:", data);
    return data;
  };

  const testRunAgent = async () => {
    setIsLoading(true);
    console.log("🚀 Sending test request to AGIengineX...");

    try {
      const result = await runAgent("next_move_agent", { user_context: "test from Lovable app" });
      console.log("✅ AGIengineX result:", result);
      setTestResult(result);
    } catch (error) {
      console.error("❌ Test failed:", error);
      setTestResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TestTube className="w-5 h-5 text-green-400" />
          🚀 AGIengineX Live Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testRunAgent} 
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          size="lg"
        >
          <Zap className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Testing AGIengineX...' : 'Test AGIengineX 🚀'}
        </Button>

        {testResult && (
          <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Test Result</h3>
              <Badge 
                variant="outline" 
                className={testResult.error ? 'text-red-400 border-red-400' : 'text-green-400 border-green-400'}
              >
                {testResult.error ? '❌ FAILED' : '✅ SUCCESS'}
              </Badge>
            </div>
            
            <div className="text-white text-sm bg-slate-800 p-3 rounded overflow-auto max-h-40">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-400 space-y-1">
          <p>• This calls AGIengineX directly (no Lovable credits used)</p>
          <p>• Check browser console for detailed logs</p>
          <p>• Using Cloudflare Workers endpoint for speed</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AGITestButton;
