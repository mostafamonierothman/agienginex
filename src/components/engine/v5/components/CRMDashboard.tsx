
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Mail, Target, TrendingUp, RefreshCw, ExternalLink } from 'lucide-react';
import { realBusinessExecutor } from '@/agents/RealBusinessExecutor';

const CRMDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    contactedLeads: 0,
    emailsSent: 0,
    emailsOpened: 0
  });

  const loadCRMData = async () => {
    try {
      setIsLoading(true);
      const [leadsData, campaignsData] = await Promise.all([
        realBusinessExecutor.getGeneratedLeads(100),
        realBusinessExecutor.getEmailCampaigns(20)
      ]);
      
      setLeads(leadsData);
      setCampaigns(campaignsData);
      
      // Calculate stats
      const contactedCount = leadsData.filter(lead => lead.status !== 'new').length;
      const totalEmailsSent = campaignsData.reduce((sum, campaign) => sum + (campaign.emails_sent || 0), 0);
      const totalEmailsOpened = campaignsData.reduce((sum, campaign) => sum + (campaign.emails_opened || 0), 0);
      
      setStats({
        totalLeads: leadsData.length,
        contactedLeads: contactedCount,
        emailsSent: totalEmailsSent,
        emailsOpened: totalEmailsOpened
      });
    } catch (error) {
      console.error('Failed to load CRM data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCRMData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadCRMData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-yellow-500 text-white';
      case 'replied': return 'bg-green-500 text-white';
      case 'qualified': return 'bg-purple-500 text-white';
      case 'converted': return 'bg-emerald-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-green-400" />
            Real Business CRM
            <Badge variant="outline" className="text-green-400 border-green-400">
              LIVE DATA
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadCRMData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-muted-foreground">Total Leads</span>
            </div>
            <div className="text-xl font-bold text-blue-400">{stats.totalLeads}</div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Contacted</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">{stats.contactedLeads}</div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Emails Sent</span>
            </div>
            <div className="text-xl font-bold text-green-400">{stats.emailsSent}</div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Opened</span>
            </div>
            <div className="text-xl font-bold text-purple-400">{stats.emailsOpened}</div>
          </div>
        </div>

        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Generated Leads</TabsTrigger>
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <ScrollArea className="h-80">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading leads...
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No leads generated yet.</p>
                  <p className="text-sm mt-1">Run a lead generation task to see results here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">
                            {lead.first_name} {lead.last_name}
                          </h4>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusColor(lead.status)}`}>
                            {lead.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">
                            {lead.source}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Company:</span>
                          <span className="text-foreground ml-1">{lead.company || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Title:</span>
                          <span className="text-foreground ml-1">{lead.job_title || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Industry:</span>
                          <span className="text-foreground ml-1">{lead.industry || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Added:</span>
                          <span className="text-foreground ml-1">{formatDate(lead.created_at)}</span>
                        </div>
                      </div>
                      
                      {lead.linkedin_url && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <a 
                            href={lead.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="campaigns">
            <ScrollArea className="h-80">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No email campaigns yet.</p>
                  <p className="text-sm mt-1">Run an email outreach task to see campaigns here!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{campaign.name}</h4>
                          <p className="text-xs text-muted-foreground">{campaign.subject}</p>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(campaign.status)}`}>
                          {campaign.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="text-center">
                          <div className="text-foreground font-medium">{campaign.emails_sent || 0}</div>
                          <div className="text-muted-foreground">Sent</div>
                        </div>
                        <div className="text-center">
                          <div className="text-foreground font-medium">{campaign.emails_opened || 0}</div>
                          <div className="text-muted-foreground">Opened</div>
                        </div>
                        <div className="text-center">
                          <div className="text-foreground font-medium">{campaign.replies_received || 0}</div>
                          <div className="text-muted-foreground">Replies</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                        Created: {formatDate(campaign.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CRMDashboard;
