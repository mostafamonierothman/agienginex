
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  created_at: string;
}

interface LeadsListProps {
  leads: Lead[];
}

const LeadsList = ({ leads }: LeadsListProps) => {
  if (leads.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-800/60 border-slate-600/50 shadow-xl backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-lg md:text-xl">
          <Users className="text-green-400 w-5 h-5 md:w-6 md:h-6" />
          Recent Leads Generated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/30 shadow-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-white text-base md:text-lg">
                    {lead.first_name} {lead.last_name}
                  </div>
                  <div className="text-gray-200 text-sm md:text-base mt-1">{lead.email}</div>
                  <div className="text-gray-300 text-xs md:text-sm mt-1">{lead.company}</div>
                </div>
                <div className="text-gray-400 text-xs md:text-sm whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsList;
