
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onDealClosed?: (revenue: number) => void;
}

export const AutonomousSalesAgentPanel: React.FC<Props> = ({ onDealClosed }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | string>(null);
  const [dealsClosed, setDealsClosed] = useState(0);

  const closeDeal = async () => {
    setLoading(true);
    setStatus("🤖 Negotiating with client, generating contract, closing deal...");
    // Simulate backend agent
    setTimeout(() => {
      const revenue = Math.round(40000 + Math.random() * 60000);
      setDealsClosed(dealsClosed + 1);
      setStatus("✅ Deal closed! Contract sent. Revenue booked: $" + revenue.toLocaleString());
      setLoading(false);
      if (onDealClosed) onDealClosed(revenue);
    }, 2000);
  };

  return (
    <div className="my-3 p-3 bg-green-50 border border-green-300 rounded text-xs flex flex-col gap-2">
      <div className="font-bold text-green-700">🤝 Autonomous Sales Agent</div>
      <div>Empowers AGIengineX to autonomously close deals, negotiate, and generate contracts with clients, booking real revenue with minimal human input.</div>
      <Button disabled={loading} size="sm" className="w-fit bg-green-600 mt-1" onClick={closeDeal}>
        {loading ? "Closing..." : "Close Deal Autonomously"}
      </Button>
      {status && <div className="text-green-700 mt-1">{status}</div>}
      {dealsClosed > 0 && (
        <div className="mt-1">Deals closed this session: <span className="font-bold">{dealsClosed}</span></div>
      )}
    </div>
  );
};
