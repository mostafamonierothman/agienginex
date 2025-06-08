
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Send, Mail, MessageSquare, Loader2, Database, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { fastAPIService } from '@/services/FastAPIService';

const AGIDashboard = () => {
  const [nextMove, setNextMove] = useState('');
  const [opportunity, setOpportunity] = useState('');
  const [loading, setLoading] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');

  const fetchNextMove = async () => {
    setLoading(true);
    console.log('🚀 Fetching next move from AGIengineX...');
    
    try {
      const result = await fastAPIService.getNextMove();
      setNextMove(result);
      
      toast({
        title: "✅ Next Move Fetched",
        description: "Successfully retrieved from AGIengineX Edge Function",
      });
    } catch (error) {
      console.error('❌ Error fetching next move:', error);
      toast({
        title: "Error",
        description: "Failed to fetch next move from AGIengineX",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunity = async () => {
    setLoading(true);
    console.log('🚀 Fetching opportunity from AGIengineX...');
    
    try {
      const result = await fastAPIService.getOpportunity();
      setOpportunity(result);
      
      toast({
        title: "✅ Opportunity Fetched",
        description: "Successfully retrieved from AGIengineX Edge Function",
      });
    } catch (error) {
      console.error('❌ Error fetching opportunity:', error);
      toast({
        title: "Error",
        description: "Failed to fetch opportunity from AGIengineX",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async (agentName: string) => {
    setLoading(true);
    console.log(`🚀 Running agent: ${agentName}`);
    
    try {
      const result = await fastAPIService.runAgent(agentName, null);
      
      if (agentName === 'next_move_agent') {
        setNextMove(result.result);
      } else if (agentName === 'opportunity_agent') {
        setOpportunity(result.result);
      }
      
      toast({
        title: `✅ Agent ${agentName} Completed`,
        description: `Execution time: ${result.execution_time}ms`,
      });
    } catch (error) {
      console.error(`❌ Error running agent ${agentName}:`, error);
      toast({
        title: "Error",
        description: `Failed to run agent ${agentName}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendToTelegram = async () => {
    if (!telegramBotToken || !telegramChatId) {
      toast({
        title: "Missing Configuration",
        description: "Please provide Telegram bot token and chat ID",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📱 Sending to Telegram...');
      const message = nextMove || opportunity || 'AGIengineX system active';
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🚀 AGIengineX Update: ${message}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to send to Telegram');

      toast({
        title: "✅ Sent to Telegram",
        description: "Message sent successfully",
      });
    } catch (error) {
      console.error('❌ Error sending to Telegram:', error);
      toast({
        title: "Error",
        description: "Failed to send message to Telegram",
        variant: "destructive",
      });
    }
  };

  const sendToGmail = async () => {
    if (!zapierWebhookUrl) {
      toast({
        title: "Missing Configuration",
        description: "Please provide Zapier webhook URL for Gmail",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('📧 Sending to Gmail via Zapier...');
      const message = nextMove || opportunity || 'AGIengineX system active';
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          message: message,
          email: 'mostafamonier13@gmail.com',
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "✅ Sent to Gmail",
        description: "Email sent successfully via Zapier webhook",
      });
    } catch (error) {
      console.error('❌ Error sending to Gmail:', error);
      toast({
        title: "Error",
        description: "Failed to send email via Zapier",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Dashboard Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            AGIengineX Control Dashboard - Supabase Edge Functions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={fetchNextMove} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Get Next Move
                </>
              )}
            </Button>

            <Button 
              onClick={fetchOpportunity} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Get Opportunity
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => runAgent('next_move_agent')} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Next Move Agent
                </>
              )}
            </Button>

            <Button 
              onClick={() => runAgent('opportunity_agent')} 
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Opportunity Agent
                </>
              )}
            </Button>
          </div>

          {nextMove && (
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Next Move Result</h3>
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  ✅ SUCCESS
                </Badge>
              </div>
              <div className="text-white text-sm bg-slate-800 p-3 rounded">
                {nextMove}
              </div>
            </div>
          )}

          {opportunity && (
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Opportunity Result</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  ✅ SUCCESS
                </Badge>
              </div>
              <div className="text-white text-sm bg-slate-800 p-3 rounded">
                {opportunity}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telegram Configuration */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Telegram Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Telegram Bot Token"
              type="password"
              value={telegramBotToken}
              onChange={(e) => setTelegramBotToken(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Chat ID"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button 
              onClick={sendToTelegram} 
              disabled={!nextMove && !opportunity}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Telegram
            </Button>
          </CardContent>
        </Card>

        {/* Gmail Configuration */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-400" />
              Gmail Setup (via Zapier)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Zapier Webhook URL"
              type="password"
              value={zapierWebhookUrl}
              onChange={(e) => setZapierWebhookUrl(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button 
              onClick={sendToGmail} 
              disabled={!nextMove && !opportunity}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send to Gmail
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-400 space-y-2">
            <h4 className="text-white font-medium mb-3">🚀 AGIengineX Edge Functions Setup:</h4>
            <p>• <strong>Backend:</strong> Running on Supabase Edge Functions (serverless)</p>
            <p>• <strong>Database:</strong> Agent memory stored in Supabase tables</p>
            <p>• <strong>Telegram:</strong> Create a bot via @BotFather, get the token and your chat ID</p>
            <p>• <strong>Gmail:</strong> Create a Zapier webhook that sends emails</p>
            <p>• <strong>Performance:</strong> Sub-second response times with persistent memory</p>
            <p>• <strong>Cost:</strong> No external hosting costs - runs on Supabase infrastructure</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIDashboard;
