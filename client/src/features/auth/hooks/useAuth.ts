import { useMutation, useQuery } from "@tanstack/react-query";

import {
  changeEmail,
  changePassword,
  getCurrentUser,
  login,
  register,
} from "../api/auth.api";

import type {
  ChangeEmailInput,
  ChangePasswordFormInput,
  LoginFormInput,
  RegisterFormInput,
} from "../schemas/auth.schemas";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormInput) => login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterFormInput) => register(data),
  });
}

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled,
    retry: false,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormInput) =>
      changePassword(data),
  });
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: (data: ChangeEmailInput) =>
      changeEmail(data),
  });
}