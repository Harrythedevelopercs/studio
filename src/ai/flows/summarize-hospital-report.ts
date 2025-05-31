// Summarizes uploaded hospital reports, extracting key information.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      'The hospital report as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type SummarizeReportInput = z.infer<typeof SummarizeReportInputSchema>;

const SummarizeReportOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the hospital report.'),
});
export type SummarizeReportOutput = z.infer<typeof SummarizeReportOutputSchema>;

export async function summarizeHospitalReport(
  input: SummarizeReportInput
): Promise<SummarizeReportOutput> {
  return summarizeHospitalReportFlow(input);
}

const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {schema: SummarizeReportInputSchema},
  output: {schema: SummarizeReportOutputSchema},
  prompt: `You are an expert medical summarizer. Please summarize the key findings and recommendations from the following hospital report:

{{reportDataUri}}`,
});

const summarizeHospitalReportFlow = ai.defineFlow(
  {
    name: 'summarizeHospitalReportFlow',
    inputSchema: SummarizeReportInputSchema,
    outputSchema: SummarizeReportOutputSchema,
  },
  async input => {
    const {output} = await summarizeReportPrompt(input);
    return output!;
  }
);
