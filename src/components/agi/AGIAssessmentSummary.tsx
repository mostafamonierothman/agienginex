
import React from "react";
import { AGISystemAssessmentPanel } from "./AGISystemAssessmentPanel";
import { AGISystemAssessmentResult } from "@/agi/AGISystemAssessment";

export function AGIAssessmentSummary({ assessment }: { assessment: AGISystemAssessmentResult }) {
  return (
    <div className="mt-4">
      <AGISystemAssessmentPanel assessment={assessment} />
    </div>
  );
}
