
import React from "react";
import { AGISystemAssessmentResult } from "@/agi/AGISystemAssessment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AGISystemAssessmentPanel({ assessment }: { assessment: AGISystemAssessmentResult }) {
  return (
    <Card className="mb-4 bg-gray-800/80 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          AGI System Assessment
          <span className="ml-auto text-green-400 text-sm">{assessment.overallPercent}% Complete</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1 min-w-0">
            <div className="mb-2 font-semibold text-blue-200">Capability Breakdown</div>
            <ul className="mb-3 ml-5 text-blue-100 text-xs space-y-1">
              <li>Memory: <span className="font-bold text-white">{assessment.scores.memory}/100</span></li>
              <li>Autonomy: <span className="font-bold text-white">{assessment.scores.autonomy}/100</span></li>
              <li>Learning: <span className="font-bold text-white">{assessment.scores.learning}/100</span></li>
              <li>Collaboration: <span className="font-bold text-white">{assessment.scores.collaboration}/100</span></li>
              <li>Self-Reflection: <span className="font-bold text-white">{assessment.scores.selfReflection}/100</span></li>
              <li>System Health: <span className="font-bold text-white">{assessment.scores.systemHealth}/100</span></li>
            </ul>
            {assessment.notes.length > 0 && (
              <div className="mb-2 text-yellow-300 text-xs">
                <div className="font-semibold text-yellow-400">Notes:</div>
                <ul className="ml-5">
                  {assessment.notes.map((note, idx) => (
                    <li key={idx}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="mb-2 font-semibold text-fuchsia-300">AGI Landscape Comparison</div>
            <table className="w-full text-xs text-fuchsia-100">
              <thead>
                <tr>
                  <th className="pr-2 text-left font-semibold">Model</th>
                  <th className="text-right font-semibold">Score (%)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(assessment.comparison).map(([model, val], idx) => (
                  <tr key={model} className={model === "Unified AGI" ? "font-bold text-green-300" : ""}>
                    <td className="pr-2">{model}</td>
                    <td className="text-right">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
