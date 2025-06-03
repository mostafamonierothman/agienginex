
export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramNotificationService {
  private config: TelegramConfig | null = null;

  configure(config: TelegramConfig) {
    this.config = config;
    localStorage.setItem('telegram_config', JSON.stringify(config));
  }

  loadConfig(): TelegramConfig | null {
    const saved = localStorage.getItem('telegram_config');
    if (saved) {
      this.config = JSON.parse(saved);
      return this.config;
    }
    return null;
  }

  async sendNotification(message: string): Promise<boolean> {
    if (!this.config) {
      console.warn('Telegram not configured');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      return false;
    }
  }

  async sendNextMove(move: string): Promise<void> {
    await this.sendNotification(`🎯 <b>NEXT MOVE</b>\n${move}`);
  }

  async sendOpportunity(opportunity: string): Promise<void> {
    await this.sendNotification(`💡 <b>OPPORTUNITY DETECTED</b>\n${opportunity}`);
  }

  async sendImpactUpdate(impact: number): Promise<void> {
    await this.sendNotification(`📈 <b>IMPACT UPDATE</b>\nTrillion Path Progress: ${impact.toFixed(2)}%`);
  }
}

export const telegramService = new TelegramNotificationService();
