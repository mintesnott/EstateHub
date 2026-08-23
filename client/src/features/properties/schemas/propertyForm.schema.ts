import { z } from "zod";
const descriptionRegex = /^[a-zA-Z0-9\s\-_,.!?'"()/%]+$/;

export const PROPERTY_FEATURES = [
  "PARKING",
  "BALCONY",
  "GARDEN",
  "SECURITY",
  "WATER",
  "ELECTRICITY",
  "GENERATOR",
  "ELEVATOR",
  "AIR_CONDITIONING",
  "HEATING",
  "INTERNET",
  "SWIMMING_POOL",
  "GYM",
  "WATER_TANK",
  "SERVICE_QUARTERS",
] as const;

export const FEATURE_LABELS: Record<typeof PROPERTY_FEATURES[number], string> = {
  PARKING: "Parking",
  BALCONY: "Balcony",
  GARDEN: "Garden",
  SECURITY: "Security",
  WATER: "Water",
  ELECTRICITY: "Electricity",
  GENERATOR: "Generator",
  ELEVATOR: "Elevator",
  AIR_CONDITIONING: "Air Conditioning",
  HEATING: "Heating",
  INTERNET: "Internet",
  SWIMMING_POOL: "Swimming Pool",
  GYM: "Gym",
  WATER_TANK: "Water Tank",
  SERVICE_QUARTERS: "Service Quarters",
};

// defaults it to AVAILABLE on create, so the frontend never sends it.
export const propertyFormSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .regex( descriptionRegex, "Bio contains invalid characters")
    .min(5, "Title must be at least 5 characters long"),

  description: z
    .string({ message: "Description is required" })
    .regex( descriptionRegex, "Description contains invalid characters")
    .min(30, "Description must be at least 30 characters long"),

  propertyType: z.enum(
    ["APARTMENT", "HOUSE", "VILLA", "CONDO", "LAND", "COMMERCIAL"],
    { message: "Property type is required" },
  ),

  listingType: z.enum(["FOR_SALE", "FOR_RENT"], {
    message: "Listing type is required",
  }),

  price: z.coerce
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),

  pricePeriod: z
    .enum(["MONTHLY", "YEARLY", "TOTAL"])
    .optional(),

  bedrooms: z.coerce
    .number()
    .int("Bedrooms must be an integer")
    .nonnegative("Bedrooms cannot be negative")
    .optional(),

  bathrooms: z.coerce
    .number()
    .int("Bathrooms must be an integer")
    .nonnegative("Bathrooms cannot be negative")
    .optional(),

  area: z.coerce
    .number()
    .positive("Area must be greater than 0")
    .optional(),

  furnishedStatus: z
    .enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"])
    .optional(),

  city: z
    .string({ message: "City is required" })
    .min(2, "City name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),

  // Features: each key is an optional boolean.
  // Unchecked features are simply absent from the payload — not sent as false.
  features: z
    .object({
      PARKING: z.boolean().optional(),
      BALCONY: z.boolean().optional(),
      GARDEN: z.boolean().optional(),
      SECURITY: z.boolean().optional(),
      WATER: z.boolean().optional(),
      ELECTRICITY: z.boolean().optional(),
      GENERATOR: z.boolean().optional(),
      ELEVATOR: z.boolean().optional(),
      AIR_CONDITIONING: z.boolean().optional(),
      HEATING: z.boolean().optional(),
      INTERNET: z.boolean().optional(),
      SWIMMING_POOL: z.boolean().optional(),
      GYM: z.boolean().optional(),
      WATER_TANK: z.boolean().optional(),
      SERVICE_QUARTERS: z.boolean().optional(),
    })
    .optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;