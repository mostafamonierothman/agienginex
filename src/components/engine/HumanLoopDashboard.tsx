
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { HumanInTheLoopManager, ApprovalRequest } from '@/utils/human_in_the_loop';
import { toast } from '@/hooks/use-toast';

const HumanLoopDashboard = () => {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      const approvals = await HumanInTheLoopManager.getPendingApprovals('demo_user');
      setPendingApprovals(approvals);
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (requestId: string) => {
    try {
      await HumanInTheLoopManager.approveRequest(requestId, 'demo_user');
      await fetchPendingApprovals();
      
      toast({
        title: "✅ Request Approved",
        description: "The agent action has been approved and will proceed",
      });
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejection = async (requestId: string) => {
    try {
      await HumanInTheLoopManager.rejectRequest(requestId, 'demo_user', 'User rejected');
      await fetchPendingApprovals();
      
      toast({
        title: "❌ Request Rejected",
        description: "The agent action has been rejected",
      });
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const createMockApproval = async () => {
    try {
      const mockRequest: ApprovalRequest = {
        user_id: 'demo_user',
        agent_name: 'LearningAgentV2',
        request_type: 'goal_proposal',
        description: 'Propose new learning goal based on market analysis',
        proposed_action: 'Research emerging AI trends and integrate findings into knowledge base',
        urgency: 'medium',
        status: 'pending'
      };

      await HumanInTheLoopManager.submitForApproval(mockRequest);
      await fetchPendingApprovals();
      
      toast({
        title: "📋 Mock Approval Created",
        description: "A test approval request has been submitted",
      });
    } catch (error) {
      console.error('Failed to create mock approval:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'goal_proposal': return <AlertTriangle className="w-4 h-4" />;
      case 'action_approval': return <CheckCircle className="w-4 h-4" />;
      case 'resource_request': return <User className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-6 w-6 text-orange-400" />
          🧑‍💻 Human-in-the-Loop Control
        </CardTitle>
        <CardDescription className="text-gray-300">
          Approve or reject agent actions requiring human oversight
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
            <span className="text-white font-bold text-xl">{pendingApprovals.length}</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-gray-400 text-sm">Approved Today</span>
            </div>
            <span className="text-white font-bold text-xl">7</span>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-gray-400 text-sm">Rejected Today</span>
            </div>
            <span className="text-white font-bold text-xl">2</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={fetchPendingApprovals}
            disabled={loading}
            variant="outline"
            className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
          >
            <Clock className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={createMockApproval}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Create Test Approval
          </Button>
        </div>

        {/* Pending Approvals */}
        <div>
          <h3 className="text-white font-semibold mb-3">📋 Pending Approvals ({pendingApprovals.length})</h3>
          
          {pendingApprovals.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No pending approvals. All agents are operating autonomously.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="bg-black/30 p-4 rounded-lg border border-orange-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getRequestTypeIcon(approval.request_type)}
                        <h4 className="text-white font-medium">{approval.agent_name}</h4>
                        <Badge className={getUrgencyColor(approval.urgency)}>
                          {approval.urgency}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{approval.description}</p>
                      <p className="text-gray-400 text-xs">{approval.proposed_action}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproval(approval.id!)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejection(approval.id!)}
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HITL Status */}
        <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-orange-400">
            <User className="h-4 w-4" />
            <span className="font-medium">Human-in-the-Loop Active</span>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            Agents will request approval for high-impact actions, ensuring human oversight and control.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HumanLoopDashboard;
