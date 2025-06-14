
import React from "react";
import { AGIFeatureAssessment } from "@/agi/AGIFeatureAssessment";
import { AGISystemAssessmentResult } from "@/agi/AGISystemAssessment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AGIChatAssessmentPanel({ assessment }: { assessment: AGISystemAssessmentResult & {modelsCompared?: any[]} }) {
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
              {Object.entries(assessment.scores).map(([key, val]) => (
                <li key={key}>
                  {key.replace(/([A-Z])/g, " $1")}: <span className="font-bold text-white">{val}/100</span>
                </li>
              ))}
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
            <div className="mb-2 font-semibold text-fuchsia-300">AGI System Model Comparison</div>
            <table className="w-full text-xs text-fuchsia-100">
              <thead>
                <tr>
                  <th className="pr-2 text-left font-semibold">Model</th>
                  <th className="text-right font-semibold">Score (%)</th>
                </tr>
              </thead>
              <tbody>
                {(assessment.modelsCompared ?? []).map((model: any, idx: number) => (
                  <tr key={model.name} className={idx === 0 ? "font-bold text-green-300" : ""}>
                    <td className="pr-2">{model.name}</td>
                    <td className="text-right">{model.score}</td>
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
