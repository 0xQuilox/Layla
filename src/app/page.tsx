
'use client';

import { useState } from 'react';
import { IssueReportForm } from '@/components/issue-report-form';
import { SolutionDisplay } from '@/components/solution-display';
import type { DiagnoseFormState } from '@/app/actions';
import type { DiagnoseTechIssueOutput } from '@/ai/flows/diagnose-tech-issue';

export default function HomePage() {
  const [diagnosis, setDiagnosis] = useState<DiagnoseTechIssueOutput | null>(null);
  const [_isLoading, setIsLoading] = useState(false); // Not strictly needed with useFormStatus but can be useful

  const handleNewDiagnosisResult = (result: DiagnoseFormState) => {
    if (result.success && result.diagnosis) {
      setDiagnosis(result.diagnosis);
    } else {
      // If not successful, or no diagnosis, clear previous results.
      // The message will be handled by toast in the form component.
      setDiagnosis(null);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 sm:py-10">
      <div className="w-full max-w-4xl space-y-10 sm:space-y-16">
        <section className="text-center space-y-4 sm:space-y-6">
          <svg
            width="150"
            height="75"
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4 sm:mb-6"
            aria-label="Medira Logo"
          >
            <title>Medira Logo</title>
            <path d="M15 45L15 5L35 30L55 5L55 45" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M45 45L45 5L65 30L85 5L85 45" stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          </svg>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-3xl mx-auto px-2">
            Facing a tech hiccup? Describe your issue and let Medira, your AI-powered assistant, guide you to a solution.
          </p>
        </section>
        
        <IssueReportForm onDiagnosisResult={handleNewDiagnosisResult} setIsLoading={setIsLoading} />

        {diagnosis && (
          <SolutionDisplay diagnosis={diagnosis} />
        )}
      </div>
    </div>
  );
}
