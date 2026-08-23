import { z } from "zod";

const bioRegex = /^[a-zA-Z0-9\s\-_,.!?'"()/%]+$/;

export const SpecializationEnum = z.enum([
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "LAND",
  "LUXURY",
  "PROPERTY_MANAGEMENT",
]);

export const updateAgentProfileFormSchema = z
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

    profileImage: z.string().nullable().optional(),

    agencyName: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .nullable()
      .optional(),

    bio: z
      .string()
      .regex( bioRegex, "Bio contains invalid characters")
      .max(1000, "Bio cannot exceed 1000 characters").nullable()
      .optional(),

    experienceYears: z
      .number()
      .int("Experience years must be an integer")
      .nonnegative("Experience years cannot be negative")
      .nullable()
      .optional(),

    specializations: z
      .array(SpecializationEnum)
      .nullable()
      .optional(),

    officeAddress: z
      .string()
      .nullable()
      .optional(),

    city: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .nullable()
      .optional(),

    stateRegion: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .nullable()
      .optional(),

    websiteUrl: z
      .string()
      .url("Invalid website URL")
      .nullable()
      .optional()
      .or(z.literal("")),
    linkedinUrl: z
      .string()
      .url("Invalid LinkedIn URL")
      .nullable()
      .optional()
      .or(z.literal("")),
      
    whatsappNumber: z
      .string()
      .regex(/^\+251[79]\d{8}$/, "Phone number must start with +2517 or +2519 followed by 8 digits")
      .nullable()
      .optional(),
  })
  .strict();

export type UpdateAgentProfileFormInput = z.infer<typeof updateAgentProfileFormSchema>;