import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type {
  AuthUser,
  changeEmailResponse,
  ChangePasswordResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types";

import type {
  ChangeEmailInput,
  ChangePasswordFormInput,
  LoginFormInput,
  RegisterFormInput,
} from "../schemas/auth.schemas";

//login
export async function login(
  data: LoginFormInput,
): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data,
  );

  if (!response.data.data) {
    throw new Error(response.data.message ?? "Login failed");
  }

  return response.data.data;
}

//register
export async function register(
  data: RegisterFormInput,
): Promise<RegisterResponse> {
  const response = await api.post<ApiResponse<RegisterResponse>>(
    "/auth/register",
    data,
  );

  if (!response.data.data) {
    throw new Error(response.data.message ?? "Registration failed");
  }

  return response.data.data;
}

//get current user
export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<ApiResponse<AuthUser>>(
    "/auth/me",
  );

  if (!response.data.data) {
    throw new Error(response.data.message ?? "Failed to get current user");
  }

  return response.data.data;
}

//change password
export async function changePassword(
  data: ChangePasswordFormInput,
): Promise<ChangePasswordResponse> {
  const response = await api.patch<ApiResponse<ChangePasswordResponse>>(
    "/auth/change-password",
    data,
  );

  return {
    success: response.data.success,
    message: response.data.message ?? "Password changed successfully",
  };
}

//change email
export async function changeEmail(
  data: ChangeEmailInput,
): Promise<changeEmailResponse> {
  const response = await api.patch(
    "/auth/change-email",
    data,
  );

  return {
     success: response.data.success,
     message: response.data.message ?? "Email changed successfully",
  }
}