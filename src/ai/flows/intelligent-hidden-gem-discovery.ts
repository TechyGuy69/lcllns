'use server';
/**
 * @fileOverview An AI agent that analyzes place descriptions to identify 'hidden gems' and assign an 'Authenticity Score'.
 *
 * - analyzePlaceForHiddenGem - A function that handles the hidden gem analysis process.
 * - AnalyzePlaceForHiddenGemInput - The input type for the analyzePlaceForHiddenGem function.
 * - AnalyzePlaceForHiddenGemOutput - The return type for the analyzePlaceForHiddenGem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePlaceForHiddenGemInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the place to be analyzed.'),
});
export type AnalyzePlaceForHiddenGemInput = z.infer<
  typeof AnalyzePlaceForHiddenGemInputSchema
>;

const AnalyzePlaceForHiddenGemOutputSchema = z.object({
  isHiddenGem: z.boolean().describe('Whether the place is classified as a hidden gem.'),
  authenticityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 indicating how authentic and local the place feels, where 100 is highly authentic.'),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the place was classified as a hidden gem (or not) and how the authenticity score was derived, based on keywords and context from the description.'
    ),
});
export type AnalyzePlaceForHiddenGemOutput = z.infer<
  typeof AnalyzePlaceForHiddenGemOutputSchema
>;

export async function analyzePlaceForHiddenGem(
  input: AnalyzePlaceForHiddenGemInput
): Promise<AnalyzePlaceForHiddenGemOutput> {
  return intelligentHiddenGemDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentHiddenGemDiscoveryPrompt',
  input: {schema: AnalyzePlaceForHiddenGemInputSchema},
  output: {schema: AnalyzePlaceForHiddenGemOutputSchema},
  prompt: `You are an expert travel guide specializing in finding unique, calm, and less crowded local spots, often referred to as 'hidden gems'.

Analyze the following place description to determine if it fits the criteria of a 'hidden gem' in India. A hidden gem is typically a place that is:
- Less known to the general tourist population.
- Calm, peaceful, and quiet.
- Reflects local culture and atmosphere.
- Not overly commercialized or crowded.

Based on the description, assign an 'authenticityScore' from 0 (not a hidden gem at all) to 100 (a true hidden gem). Provide 'reasoning' for your classification and score, highlighting keywords and concepts from the description that led to your conclusion.

Place Description: {{{description}}}`,
});

const intelligentHiddenGemDiscoveryFlow = ai.defineFlow(
  {
    name: 'intelligentHiddenGemDiscoveryFlow',
    inputSchema: AnalyzePlaceForHiddenGemInputSchema,
    outputSchema: AnalyzePlaceForHiddenGemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to get output from AI prompt.');
    }
    return output;
  }
);
