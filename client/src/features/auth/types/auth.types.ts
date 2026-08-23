export type UserRole = "CLIENT" | "AGENT" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  mustChangePassword: boolean;
  message: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface changeEmailResponse {
  success: boolean;
  message: string;
}