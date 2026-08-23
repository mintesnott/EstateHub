import { z } from "zod";

export const propertyIdParamSchema = z.object({
  propertyId: z.uuid("Invalid property ID format"),
});

export type PropertyIdParamInput = z.infer<typeof propertyIdParamSchema>;