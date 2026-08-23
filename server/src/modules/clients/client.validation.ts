import { z } from "zod";

export const updateClientProfileSchema = z
  .object({
    preferredCity: z.string().optional().nullable(),

    preferredType: z
      .enum([
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "CONDO",
        "COMMERCIAL",
        "LAND",
      ])
      .optional()
      .nullable(),

    maxBudget: z
      .number()
      .positive("Maximum budget must be greater than 0")
      .optional()
      .nullable(),

    minBedrooms: z
      .number()
      .int("Minimum bedrooms must be an integer")
      .nonnegative("Minimum bedrooms cannot be negative")
      .optional()
      .nullable(),

    minBathrooms: z
      .number()
      .int("Minimum bathrooms must be an integer")
      .nonnegative("Minimum bathrooms cannot be negative")
      .optional()
      .nullable(),

    preApprovedMortgage: z.boolean().optional(),
  })
  .strict();

export type UpdateClientProfileInput = z.infer<
  typeof updateClientProfileSchema
>;