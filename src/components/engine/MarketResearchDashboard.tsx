
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MedicalTourismResearchAgentRunner } from '@/agents/MedicalTourismResearchAgent';
import { AGIConsultancyAgentRunner } from '@/agents/AGIConsultancyAgent';
import { CustomerAcquisitionAgentRunner } from '@/agents/CustomerAcquisitionAgent';
import { toast } from '@/hooks/use-toast';

const MarketResearchDashboard = () => {
  const [isResearching, setIsResearching] = useState(false);
  const [researchResults, setResearchResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const startMarketResearch = async () => {
    setIsResearching(true);
    setProgress(0);
    
    try {
      toast({
        title: "🔍 Market Research Started",
        description: "AGI agents are analyzing markets for MedJourney+ and consultancy opportunities",
      });

      // Phase 1: Medical Tourism Research
      setProgress(20);
      const medicalTourismResult = await MedicalTourismResearchAgentRunner({
        input: { target: 'comprehensive_market_analysis' },
        user_id: 'market_research_dashboard'
      });

      // Phase 2: AGI Consultancy Research
      setProgress(50);
      const agiConsultancyResult = await AGIConsultancyAgentRunner({
        input: { target: 'enterprise_agi_opportunities' },
        user_id: 'market_research_dashboard'
      });

      // Phase 3: Customer Acquisition Strategy
      setProgress(80);
      const customerAcquisitionResult = await CustomerAcquisitionAgentRunner({
        input: { target: 'optimization_strategy' },
        user_id: 'market_research_dashboard'
      });

      setProgress(100);
      
      const combinedResults = {
        medicalTourism: medicalTourismResult.data,
        agiConsultancy: agiConsultancyResult.data,
        customerAcquisition: customerAcquisitionResult.data,
        totalRevenueOpportunity: (medicalTourismResult.data?.revenueOpportunity || 0) + 
                                (agiConsultancyResult.data?.immediateRevenue || 0),
        timeToFirstMillion: 5 // days
      };

      setResearchResults(combinedResults);

      toast({
        title: "✅ Market Research Complete",
        description: `$${(combinedResults.totalRevenueOpportunity / 1000000).toFixed(1)}M revenue opportunity identified`,
      });

    } catch (error) {
      toast({
        title: "❌ Research Error",
        description: "Market research encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsResearching(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                🔍 Market Research & Opportunity Analysis
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                AI-powered market analysis for MedJourney+ and AGI consultancy
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={isResearching ? 'text-yellow-400 border-yellow-400' : 'text-green-400 border-green-400'}>
                {isResearching ? '🔄 RESEARCHING' : '✅ READY'}
              </Badge>
              <Button 
                onClick={startMarketResearch} 
                disabled={isResearching}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isResearching ? 'Researching...' : 'Start Market Research'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {isResearching && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Research Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-gray-500">
                {progress < 30 && "Analyzing medical tourism market..."}
                {progress >= 30 && progress < 60 && "Researching AGI consultancy opportunities..."}
                {progress >= 60 && progress < 90 && "Optimizing customer acquisition strategies..."}
                {progress >= 90 && "Compiling research results..."}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {researchResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical Tourism Opportunity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🏥 MedJourney+ Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Market Size</div>
                  <div className="text-green-400 font-bold text-lg">
                    {formatCurrency(researchResults.medicalTourism?.marketSize || 0)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Cost Savings</div>
                  <div className="text-blue-400 font-bold text-lg">
                    {researchResults.medicalTourism?.egyptCostSavings || 0}%
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Avg Procedure</div>
                  <div className="text-purple-400 font-bold text-lg">
                    {formatCurrency(researchResults.medicalTourism?.avgProcedureValue || 0)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Conversion</div>
                  <div className="text-yellow-400 font-bold text-lg">
                    {researchResults.medicalTourism?.conversionRate || 0}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">High-Value Procedures</h4>
                <div className="flex flex-wrap gap-2">
                  {researchResults.medicalTourism?.highValueProcedures?.map((procedure: string) => (
                    <Badge key={procedure} variant="outline" className="text-green-400 border-green-400">
                      {procedure}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Target Markets</h4>
                <div className="flex flex-wrap gap-2">
                  {researchResults.medicalTourism?.targetMarkets?.map((market: string) => (
                    <Badge key={market} variant="outline" className="text-blue-400 border-blue-400">
                      {market}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AGI Consultancy Opportunity */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                🤖 AGI Consultancy Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Market Size</div>
                  <div className="text-green-400 font-bold text-lg">
                    {formatCurrency(researchResults.agiConsultancy?.agiMarketSize || 0)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">2030 Projection</div>
                  <div className="text-purple-400 font-bold text-lg">
                    {formatCurrency(researchResults.agiConsultancy?.projectedMarketSize || 0)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Avg Contract</div>
                  <div className="text-blue-400 font-bold text-lg">
                    {formatCurrency(researchResults.agiConsultancy?.avgConsultancyContract || 0)}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-3 rounded">
                  <div className="text-gray-400 text-sm">Adoption Rate</div>
                  <div className="text-yellow-400 font-bold text-lg">
                    {researchResults.agiConsultancy?.enterpriseAdoptionRate || 0}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Target Clients</h4>
                <div className="flex flex-wrap gap-2">
                  {researchResults.agiConsultancy?.targetClients?.map((client: string) => (
                    <Badge key={client} variant="outline" className="text-purple-400 border-purple-400">
                      {client}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 p-3 rounded">
                <h4 className="text-blue-400 font-medium mb-1">Unique Positioning</h4>
                <p className="text-gray-300 text-sm">
                  {researchResults.agiConsultancy?.uniquePositioning}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Summary */}
      {researchResults && (
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              💎 Revenue Opportunity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 p-4 rounded text-center">
                <div className="text-gray-400 text-sm">Total Opportunity</div>
                <div className="text-green-400 font-bold text-2xl">
                  {formatCurrency(researchResults.totalRevenueOpportunity)}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded text-center">
                <div className="text-gray-400 text-sm">Medical Tourism</div>
                <div className="text-blue-400 font-bold text-2xl">
                  {formatCurrency(researchResults.medicalTourism?.revenueOpportunity || 0)}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded text-center">
                <div className="text-gray-400 text-sm">AGI Consultancy</div>
                <div className="text-purple-400 font-bold text-2xl">
                  {formatCurrency(researchResults.agiConsultancy?.immediateRevenue || 0)}
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded text-center">
                <div className="text-gray-400 text-sm">Time to $1M</div>
                <div className="text-yellow-400 font-bold text-2xl">
                  {researchResults.timeToFirstMillion} days
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-300">
                🎯 <strong>Path to $1M in 5 days:</strong> Focus on high-value medical tourism procedures 
                while launching AGI consultancy for enterprise clients
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketResearchDashboard;
