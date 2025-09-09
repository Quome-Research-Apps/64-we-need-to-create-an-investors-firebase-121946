import { z } from 'zod';

export const AssetSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  assetName: z.string().min(1, "Asset name is required."),
  assetType: z.enum(["Stock", "Bond", "Mutual Fund", "Real Estate", "Crypto", "Other"], {
    errorMap: () => ({ message: "Please select an asset type." }),
  }),
  quantity: z.coerce.number().positive("Quantity must be a positive number."),
  costBasis: z.coerce.number().positive("Cost basis must be a positive number."),
  currentMarketValue: z.number().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const ClarificationNeededSchema = z.object({
  assetName: z.string(),
  missingDetails: z.array(z.string()),
});

export const AssessmentResultsSchema = z.object({
  overallAssessment: z.string(),
  clarificationNeeded: z.array(ClarificationNeededSchema),
});

export type AssessmentResults = z.infer<typeof AssessmentResultsSchema>;
