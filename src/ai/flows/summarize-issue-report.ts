// 'use server'
'use server';

/**
 * @fileOverview Summarizes a detailed issue report to identify key problems and potential solutions.
 *
 * - summarizeIssueReport - A function that summarizes the issue report.
 * - SummarizeIssueReportInput - The input type for the summarizeIssueReport function.
 * - SummarizeIssueReportOutput - The return type for the summarizeIssueReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIssueReportInputSchema = z.object({
  issueReport: z
    .string()
    .describe('A detailed report of the issue, including device type, problem description, and steps to reproduce.'),
});
export type SummarizeIssueReportInput = z.infer<typeof SummarizeIssueReportInputSchema>;

const SummarizeIssueReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the issue report, highlighting the main problem and potential solutions.'),
});
export type SummarizeIssueReportOutput = z.infer<typeof SummarizeIssueReportOutputSchema>;

export async function summarizeIssueReport(input: SummarizeIssueReportInput): Promise<SummarizeIssueReportOutput> {
  return summarizeIssueReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssueReportPrompt',
  input: {schema: SummarizeIssueReportInputSchema},
  output: {schema: SummarizeIssueReportOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing tech support issue reports.

  Please provide a concise summary of the following issue report, highlighting the main problem and potential solutions.

  Issue Report: {{{issueReport}}}
  `,
});

const summarizeIssueReportFlow = ai.defineFlow(
  {
    name: 'summarizeIssueReportFlow',
    inputSchema: SummarizeIssueReportInputSchema,
    outputSchema: SummarizeIssueReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
