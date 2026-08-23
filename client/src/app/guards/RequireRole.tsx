import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import type { UserRole } from "@/features/auth/types/auth.types";

interface RequireRoleProps {
  allowed: UserRole[];
}

// Must sit INSIDE ProtectedRoute — assumes the user is already authenticated
// and has passed the mustChangePassword check. This only narrows by role.
export function RequireRole({ allowed }: RequireRoleProps) {
  const role = useAuthStore((state) => state.user?.role);

 if (!role || !allowed.includes(role)) {
    return <Navigate to="/403" replace />;
  }
  
  return <Outlet />;
}