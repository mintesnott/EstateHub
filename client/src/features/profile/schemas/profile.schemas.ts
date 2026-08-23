import { z } from "zod";

export const updateClientProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),

    phone: z
        .string()
        .regex(/^\+251[79]\d{8}$/, "Phone number must start with +2517 or +2519 followed by 8 digits")
        .nullable()
        .optional(),

    profileImage: z
      .string()
      .nullable()
      .optional(),

    preferredCity: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .nullable()
      .optional(),

    preferredType: z
      .enum([
        "APARTMENT",
        "HOUSE",
        "VILLA",
        "CONDO",
        "COMMERCIAL",
        "LAND",
      ])
      .nullable()
      .optional(),

    maxBudget: z
      .number()
      .positive(
        "Maximum budget must be greater than 0",
      )
      .nullable()
      .optional(),

    minBedrooms: z
      .number()
      .int()
      .nonnegative(
        "Minimum bedrooms cannot be negative",
      )
      .nullable()
      .optional(),

    minBathrooms: z
      .number()
      .int()
      .nonnegative(
        "Minimum bathrooms cannot be negative",
      )
      .nullable()
      .optional(),

    preApprovedMortgage: z
      .boolean()
      .optional(),
  })
  .strict();

export type UpdateClientProfileInput = z.infer<
  typeof updateClientProfileSchema
>;