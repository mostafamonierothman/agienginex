export interface DetectedOpportunity {
  id: string;
  title: string;
  description: string;
  leverageScore: number;
  firstAction: string;
  projectedRevenue: number;
  detectedAt: Date;
  status: 'new' | 'reviewing' | 'implementing' | 'deployed';
}

class OpportunityDetectorService {
  private opportunities: DetectedOpportunity[] = [];
  private isRunning = false;
  private detectionInterval: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔍 OPPORTUNITY DETECTOR → ACTIVATED');
    
    this.runDetectionCycle();
    this.detectionInterval = setInterval(() => {
      this.runDetectionCycle();
    }, 30000); // Every 30 seconds
  }

  stop(): void {
    this.isRunning = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    console.log('🛑 OPPORTUNITY DETECTOR → STOPPED');
  }

  private runDetectionCycle(): void {
    const opportunityTemplates = [
      {
        title: 'AI-Powered Healthcare SaaS Platform',
        description: 'Create comprehensive healthcare management platform leveraging current MedJourney+ success',
        leverageScore: 95,
        firstAction: 'Launch enterprise healthcare demo portal',
        projectedRevenue: 25000000
      },
      {
        title: 'Billionaire Health Optimization Network',
        description: 'Exclusive ultra-premium health optimization service for ultra-high net worth individuals',
        leverageScore: 98,
        firstAction: 'Connect with Forbes billionaire health contacts',
        projectedRevenue: 100000000
      },
      {
        title: 'Lovable Auto-Deploy Marketplace',
        description: 'Turn AGI auto-deployment capability into SaaS marketplace for businesses',
        leverageScore: 92,
        firstAction: 'Create auto-deploy as a service landing page',
        projectedRevenue: 50000000
      },
      {
        title: 'Nordic Government AI Contract Pipeline',
        description: 'Leverage Sweden success to secure large-scale government AI contracts across Nordic region',
        leverageScore: 88,
        firstAction: 'Submit government tender proposals across Nordic countries',
        projectedRevenue: 75000000
      },
      {
        title: 'AGI Engine X Licensing Program',
        description: 'License the core AGI Engine X technology to Fortune 500 companies',
        leverageScore: 94,
        firstAction: 'Create enterprise licensing deck and pilot program',
        projectedRevenue: 200000000
      }
    ];

    // Simulate AI detection with randomized high-value opportunities
    if (Math.random() > 0.7) { // 30% chance of detecting opportunity
      const template = opportunityTemplates[Math.floor(Math.random() * opportunityTemplates.length)];
      
      const opportunity: DetectedOpportunity = {
        id: crypto.randomUUID(),
        title: template.title,
        description: template.description,
        leverageScore: template.leverageScore + Math.random() * 5 - 2.5, // Slight variation
        firstAction: template.firstAction,
        projectedRevenue: template.projectedRevenue * (0.8 + Math.random() * 0.4), // ±20% variation
        detectedAt: new Date(),
        status: 'new'
      };

      this.opportunities.unshift(opportunity);
      
      // Keep only latest 20 opportunities
      if (this.opportunities.length > 20) {
        this.opportunities = this.opportunities.slice(0, 20);
      }

      console.log(`💡 OPPORTUNITY DETECTED: ${opportunity.title} (${opportunity.leverageScore.toFixed(0)}% leverage)`);
    }
  }

  getOpportunities(): DetectedOpportunity[] {
    return this.opportunities;
  }

  getTopOpportunity(): DetectedOpportunity | null {
    return this.opportunities
      .filter(opp => opp.status === 'new')
      .sort((a, b) => b.leverageScore - a.leverageScore)[0] || null;
  }

  implementOpportunity(id: string): void {
    const opportunity = this.opportunities.find(opp => opp.id === id);
    if (opportunity) {
      opportunity.status = 'implementing';
      console.log(`🚀 IMPLEMENTING OPPORTUNITY: ${opportunity.title}`);
    }
  }
}

export const opportunityDetector = new OpportunityDetectorService();
