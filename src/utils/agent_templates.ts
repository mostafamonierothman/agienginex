
export interface AgentTemplate {
  nameTemplate: string;
  type: string;
  purpose: string;
  config: {
    [key: string]: any;
  };
}

export const AgentTemplates: AgentTemplate[] = [
  {
    nameTemplate: "MarketAgent_",
    type: "External Scanner",
    purpose: "Scan market trends from APIs",
    config: {
      scanInterval: "daily",
      sources: ["newsapi.org", "reddit.com/r/ai", "twitter.com/hashtag/ai"],
      priority: "high"
    }
  },
  {
    nameTemplate: "TrendWatcher_",
    type: "Social Scanner", 
    purpose: "Watch social trends and store in memory",
    config: {
      scanInterval: "hourly",
      platforms: ["Twitter", "Reddit", "Discord"],
      priority: "medium"
    }
  },
  {
    nameTemplate: "IdeaAgent_",
    type: "Goal Generator",
    purpose: "Generate new product ideas",
    config: {
      ideaDomain: "AI startups",
      creativityLevel: "high",
      priority: "high"
    }
  },
  {
    nameTemplate: "InvestorAgent_",
    type: "Investor Insights",
    purpose: "Scan investor news and trends", 
    config: {
      sources: ["TechCrunch", "CB Insights", "VC newsletters"],
      priority: "medium"
    }
  },
  {
    nameTemplate: "DataMiner_",
    type: "Data Collector",
    purpose: "Extract and process data from various sources",
    config: {
      dataTypes: ["market_data", "user_behavior", "competitor_analysis"],
      processingLevel: "advanced",
      priority: "high"
    }
  }
];

export function getRandomTemplate(): AgentTemplate {
  return AgentTemplates[Math.floor(Math.random() * AgentTemplates.length)];
}

export function getTemplateByType(type: string): AgentTemplate | undefined {
  return AgentTemplates.find(template => template.type === type);
}
