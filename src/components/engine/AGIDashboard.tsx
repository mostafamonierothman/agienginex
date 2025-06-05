
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Send, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AGIDashboard = () => {
  const [nextMove, setNextMove] = useState('');
  const [loading, setLoading] = useState(false);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');

  const fetchNextMove = async () => {
    setLoading(true);
    console.log('🚀 Fetching next move from AGIengineX...');
    
    try {
      const response = await fetch('https://agienginex-clean.mostafamonier13.workers.dev/next_move', {
        headers: {
          'Authorization': 'Bearer supersecrettoken123',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch next move');
      
      const data = await response.json();
      console.log('✅ AGIengineX next_move response:', data);
      setNextMove(data.next_move);
      
      toast({
        title: "Next Move Fetched",
        description: "Successfully retrieved next move from AGIengineX",
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
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🚀 AGIengineX Next Move: ${nextMove}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to send to Telegram');

      toast({
        title: "Sent to Telegram",
        description: "Message sent successfully to Telegram",
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
      await fetch(zapierWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          next_move: nextMove,
          email: 'mostafamonier13@gmail.com',
          timestamp: new Date().toISOString(),
        }),
      });

      toast({
        title: "Sent to Gmail",
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
            AGIengineX Control Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={fetchNextMove} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fetching Next Move...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Fetch Next Move from AGIengineX
              </>
            )}
          </Button>

          {nextMove && (
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">Next Move Result</h3>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  ✅ SUCCESS
                </Badge>
              </div>
              <div className="text-white text-sm bg-slate-800 p-3 rounded">
                {nextMove}
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
              disabled={!nextMove}
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
              disabled={!nextMove}
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
            <h4 className="text-white font-medium mb-3">Setup Instructions:</h4>
            <p>• <strong>Telegram:</strong> Create a bot via @BotFather, get the token and your chat ID</p>
            <p>• <strong>Gmail:</strong> Create a Zapier webhook that sends emails to mostafamonier13@gmail.com</p>
            <p>• <strong>AGIengineX:</strong> Uses your existing Cloudflare Workers endpoint</p>
            <p>• <strong>Cost:</strong> No Lovable credits used - direct API calls</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AGIDashboard;
