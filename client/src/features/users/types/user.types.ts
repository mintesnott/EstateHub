export interface ClientProfile {
  id: string;
  preferredCity: string | null;
  preferredType: string | null;
  maxBudget: string | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  preApprovedMortgage: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  createdAt: string;
  favoriteCount: number;
  clientProfile: ClientProfile | null;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email" | "createdAt" | "favoriteCount";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  meta: PaginationMeta;
  data: AdminUser[];
}export interface ClientProfile {
  id: string;
  preferredCity: string | null;
  preferredType: string | null;
  maxBudget: string | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  preApprovedMortgage: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  createdAt: string;
  favoriteCount: number;
  clientProfile: ClientProfile | null;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email" | "createdAt" | "favoriteCount";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  meta: PaginationMeta;
  data: AdminUser[];
}