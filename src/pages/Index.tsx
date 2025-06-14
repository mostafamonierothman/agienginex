import React from "react";
import LeadTestDashboard from "@/components/LeadTestDashboard";
import EngineXDashboard from "@/components/EngineXDashboard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      <LeadTestDashboard />
      <EngineXDashboard />
      <div className="my-8">
        <Button asChild>
          <Link to="/chatgpt-import">Import ChatGPT Conversations</Link>
        </Button>
      </div>
    </div>
  );
}
