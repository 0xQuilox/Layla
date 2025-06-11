'use client';

import { useState } from 'react';
import { IssueReportForm } from '@/components/issue-report-form';
import { SolutionDisplay } from '@/components/solution-display';
import type { DiagnoseFormState } from '@/app/actions';
import type { DiagnoseTechIssueOutput } from '@/ai/flows/diagnose-tech-issue';
import Image from 'next/image';

export default function HomePage() {
  const [diagnosis, setDiagnosis] = useState<DiagnoseTechIssueOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Not strictly needed with useFormStatus but can be useful

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
          <Image 
            src="https://placehold.co/240x120.png" 
            alt="Layla AI Assistant" 
            width={240} 
            height={120} 
            className="mx-auto mb-4 sm:mb-6 rounded-xl shadow-xl border-2 border-primary/30"
            data-ai-hint="futuristic AI"
            priority
          />
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 leading-relaxed max-w-3xl mx-auto px-2">
            Facing a tech hiccup? Describe your issue and let Layla, your AI-powered assistant, guide you to a solution.
          </p>
        </section>
        
        <IssueReportForm onDiagnosisResult={handleNewDiagnosisResult} />

        {diagnosis && (
          <SolutionDisplay diagnosis={diagnosis} />
        )}
      </div>
    </div>
  );
}
