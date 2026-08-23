import { z } from "zod";

export const PropertyTypeEnum = z.enum(
  ["APARTMENT", "HOUSE", "VILLA", "CONDO", "LAND", "COMMERCIAL"],
  { message: "Invalid property type" }
);

export const ListingTypeEnum = z.enum(["FOR_SALE", "FOR_RENT"], {
  message: "Invalid listing type",
});

export const PricePeriodEnum = z.enum(["MONTHLY", "YEARLY", "TOTAL"], {
  message: "Invalid Price Period",
});

export const FurnishedStatusEnum = z.enum(
  ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"],
  { message: "Invalid Furnished status" }
);

export const PropertyStatusEnum = z.enum(
  ["AVAILABLE", "PENDING", "SOLD", "RENTED", "INACTIVE"],
  { message: "Invalid Property status" }
);


// ENUM FOR ALL PROPERTY FEATURE KEYS
export const PropertyFeatureEnum = z.enum([
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
]);

//  SCHEMA MAPPING ENUM KEYS TO BOOLEAN VALUES FOR THE PRISMA JSON COLUMN
// Allows providing any subset of enum keys as boolean flags
export const propertyFeaturesSchema = z.partialRecord(
  PropertyFeatureEnum,
  z.boolean()
);

export const createPropertySchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(5, "Title must be at least 5 characters long"),
  description: z
    .string({ message: "Description is required" })
    .min(30, "Description must be at least 30 characters long"),
  propertyType: PropertyTypeEnum,
  listingType: ListingTypeEnum,
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),
  pricePeriod: PricePeriodEnum.default("TOTAL"),
  bedrooms: z
    .number()
    .int("Bedrooms must be an integer")
    .nonnegative("Bedrooms cannot be negative")
    .optional(),
  bathrooms: z
    .number()
    .int("Bathrooms must be an integer")
    .nonnegative("Bathrooms cannot be negative")
    .optional(),
  area: z
    .number()
    .positive("Area must be greater than 0")
    .optional(),
  furnishedStatus: FurnishedStatusEnum.default("UNFURNISHED"),
  city: z
    .string({ message: "City is required" })
    .min(2, "City name is required"),
  status: PropertyStatusEnum.optional().default("AVAILABLE"),
  // JSON COLUMN VALIDATION
  features: propertyFeaturesSchema.optional(),
});


export const getPropertiesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(9),
  search: z.string().optional(),
  city: z.string().optional(),
  propertyType: PropertyTypeEnum.optional(),
  listingType: ListingTypeEnum.optional(),
  
  //q on this
  status: PropertyStatusEnum.optional(),
  furnishedStatus: FurnishedStatusEnum.optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  bedrooms: z.coerce.number().int().nonnegative().optional(),
  bathrooms: z.coerce.number().int().nonnegative().optional(),
  sortBy: z.enum(["createdAt", "price", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Validates url id param
export const propertyIdParamSchema = z.object({
  id: z.uuid("Invalid property ID format"),
});

// Partial schema for updates - all fields optional except status
export const updatePropertySchema = createPropertySchema
                                        .omit({ status: true })
                                        .partial(); // noone can update status

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export type GetPropertiesQueryInput = z.infer<typeof getPropertiesQuerySchema>;

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;


