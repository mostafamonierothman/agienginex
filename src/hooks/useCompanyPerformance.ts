
// This hook manages performance state for the selected business, using only real data updates

import { useState } from "react";

type Performance = {
  revenue: number;
  deals: number;
  leads: number;
  velocity: number;
};

const DEFAULT_PERFORMANCE = {
  revenue: 0,
  deals: 0,
  leads: 0,
  velocity: 0,
};

export function useCompanyPerformance(initialCompany: "medical_tourism" | "health_consultancy" = "medical_tourism") {
  const [company, setCompany] = useState<"medical_tourism" | "health_consultancy">(initialCompany);
  const [performanceMap, setPerformanceMap] = useState<{ [key: string]: Performance }>({
    medical_tourism: { ...DEFAULT_PERFORMANCE },
    health_consultancy: { ...DEFAULT_PERFORMANCE },
  });

  function setPerformance(perf: Partial<Performance>) {
    setPerformanceMap(prev => ({
      ...prev,
      [company]: { ...prev[company], ...perf }
    }));
  }

  function switchCompany(next: "medical_tourism" | "health_consultancy") {
    setCompany(next);
  }

  return {
    company,
    setCompany: switchCompany,
    performance: performanceMap[company],
    setPerformance,
    performanceMap,
    setPerformanceMap
  };
}
