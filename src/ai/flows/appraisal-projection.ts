// src/ai/flows/appraisal-projection.ts
'use server';

/**
 * @fileOverview A flow for assessing investment holdings and identifying details that need clarification.
 *
 * - assessHoldings - A function that assesses investment holdings and identifies details needing clarification.
 * - AssessHoldingsInput - The input type for the assessHoldings function.
 * - AssessHoldingsOutput - The return type for the assessHoldings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssetDetailsSchema = z.object({
  assetName: z.string().describe('The name of the asset.'),
  assetType: z.string().describe('The type of asset (e.g., stock, bond, mutual fund).'),
  quantity: z.number().describe('The number of units held.'),
  costBasis: z.number().describe('The original purchase price of the asset.'),
  currentMarketValue: z.number().optional().describe('The current market value of the asset, if known.'),
});

const AssessHoldingsInputSchema = z.array(AssetDetailsSchema).describe('An array of asset details to be assessed.');
export type AssessHoldingsInput = z.infer<typeof AssessHoldingsInputSchema>;

const ClarificationNeededSchema = z.object({
  assetName: z.string().describe('The name of the asset that needs clarification.'),
  missingDetails: z.array(z.string()).describe('A list of details that are missing or unclear for the asset.'),
});

const AssessmentResultsSchema = z.object({
  overallAssessment: z.string().describe('An overall assessment of the holdings, including potential risks and opportunities.'),
  clarificationNeeded: z.array(ClarificationNeededSchema).describe('An array of assets that need clarification and the details that are missing.'),
});

const AssessHoldingsOutputSchema = AssessmentResultsSchema;
export type AssessHoldingsOutput = z.infer<typeof AssessHoldingsOutputSchema>;

export async function assessHoldings(input: AssessHoldingsInput): Promise<AssessHoldingsOutput> {
  return assessHoldingsFlow(input);
}

const assessHoldingsPrompt = ai.definePrompt({
  name: 'assessHoldingsPrompt',
  input: {schema: AssessHoldingsInputSchema},
  output: {schema: AssessHoldingsOutputSchema},
  prompt: `You are a financial analyst reviewing a user's investment holdings. For each asset, assess whether any details are missing or unclear, such as the current market value. Provide an overall assessment of the holdings, including potential risks and opportunities.

Here are the user's holdings:

{{#each this}}
  Asset Name: {{assetName}}
  Asset Type: {{assetType}}
  Quantity: {{quantity}}
  Cost Basis: {{costBasis}}
  {{#if currentMarketValue}}
    Current Market Value: {{currentMarketValue}}
  {{else}}
    Current Market Value: Unknown
  {{/if}}

{{/each}}

Based on this information, provide an overall assessment and identify any assets that need clarification. Return the output in JSON format.
`,
});

const assessHoldingsFlow = ai.defineFlow(
  {
    name: 'assessHoldingsFlow',
    inputSchema: AssessHoldingsInputSchema,
    outputSchema: AssessHoldingsOutputSchema,
  },
  async input => {
    const {output} = await assessHoldingsPrompt(input);
    return output!;
  }
);
