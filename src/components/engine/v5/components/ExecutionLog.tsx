
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Target, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { realBusinessExecutor } from '@/agents/RealBusinessExecutor';

interface ExecutionEntry {
  type: string;
  description: string;
  status: string;
  revenue_potential: number;
  actual_revenue: number;
  timestamp: string;
  result?: any;
}

const ExecutionLog = () => {
  const [executions, setExecutions] = useState<ExecutionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadExecutionHistory = async () => {
    try {
      setIsLoading(true);
      const history = await realBusinessExecutor.getExecutionHistory();
      setExecutions(history);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load execution history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExecutionHistory();
    
    // Refresh every 5 seconds to show new executions
    const interval = setInterval(loadExecutionHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    loadExecutionHistory();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-400" />
            Real Business Execution Log
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {executions.length} tasks
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading execution history...
            </div>
          ) : executions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No business tasks executed yet.</p>
              <p className="text-sm mt-1">Start executing real business tasks to see them here!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {executions.map((execution, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(execution.status)}
                      <Badge className={`text-xs ${getStatusColor(execution.status)}`}>
                        {execution.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                        {execution.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(execution.timestamp)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {execution.description}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-400" />
                      <span className="text-muted-foreground">Potential:</span>
                      <span className="text-blue-400 font-medium">
                        ${execution.revenue_potential?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-400" />
                      <span className="text-muted-foreground">Actual:</span>
                      <span className="text-green-400 font-medium">
                        ${execution.actual_revenue?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>

                  {execution.result && execution.result.next_steps && (
                    <div className="mt-3 pt-2 border-t border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">Next Steps:</div>
                      <ul className="text-xs text-foreground space-y-1">
                        {execution.result.next_steps.slice(0, 3).map((step: string, stepIndex: number) => (
                          <li key={stepIndex} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExecutionLog;
