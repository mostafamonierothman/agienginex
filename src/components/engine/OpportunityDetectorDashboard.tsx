
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { opportunityDetector, DetectedOpportunity } from '@/services/OpportunityDetector';
import { telegramService } from '@/services/TelegramNotifications';
import { toast } from '@/hooks/use-toast';

const OpportunityDetectorDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [opportunities, setOpportunities] = useState<DetectedOpportunity[]>([]);
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [isTelegramConfigured, setIsTelegramConfigured] = useState(false);

  useEffect(() => {
    // Load existing Telegram config
    const config = telegramService.loadConfig();
    if (config) {
      setTelegramToken(config.botToken);
      setTelegramChatId(config.chatId);
      setIsTelegramConfigured(true);
    }

    if (isActive) {
      const interval = setInterval(() => {
        setOpportunities(opportunityDetector.getOpportunities());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const startDetector = () => {
    opportunityDetector.start();
    setIsActive(true);
    toast({
      title: "🔍 Opportunity Detector Activated",
      description: "AI is now scanning for high-leverage opportunities",
    });
  };

  const stopDetector = () => {
    opportunityDetector.stop();
    setIsActive(false);
  };

  const configureTelegram = () => {
    if (!telegramToken || !telegramChatId) {
      toast({
        title: "Missing Configuration",
        description: "Please enter both Bot Token and Chat ID",
        variant: "destructive",
      });
      return;
    }

    telegramService.configure({
      botToken: telegramToken,
      chatId: telegramChatId
    });
    setIsTelegramConfigured(true);
    
    toast({
      title: "✅ Telegram Configured",
      description: "Notifications will be sent to your Telegram",
    });
  };

  const implementOpportunity = async (opp: DetectedOpportunity) => {
    opportunityDetector.implementOpportunity(opp.id);
    
    if (isTelegramConfigured) {
      await telegramService.sendOpportunity(`${opp.title}\n\nFirst Action: ${opp.firstAction}\n\nProjected Revenue: €${(opp.projectedRevenue/1000000).toFixed(0)}M`);
    }
    
    toast({
      title: "🚀 Opportunity Implementation Started",
      description: opp.title,
    });
  };

  const getLeverageColor = (score: number) => {
    if (score >= 95) return 'text-purple-400 border-purple-400';
    if (score >= 90) return 'text-green-400 border-green-400';
    if (score >= 85) return 'text-blue-400 border-blue-400';
    return 'text-yellow-400 border-yellow-400';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                🔍 AGI Opportunity Detector
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Autonomous AI scanning for trillion-euro acceleration opportunities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={isActive ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                {isActive ? '🟢 SCANNING' : '🔴 INACTIVE'}
              </Badge>
              {isActive ? (
                <Button onClick={stopDetector} variant="destructive" size="sm">
                  Stop Scanner
                </Button>
              ) : (
                <Button onClick={startDetector} className="bg-purple-600 hover:bg-purple-700" size="sm">
                  Start Scanning
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isTelegramConfigured && (
            <div className="bg-slate-700/50 p-4 rounded border border-slate-600">
              <h3 className="text-white font-medium mb-3">🔔 Configure Telegram Notifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="telegram-token" className="text-gray-400">Bot Token</Label>
                  <Input
                    id="telegram-token"
                    type="password"
                    placeholder="Bot token from @BotFather"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram-chat" className="text-gray-400">Chat ID</Label>
                  <Input
                    id="telegram-chat"
                    placeholder="Your chat ID"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </div>
              <Button onClick={configureTelegram} className="mt-3 bg-blue-600 hover:bg-blue-700">
                Configure Telegram
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Opportunities Detected</div>
              <div className="text-white font-bold text-lg">{opportunities.length}</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">High Leverage (95%+)</div>
              <div className="text-purple-400 font-bold text-lg">
                {opportunities.filter(opp => opp.leverageScore >= 95).length}
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-gray-400 text-sm">Total Revenue Potential</div>
              <div className="text-green-400 font-bold text-lg">
                €{(opportunities.reduce((sum, opp) => sum + opp.projectedRevenue, 0) / 1000000000).toFixed(1)}B
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && opportunities.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">💡 Detected Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-slate-700/50 p-4 rounded border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{opp.title}</div>
                    <Badge variant="outline" className={getLeverageColor(opp.leverageScore)}>
                      {opp.leverageScore.toFixed(0)}% Leverage
                    </Badge>
                  </div>
                  <div className="text-gray-400 text-sm mb-3">{opp.description}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <div>💰 Revenue: €{(opp.projectedRevenue/1000000).toFixed(0)}M</div>
                      <div>🎯 First Action: {opp.firstAction}</div>
                      <div>⏰ Detected: {opp.detectedAt.toLocaleTimeString()}</div>
                    </div>
                    <Button 
                      onClick={() => implementOpportunity(opp)}
                      disabled={opp.status !== 'new'}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                      size="sm"
                    >
                      {opp.status === 'new' ? '🚀 Implement' : '✅ In Progress'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpportunityDetectorDashboard;
