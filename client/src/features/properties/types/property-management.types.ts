import type { PropertyType, ListingType, PricePeriod, FurnishedStatus, PropertyFeatures } from "./property.types";

// Matches createPropertySchema exactly — every required field, features optional
export interface CreatePropertyInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  pricePeriod?: PricePeriod;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishedStatus?: FurnishedStatus;
  city: string;
  features?: Partial<PropertyFeatures>;
}


export type UpdatePropertyInput = Partial<CreatePropertyInput>;