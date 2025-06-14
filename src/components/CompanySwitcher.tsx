
import React from "react";
import { Button } from "@/components/ui/button";

export interface CompanySwitcherProps {
  company: "medical_tourism" | "health_consultancy";
  onSwitch: (company: "medical_tourism" | "health_consultancy") => void;
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({ company, onSwitch }) => (
  <div className="flex gap-2 mb-1 justify-end">
    <Button
      variant={company === "medical_tourism" ? "default" : "outline"}
      size="sm"
      className="text-xs px-2 py-1 h-6"
      onClick={() => onSwitch("medical_tourism")}
    >
      🏥 Medical Tourism
    </Button>
    <Button
      variant={company === "health_consultancy" ? "default" : "outline"}
      size="sm"
      className="text-xs px-2 py-1 h-6"
      onClick={() => onSwitch("health_consultancy")}
    >
      🩺 Health Consultancy
    </Button>
  </div>
);
