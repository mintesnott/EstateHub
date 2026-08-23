export type ClientPreferredType =
  | "APARTMENT"
  | "HOUSE"
  | "VILLA"
  | "CONDO"
  | "COMMERCIAL"
  | "LAND";

export interface ClientProfile {
  id: string;
  userId: string;

  preferredCity: string | null;
  preferredType: ClientPreferredType | null;

  maxBudget: number | string | null;

  minBedrooms: number | null;
  minBathrooms: number | null;

  preApprovedMortgage: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface MyProfile {
  id: string;
  name: string;
  email: string;
  role: "CLIENT" | "AGENT" | "ADMIN";

  phone: string | null;
  profileImage: string | null;

  clientProfile: ClientProfile | null;

  agentProfile: AgentProfile | null;

  updatedAt: string;
}

export interface MyProfileResponse {
  success: boolean;
  data: MyProfile;
}

export interface UpdateMyProfileInput {
  name?: string;
  phone?: string | null;
  profileImage?: string | null;

  // Client fields
  preferredCity?: string | null;
  preferredType?: ClientPreferredType | null;
  maxBudget?: number | null;
  minBedrooms?: number | null;
  minBathrooms?: number | null;
  preApprovedMortgage?: boolean;

  // Agent fields
  agencyName?: string | null;
  bio?: string | null;
  experienceYears?: number | null;
  specializations?: Specialization[] | null;
  officeAddress?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  whatsappNumber?: string | null;
}

export type Specialization =
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "LAND"
  | "LUXURY"
  | "PROPERTY_MANAGEMENT";

export interface AgentProfile {
  id: string;
  userId: string;

  licenseNumber: string;
  agencyName: string | null;
  bio: string | null;
  experienceYears: number;
  specializations: Specialization[] | null;

  officeAddress: string | null;
  city: string | null;
  stateRegion: string | null;

  websiteUrl: string | null;
  linkedinUrl: string | null;
  whatsappNumber: string | null;

  ratingAvg: number | string;
  totalReviews: number;
  commissionRate: number | string | null;
  isFeatured: boolean;

  createdAt: string;
  updatedAt: string;
}