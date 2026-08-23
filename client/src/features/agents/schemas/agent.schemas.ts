import { z } from "zod";

const customRegex = /^[a-zA-Z0-9\s\-_,.!?'"()/%]+$/;

export const SPECIALIZATIONS = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "LAND",
  "LUXURY",
  "PROPERTY_MANAGEMENT",
] as const;

export const SPECIALIZATION_LABELS: Record<typeof SPECIALIZATIONS[number], string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  INDUSTRIAL: "Industrial",
  LAND: "Land",
  LUXURY: "Luxury",
  PROPERTY_MANAGEMENT: "Property Management",
};

const SpecializationEnum = z.enum(SPECIALIZATIONS);

export const createAgentSchema = z.object({
  name: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .min(2, "Name must be at least 2 characters"),

  email: z
      .string()
      .email("Invalid email address"),

  licenseNumber: z
      .string()
      .min(5, "License number must be at least 5 characters"),

  agencyName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
    .optional(),

  bio: z
      .string()
      .regex(customRegex, "Contains invalid characters")
      .max(1000).optional(),

  experienceYears: z.coerce.number().int().nonnegative().optional(),

  specializations: z.array(SpecializationEnum).optional().default([]),

  officeAddress: z.string().optional(),

  city: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
      .optional(),

  stateRegion: z
        .string()
         .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed")
        .optional(),

  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

  whatsappNumber: z
    .string()
    .regex(/^(\+251|0)[79]\d{8}$/, "Must be a valid phone number (e.g. +251911234567 or 0911234567)")
    .optional(),

  commissionRate: z.coerce.number().positive().max(100).optional(),
});

export const updateAgentSchema = z.object({
  agencyName: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed") 
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(1000)
    .regex(/^[a-zA-Z0-9\s\-_,.!?'"()/%]+$/, "Bio contains invalid characters")
    .nullable()
    .optional()
    .or(z.literal("")),

  experienceYears: z.coerce.number().int().nonnegative().nullable().optional(),

  specializations: z.array(SpecializationEnum).nullable().optional(),

  officeAddress: z.string().nullable().optional(),

  city: z 
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed") 
      .nullable()
      .optional(),
  stateRegion: z
      .string()
      .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed") 
      .nullable().optional(),
  websiteUrl: z.string().url("Invalid URL").nullable().optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").nullable().optional().or(z.literal("")),
  whatsappNumber: z
    .string()
    .regex(/^(\+251|0)[79]\d{8}$/, "Invalid Ethiopian phone format")
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type CreateAgentFormValues = z.input<typeof createAgentSchema>;
export type UpdateAgentFormValues = z.input<typeof updateAgentSchema>;
