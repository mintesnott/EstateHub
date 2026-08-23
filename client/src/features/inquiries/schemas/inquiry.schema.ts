import { z } from "zod";

export const sendInquirySchema = z
  .object({
    purpose: z.enum(["BUY", "RENT"], { message: "Please select a purpose" }),
    budgetMin: z.coerce.number().nonnegative().optional().nullable(),
    budgetMax: z.coerce.number().nonnegative().optional().nullable(),
    preferredMoveInDate: z.string().optional().nullable(),
    minBedrooms: z.coerce.number().int().nonnegative().optional().nullable(),
    minBathrooms: z.coerce.number().int().nonnegative().optional().nullable(),
    preferredLocation: z.string().max(200).optional().nullable(),
    financingAvailable: z.boolean().optional().nullable(),
    viewingRequested: z.boolean().optional(),
    message: z.string().max(2000).optional().nullable(),
  })
  .refine(
    (data) => !data.budgetMin || !data.budgetMax || data.budgetMin <= data.budgetMax,
    { message: "Minimum budget cannot exceed maximum budget", path: ["budgetMax"] },
  );

export type SendInquiryFormValues = z.infer<typeof sendInquirySchema>;