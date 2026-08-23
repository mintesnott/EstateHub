export type PropertyType =
  | "APARTMENT"
  | "HOUSE"
  | "VILLA"
  | "CONDO"
  | "LAND"
  | "COMMERCIAL";

export type ListingType = "FOR_SALE" | "FOR_RENT";

export type PricePeriod = "MONTHLY" | "YEARLY" | "TOTAL";

export type FurnishedStatus =
  | "UNFURNISHED"
  | "SEMI_FURNISHED"
  | "FULLY_FURNISHED";

export type PropertyStatus =
  | "AVAILABLE"
  | "PENDING"
  | "SOLD"
  | "RENTED"
  | "INACTIVE";

export interface PropertyAgent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Property {
  id: string;
  agentId: string;

  title: string;
  description: string;

  propertyType: PropertyType;
  listingType: ListingType;

  // Prisma Decimal is serialized by the backend as a string
  price: string;
  pricePeriod: PricePeriod;

  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;

  parkingSpaces: number | null;
  garageSpaces: number | null;

  furnishedStatus: FurnishedStatus;

  features: PropertyFeatures | null;

  address: string | null;
  city: string;
  region: string | null;
  zipCode: string | null;

  latitude: string | null;
  longitude: string | null;

  virtualTourUrl: string | null;

  viewCount: number;
  isFeatured: boolean;

  availableFrom: string | null;
  yearBuilt: number | null;

  status: PropertyStatus;

  createdAt: string;
  updatedAt: string;

  agent: PropertyAgent;
  primaryImage?: PropertyPrimaryImage | null;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyPagination {
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

//filter

export interface PropertyFilters {
  page?: number;
  limit?: number;

  search?: string;
  city?: string;

  propertyType?: PropertyType;
  listingType?: ListingType;
  status?: PropertyStatus;
  furnishedStatus?: FurnishedStatus;

  minPrice?: number;
  maxPrice?: number;

  bedrooms?: number;
  bathrooms?: number;

  sortBy?: "createdAt" | "price" | "viewCount";
  sortOrder?: "asc" | "desc";
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  pagination: PropertyPagination;
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
}

export interface PropertyImagesResponse {
  success: boolean;
  count: number;
  data: PropertyImage[];
}

export interface PropertyPrimaryImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}


export type PropertyFeature =
  | "PARKING"
  | "BALCONY"
  | "GARDEN"
  | "SECURITY"
  | "WATER"
  | "ELECTRICITY"
  | "GENERATOR"
  | "ELEVATOR"
  | "AIR_CONDITIONING"
  | "HEATING"
  | "INTERNET"
  | "SWIMMING_POOL"
  | "GYM"
  | "WATER_TANK"
  | "SERVICE_QUARTERS";

export type PropertyFeatures = Partial<
  Record<PropertyFeature, boolean>
>;