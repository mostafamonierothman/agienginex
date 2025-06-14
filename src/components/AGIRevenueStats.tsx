
import React from "react";

interface AGIRevenueStatsProps {
  revenue: number;
  target: number;
  deals: number;
  leads: number;
  velocity: number;
}

const percentToTarget = (revenue: number, target: number) =>
  Math.min(100, (revenue / target) * 100).toFixed(2);

export const AGIRevenueStats: React.FC<AGIRevenueStatsProps> = ({
  revenue,
  target,
  deals,
  leads,
  velocity,
}) => (
  <div className="bg-purple-50 border border-purple-200 rounded p-3 mt-3 text-xs">
    <div className="font-bold mb-2 text-purple-700">💸 AGI Business Performance</div>
    <div>Revenue: <span className="font-bold">${revenue.toLocaleString()}</span></div>
    <div>Deals Closed: <span className="font-bold">{deals}</span></div>
    <div>Leads Generated: <span className="font-bold">{leads}</span></div>
    <div>Revenue Velocity: <span className="font-bold">${velocity.toLocaleString()}/mo</span></div>
    <div>Progress to $1T: <span className="font-bold">{percentToTarget(revenue, target)}%</span></div>
    <div className="h-1 w-full bg-purple-200 rounded mt-2">
      <div
        className="h-1 bg-purple-500 rounded"
        style={{ width: `${percentToTarget(revenue, target)}%` }}
      />
    </div>
  </div>
);
