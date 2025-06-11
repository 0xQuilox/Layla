// diagnose-tech-issue.ts
'use server';
/**
 * @fileOverview An AI agent for diagnosing tech issues.
 *
 * - diagnoseTechIssue - A function that handles the tech issue diagnosis process.
 * - DiagnoseTechIssueInput - The input type for the diagnoseTechIssue function.
 * - DiagnoseTechIssueOutput - The return type for the diagnoseTechIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseTechIssueInputSchema = z.object({
  deviceType: z.string().describe('The type of device experiencing the issue (e.g., smartphone, laptop, tablet).'),
  issueDescription: z.string().describe('A detailed description of the tech issue the user is facing.'),
});
export type DiagnoseTechIssueInput = z.infer<typeof DiagnoseTechIssueInputSchema>;

const DiagnoseTechIssueOutputSchema = z.object({
  possibleCauses: z.array(z.string()).describe('An array of possible causes for the described tech issue.'),
  suggestedSolutions: z.array(z.string()).describe('An array of suggested solutions to resolve the tech issue.'),
});
export type DiagnoseTechIssueOutput = z.infer<typeof DiagnoseTechIssueOutputSchema>;

export async function diagnoseTechIssue(input: DiagnoseTechIssueInput): Promise<DiagnoseTechIssueOutput> {
  return diagnoseTechIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseTechIssuePrompt',
  input: {schema: DiagnoseTechIssueInputSchema},
  output: {schema: DiagnoseTechIssueOutputSchema},
  prompt: `You are an AI tech support assistant. A user is describing a tech issue with their {{{deviceType}}}. Based on their description, provide possible causes and suggested solutions.

Issue Description: {{{issueDescription}}}

Format your response as a JSON object with "possibleCauses" and "suggestedSolutions" keys, each containing an array of strings. Be concise and specific in your suggestions and causes.
`,
});

const diagnoseTechIssueFlow = ai.defineFlow(
  {
    name: 'diagnoseTechIssueFlow',
    inputSchema: DiagnoseTechIssueInputSchema,
    outputSchema: DiagnoseTechIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
