'use server';

/**
 * @fileOverview Analyzes a wound image and provides details on its characteristics and severity.
 *
 * - analyzeWoundImage - A function that handles the wound image analysis process.
 * - AnalyzeWoundImageInput - The input type for the analyzeWoundImage function.
 * - AnalyzeWoundImageOutput - The return type for the analyzeWoundImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWoundImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a wound, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeWoundImageInput = z.infer<typeof AnalyzeWoundImageInputSchema>;

const AnalyzeWoundImageOutputSchema = z.object({
  woundDescription: z.string().describe('A detailed description of the wound, including characteristics like color, size, depth, and any signs of infection.'),
  severity: z.string().describe('An assessment of the wound severity (e.g., minor, moderate, severe).'),
  recommendations: z.string().describe('Initial recommendations for wound care, such as cleaning, dressing, and when to seek professional medical attention.'),
});
export type AnalyzeWoundImageOutput = z.infer<typeof AnalyzeWoundImageOutputSchema>;

export async function analyzeWoundImage(input: AnalyzeWoundImageInput): Promise<AnalyzeWoundImageOutput> {
  return analyzeWoundImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWoundImagePrompt',
  input: {schema: AnalyzeWoundImageInputSchema},
  output: {schema: AnalyzeWoundImageOutputSchema},
  prompt: `You are an expert medical assistant specializing in wound care.

You will use this information to analyze the wound, and its severity. You will provide initial recommendations for wound care, such as cleaning and dressing.

Analyze the following wound image:

{{media url=photoDataUri}}
`,
});

const analyzeWoundImageFlow = ai.defineFlow(
  {
    name: 'analyzeWoundImageFlow',
    inputSchema: AnalyzeWoundImageInputSchema,
    outputSchema: AnalyzeWoundImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
