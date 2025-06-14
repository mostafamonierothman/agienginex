
import React from "react";
import LeadTestDashboard from "@/components/LeadTestDashboard";
import EngineXDashboard from "@/components/EngineXDashboard";
import ChatGPTImportButton from "@/components/ChatGPTImportButton";

export default function Index() {
  return (
    <div>
      <LeadTestDashboard />
      <EngineXDashboard />
      <ChatGPTImportButton />
    </div>
  );
}
