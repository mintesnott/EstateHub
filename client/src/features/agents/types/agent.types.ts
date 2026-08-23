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
  ratingAvg: string;
  totalReviews: number;
  commissionRate: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  createdAt: string;
  agentProfile: AgentProfile | null;
  tempPassword?: string;
}

export interface AgentFilters {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: Specialization;
  city?: string;
  sortBy?: "name" | "email" | "createdAt" | "agencyName";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AgentsResponse {
  success: boolean;
  count: number;
  meta: PaginationMeta;
  data: Agent[];
}

export interface AgentResponse {
  success: boolean;
  data: Agent;
}

export interface CreateAgentInput {
  name: string;
  email: string;
  licenseNumber: string;
  agencyName?: string;
  bio?: string;
  experienceYears?: number;
  specializations?: Specialization[];
  officeAddress?: string;
  city?: string;
  stateRegion?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  commissionRate?: number;
}

export interface UpdateAgentInput {
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