
'use server';

import { diagnoseTechIssue, type DiagnoseTechIssueOutput } from '@/ai/flows/diagnose-tech-issue';
import { z } from 'zod';

const diagnoseIssueSchema = z.object({
  deviceType: z.string().min(1, 'Device type is required.'),
  issueDescription: z.string().min(10, 'Issue description must be at least 10 characters to provide enough context for diagnosis.'),
});

export interface DiagnoseFormState {
  message: string | null;
  fields?: Record<string, string[] | undefined>; // Updated to match ZodError.flatten().fieldErrors
  diagnosis?: DiagnoseTechIssueOutput;
  success: boolean;
}

export async function handleDiagnoseIssue(
  prevState: DiagnoseFormState,
  formData: FormData
): Promise<DiagnoseFormState> {
  const validatedFields = diagnoseIssueSchema.safeParse({
    deviceType: formData.get('deviceType'),
    issueDescription: formData.get('issueDescription'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data. Please check the fields below.',
      fields: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const diagnosis = await diagnoseTechIssue(validatedFields.data);
    if (!diagnosis || (diagnosis.possibleCauses.length === 0 && diagnosis.suggestedSolutions.length === 0)) {
      return {
        message: "We couldn't diagnose the issue with the provided information. Please try to be more specific or rephrase your problem.",
        success: false, // Indicate that diagnosis itself wasn't fruitful
      };
    }
    return {
      message: 'Diagnosis complete.',
      diagnosis,
      success: true,
    };
  } catch (error) {
    console.error('Error diagnosing issue:', error);
    return {
      message: 'An unexpected error occurred while diagnosing the issue. Please try again later.',
      success: false,
    };
  }
}
