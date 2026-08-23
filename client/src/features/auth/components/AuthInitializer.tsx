import { useEffect, useState, type ReactNode } from "react";

import { getCurrentUser } from "../api/auth.api";
import { useAuthStore } from "@/stores//auth.store";

interface AuthInitializerProps {
  children: ReactNode;
}

export function AuthInitializer({
  children,
}: AuthInitializerProps) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isInitializing, setIsInitializing] = useState(
    Boolean(token),
  );

  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    let isMounted = true;

    const restoreSession = async () => {
      try {
        const user = await getCurrentUser();

        if (isMounted) {
          setUser(user);
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, [token, setUser, clearAuth]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}