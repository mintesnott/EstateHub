import { z } from "zod";


export const SpecializationEnum = z.enum([
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "LAND",
  "LUXURY",
  "PROPERTY_MANAGEMENT",
]);

export const createAgentSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters long"),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  licenseNumber: z
    .string({ message: "License number is required" })
    .min(5, "License number must be at least 5 characters long"),

  agencyName: z.string().optional(),

  bio: z
    .string()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional(),

  experienceYears: z
    .number()
    .int()
    .nonnegative("Experience years cannot be negative")
    .optional(),

  specializations: z
    .array(SpecializationEnum)
    .optional()
    .default([]),

  officeAddress: z.string().optional(),
  city: z.string().optional(),
  stateRegion: z.string().optional(),

  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),

  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional()
    .or(z.literal("")),

  whatsappNumber: z.string().optional(),

  commissionRate: z
    .number()
    .positive("Commission rate must be positive")
    .max(100, "Commission rate cannot exceed 100%")
    .optional(),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;

export const updateAgentProfileSchema = z
  .object({
    agencyName: z.string().optional().nullable(),

    bio: z
      .string()
      .max(1000, "Bio cannot exceed 1000 characters")
      .optional()
      .nullable(),

    experienceYears: z
      .number()
      .int("Experience years must be an integer")
      .nonnegative("Experience years cannot be negative")
      .optional()
      .nullable(),

    specializations: z
      .array(SpecializationEnum)
      .optional()
      .nullable(),

    officeAddress: z.string().optional().nullable(),

    city: z.string().optional().nullable(),

    stateRegion: z.string().optional().nullable(),

    websiteUrl: z
      .string()
      .url("Invalid website URL")
      .optional()
      .nullable()
      .or(z.literal("")),

    linkedinUrl: z
      .string()
      .url("Invalid LinkedIn URL")
      .optional()
      .nullable()
      .or(z.literal("")),

    whatsappNumber: z.string().optional().nullable(),
  })
  .strict();

export const agentIdParamSchema = z.object({
  id: z.uuid("Invalid agent ID format"),
});

export const getAgentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  agencyName: z.string().optional(),
  city: z.string().optional(),
  specialization: SpecializationEnum.optional(),
  sortBy: z
    .enum(["name", "email", "createdAt", "agencyName"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
export type GetAgentsQueryInput = z.infer<typeof getAgentsQuerySchema>;

export type UpdateAgentProfileInput = z.infer<
  typeof updateAgentProfileSchema
>;