
import React from "react";
import { Badge } from "@/components/ui/badge";

interface LeadCardProps {
  lead: {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    job_title?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    source: string;
    industry?: string | null;
    location?: string | null;
    status:
      | "new"
      | "contacted"
      | "replied"
      | "qualified"
      | "converted"
      | "unsubscribed";
    created_at: string;
    updated_at?: string | null;
  };
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => (
  <div className="bg-slate-700/30 p-4 rounded-lg">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h3 className="text-lg font-semibold text-white">
          {lead.first_name} {lead.last_name}
        </h3>
        <p className="text-gray-300">{lead.email}</p>
      </div>
      <Badge
        className={`${
          lead.status === "new"
            ? "bg-green-500"
            : lead.status === "contacted"
            ? "bg-blue-500"
            : "bg-gray-500"
        } text-white`}
      >
        {lead.status}
      </Badge>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
      <div>
        <span className="text-gray-400">Company: </span>
        <span className="text-white">{lead.company || "N/A"}</span>
      </div>
      <div>
        <span className="text-gray-400">Industry: </span>
        <span className="text-blue-400">{lead.industry || "N/A"}</span>
      </div>
      <div>
        <span className="text-gray-400">Location: </span>
        <span className="text-green-400">{lead.location || "N/A"}</span>
      </div>
      <div>
        <span className="text-gray-400">Source: </span>
        <span className="text-purple-400">{lead.source}</span>
      </div>
    </div>
    <div className="mt-2 text-xs text-gray-400">
      Created: {new Date(lead.created_at).toLocaleString()}
    </div>
  </div>
);

export default LeadCard;

