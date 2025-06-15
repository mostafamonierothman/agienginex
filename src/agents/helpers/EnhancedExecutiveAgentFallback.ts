
export function getFallbackActionPlan(data: any) {
  return {
    summary: "Immediate lead generation and revenue plan using connected systems",
    immediateActions: [
      {
        priority: 1,
        action: "Deploy 25 lead generation agents targeting medical tourism prospects",
        system: "Hunter API + Supabase",
        timeframe: "30 minutes",
        revenueImpact: "$2,500 potential",
        implementation: "Execute emergency lead generation with Hunter API integration"
      },
      {
        priority: 2,
        action: "Launch personalized email campaign to existing leads",
        system: "Resend + OpenAI + Supabase",
        timeframe: "45 minutes",
        revenueImpact: "$1,000 potential",
        implementation: "Use OpenAI to personalize emails for current database leads"
      },
      {
        priority: 3,
        action: "Create high-converting landing page with PayPal integration",
        system: "Cloudflare + PayPal",
        timeframe: "2 hours",
        revenueImpact: "$5,000 potential",
        implementation: "Deploy optimized conversion page on edge network"
      }
    ],
    revenueProjections: {
      today: "$500-1,500",
      week: "$5,000-10,000",
      month: "$25,000-50,000"
    },
    keyMetrics: ["Lead conversion rate", "Email open rate", "Payment completion rate"]
  };
}
