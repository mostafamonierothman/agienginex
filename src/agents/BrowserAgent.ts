
import { AgentContext, AgentResponse } from '@/types/AgentTypes';
// Removed: import { Page } from 'puppeteer';
import { chromium } from 'playwright';  // Only need 'playwright', not 'puppeteer'
import { supabase } from '@/integrations/supabase/client';

export class BrowserAgent {
  private browser: any;
  private page: any = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
  }

  async goTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    await this.page.goto(url);
    await this.recordEvent({ action: 'go_to_url', url });
  }

  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    await this.page.click(selector);
    await this.recordEvent({ action: 'click_element', selector });
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    await this.page.type(selector, text);
    await this.recordEvent({ action: 'type_text', selector, text });
  }

  async getContent(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    const content = await this.page.content();
    await this.recordEvent({ action: 'get_page_content' });
    return content;
  }

  async getTitle(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    const title = await this.page.title();
    await this.recordEvent({ action: 'get_page_title' });
    return title;
  }

  async evaluate(jsExpression: string): Promise<any> {
    if (!this.page) {
      throw new Error('Browser page is not initialized.');
    }
    const result = await this.page.evaluate(jsExpression);
    await this.recordEvent({ action: 'evaluate_js', jsExpression });
    return result;
  }

  async recordEvent(event: any): Promise<void> {
    try {
      await supabase
        .from('api.supervisor_queue' as any)
        .insert([{ ...event, timestamp: new Date().toISOString() }]);
    } catch (e) {
      console.error('Failed to record event:', e);
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export async function BrowserAgentRunner(context: AgentContext): Promise<AgentResponse> {
  const browserAgent = new BrowserAgent();
  try {
    if (context.input?.url) {
      await browserAgent.goTo(context.input.url);
    }

    // Example actions (can be extended based on context)
    if (context.input?.clickSelector) {
      await browserAgent.click(context.input.clickSelector);
    }

    const content = await browserAgent.getContent();
    const title = await browserAgent.getTitle();

    return {
      success: true,
      message: `BrowserAgent: Title - ${title}, Content length - ${content.length}`,
      data: { title, contentLength: content.length },
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      message: `BrowserAgent error: ${error.message}`
    };
  } finally {
    await browserAgent.close();
  }
}
