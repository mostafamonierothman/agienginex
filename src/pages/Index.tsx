import React from "react";
import LeadTestDashboard from "@/components/LeadTestDashboard";
import EngineXDashboard from "@/components/EngineXDashboard";
import ChatGPTImportButton from "@/components/ChatGPTImportButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      <LeadTestDashboard />
      <EngineXDashboard />
      <ChatGPTImportButton />
      <div className="my-4 flex justify-center">
        <Button asChild className="bg-gradient-to-r from-green-600 to-lime-500 text-white font-bold shadow-lg hover:scale-105 transition">
          <Link to="/functional-agi">Unified AGI Core (Experimental)</Link>
        </Button>
      </div>
    </div>
  );
}
