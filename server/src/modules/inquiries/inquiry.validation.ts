import { z } from "zod";

export const propertyIdParamSchema = z.object({
  propertyId: z.uuid("Invalid property ID format"),
});

export const inquiryIdParamSchema = z.object({
  id: z.uuid("Invalid inquiry ID format"),
});


export const createInquirySchema = z.object({
  purpose: z.enum(["BUY", "RENT"], {
    message: "Inquiry purpose is required",
  }),

  budgetMin: z
    .number()
    .nonnegative("Minimum budget cannot be negative")
    .optional()
    .nullable(),

  budgetMax: z
    .number()
    .nonnegative("Maximum budget cannot be negative")
    .optional()
    .nullable(),

  preferredMoveInDate: z
    .string()
    .datetime()
    .optional()
    .nullable(),

  minBedrooms: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),

  minBathrooms: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),

  preferredLocation: z
    .string()
    .max(200)
    .optional()
    .nullable(),

  financingAvailable: z
    .boolean()
    .optional()
    .nullable(),

  viewingRequested: z
    .boolean()
    .optional()
    .default(false),

  message: z
    .string()
    .max(2000, "Additional message cannot exceed 2000 characters")
    .optional()
    .nullable(),
});

/*
export const createInquiryResponseSchema = z.object({
  available: z.boolean(),

  proposedPrice: z
    .number()
    .nonnegative()
    .optional()
    .nullable()
    .default(50000),

  viewingAvailable: z
    .boolean()
    .default(false),

  proposedViewingAt: z
    .string()
    .datetime()
    .optional()
    .nullable(),

  message: z
    .string()
    .max(2000)
    .optional()
    .nullable(),
});
*/


export const inquiryQuerySchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CANCELED",
      "RESPONDED",
      "CLOSED",
      "BREACHED",
    ])
    .optional(),

  propertyId: z
    .string()
    .uuid()
    .optional(),

  page: z
    .coerce
    .number()
    .int()
    .positive()
    .optional()
    .default(1),

  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .default(10),
});


export type CreateInquiryInput =
  z.infer<typeof createInquirySchema>;

// export type CreateInquiryResponseInput =
//   z.infer<typeof createInquiryResponseSchema>;

export type InquiryQueryInput =
  z.infer<typeof inquiryQuerySchema>;