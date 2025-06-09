
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { agentChatBus } from '@/engine/AgentChatBus';

interface HistoryEntry {
  agent_name: string;
  memory_value: string;
  timestamp: string;
}

const SystemContextPanel = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [liveChatCount, setLiveChatCount] = useState(0);

  useEffect(() => {
    const loadHistory = async () => {
      const { data, error } = await supabase
        .from('agent_memory')
        .select('agent_name, memory_value, timestamp')
        .eq('memory_key', 'chat_message')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (!error && data) {
        setHistory(data);
      }
    };

    loadHistory();

    // Subscribe to live chat bus updates
    const unsubscribe = agentChatBus.subscribe(() => {
      setLiveChatCount(agentChatBus.getMessages().length);
    });

    return unsubscribe;
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-600/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          System Memory (Chat History)
          <Badge variant="outline" className="text-cyan-400 border-cyan-400">
            {history.length} stored
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400">
            {liveChatCount} live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {history.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No memory yet. Agents will start building context as they run.</p>
            </div>
          )}
          <div className="space-y-2">
            {history.map((entry, idx) => (
              <div key={idx} className="bg-slate-700/30 rounded p-2 border border-slate-600/20">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-3 w-3 text-blue-400" />
                  <span className="text-blue-400 font-medium text-sm">
                    {entry.agent_name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {entry.memory_value.length > 200 
                    ? `${entry.memory_value.substring(0, 200)}...` 
                    : entry.memory_value
                  }
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SystemContextPanel;
