import { create } from "zustand";

import type { AuthUser } from "@/features/auth/types/auth.types";

const TOKEN_KEY = "estatehub_token";
const MUST_CHANGE_PASSWORD_KEY = "estatehub_must_change_password";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;

  setAuth: (
    user: AuthUser,
    token: string,
    mustChangePassword: boolean,
  ) => void;

  setUser: (user: AuthUser) => void;

  clearAuth: () => void;
}

const getStoredToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

const getStoredMustChangePassword = (): boolean => {
  return sessionStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === "true";
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getStoredToken(),
  isAuthenticated: Boolean(getStoredToken()),
  mustChangePassword: getStoredMustChangePassword(),

  setAuth: (user, token, mustChangePassword) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(
      MUST_CHANGE_PASSWORD_KEY,
      String(mustChangePassword),
    );

    set({
      user,
      token,
      isAuthenticated: true,
      mustChangePassword,
    });
  },

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(MUST_CHANGE_PASSWORD_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      mustChangePassword: false,
    });
  },
}));