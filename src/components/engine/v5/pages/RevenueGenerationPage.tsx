
import React, { useState, useEffect } from 'react';
import RevenueActivationPanel from '@/components/RevenueActivationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';

interface LeadStats {
  totalLeads: number;
  leadsByIndustry: Record<string, number>;
  potentialRevenue: number;
}

const RevenueGenerationPage = () => {
  const [leadStats, setLeadStats] = useState<LeadStats>({
    totalLeads: 0,
    leadsByIndustry: {},
    potentialRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeadStats = async () => {
    setIsLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('leads')
        .select('industry', { count: 'exact' });

      if (error) {
        console.error('Error fetching lead stats:', error);
        toast({
          title: 'Error fetching lead statistics',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const totalLeads = count || 0;
      const leadsByIndustry: Record<string, number> = {};
      (data || []).forEach((lead) => {
        const industry = lead.industry || 'Unknown';
        leadsByIndustry[industry] = (leadsByIndustry[industry] || 0) + 1;
      });
      
      // Assuming $500 revenue per lead for projection
      const potentialRevenue = totalLeads * 500;

      setLeadStats({
        totalLeads,
        leadsByIndustry,
        potentialRevenue,
      });

    } catch (err) {
      console.error('Client-side error fetching lead stats:', err);
      toast({
        title: 'Client Error',
        description: 'Could not fetch lead statistics.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadStats();
    // Refresh stats every 30 seconds
    const intervalId = setInterval(fetchLeadStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      <RevenueActivationPanel />

      <Card className="bg-slate-800/50 border-slate-600/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-400" />
            Live Revenue & Lead Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-gray-300">Loading statistics...</p>}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-700/50 border-slate-500/30 p-4">
                <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <Users className="h-4 w-4" /> Total Leads Generated
                </CardTitle>
                <p className="text-3xl font-bold text-white">{leadStats.totalLeads}</p>
              </Card>
              <Card className="bg-slate-700/50 border-slate-500/30 p-4">
                <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Est. Potential Revenue
                </CardTitle>
                <p className="text-3xl font-bold text-white">${leadStats.potentialRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">(@ $500/lead)</p>
              </Card>
              <Card className="bg-slate-700/50 border-slate-500/30 p-4">
                <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <Activity className="h-4 w-4" /> Leads by Industry
                </CardTitle>
                {Object.keys(leadStats.leadsByIndustry).length > 0 ? (
                  <ul className="text-sm text-gray-200 mt-1">
                    {Object.entries(leadStats.leadsByIndustry).map(([industry, count]) => (
                      <li key={industry} className="flex justify-between">
                        <span>{industry}:</span>
                        <strong>{count}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 mt-1">No leads with industry data yet.</p>
                )}
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueGenerationPage;
