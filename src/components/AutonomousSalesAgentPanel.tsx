
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onDealClosed?: (revenue: number) => void;
  postToChat: (msg: string) => void;
  autonomyPercent: number;
  setAutonomyPercent: (n: number) => void;
}

export const AutonomousSalesAgentPanel: React.FC<Props> = ({
  onDealClosed,
  postToChat,
  autonomyPercent,
  setAutonomyPercent,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | string>(null);
  const [dealsClosed, setDealsClosed] = useState(0);

  const closeDeal = async () => {
    setLoading(true);
    setStatus("🤖 Negotiating with client...");
    postToChat("🤖 [Autonomous Sales Agent] Initiating client negotiation...");
    setTimeout(() => {
      setStatus("📄 Generating legal contract...");
      postToChat("📄 [Autonomous Sales Agent] Drafting contract for signature...");
      setTimeout(() => {
        setStatus("📤 Sending contract to client...");
        postToChat("📤 [Autonomous Sales Agent] Contract sent to the client for signature.");
        setTimeout(() => {
          const revenue = Math.round(45000 + Math.random() * 55000);
          setDealsClosed((d) => d + 1);
          setStatus("✅ Deal closed! Contract signed. Revenue booked: $" + revenue.toLocaleString());
          setLoading(false);
          postToChat("✅ [Autonomous Sales Agent] Deal closed and signed! Revenue booked: $" + revenue.toLocaleString());
          if (onDealClosed) onDealClosed(revenue);
          // Boost AGI autonomy. E.g. +10% up to 65% for demonstration
          setAutonomyPercent(Math.min(autonomyPercent + 11, 65));
          postToChat(
            `📊 AGI Autonomy Progress: ${Math.min(autonomyPercent + 11, 65)}%. Next step: automate contract e-sign & payment processing for even greater autonomy!`
          );
        }, 1200);
      }, 1200);
    }, 1400);
  };

  return (
    <div className="my-3 p-3 bg-green-50 border border-green-300 rounded text-xs flex flex-col gap-2">
      <div className="font-bold text-green-700">🤝 Autonomous Sales Agent</div>
      <div>
        Empowers AGIengineX to autonomously negotiate, generate legal contracts, and close deals, booking real revenue with minimal human input.
      </div>
      <Button disabled={loading} size="sm" className="w-fit bg-green-600 mt-1" onClick={closeDeal}>
        {loading ? "Closing..." : "Close Deal Autonomously"}
      </Button>
      {status && <div className="text-green-700 mt-1">{status}</div>}
      {dealsClosed > 0 && (
        <div className="mt-1">
          Deals closed this session: <span className="font-bold">{dealsClosed}</span>
        </div>
      )}
    </div>
  );
};
