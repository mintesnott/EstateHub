import { z } from "zod";

export const inquiryIdParamSchema = z.object({
  id: z.uuid("Invalid inquiry ID format"),
});

export const createMessageSchema = z.object({
  content: z
    .string({message: "Content is required"})
    .min(1, "Message cannot be empty")
    .max(5000, "Message cannot exceed 5000 characters"),
 metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional()
    .nullable(),
});

export const messageQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type MessageQueryInput = z.infer<typeof messageQuerySchema>;