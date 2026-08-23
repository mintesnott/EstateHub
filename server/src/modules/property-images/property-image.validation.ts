import { z } from "zod";

// Params schemas
export const propertyIdParamSchema = z.object({
  propertyId: z.uuid("Invalid property ID format"),
});

export const propertyAndImageParamsSchema = z.object({
  propertyId: z.uuid("Invalid property ID format"),
  imageId: z.uuid("Invalid image ID format"),
});

// Create Property Image Input
export const createPropertyImageSchema = z.object({
  imageUrl: z.url("Invalid image URL"),
  isPrimary: z.boolean().optional().default(false),
  sortOrder: z.number().int().nonnegative().optional(),
});

// Update Property Image Input
export const updatePropertyImageSchema = z.object({
  imageUrl: z.url("Invalid image URL").optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export type CreatePropertyImageInput = z.infer<typeof createPropertyImageSchema>;
export type UpdatePropertyImageInput = z.infer<typeof updatePropertyImageSchema>;