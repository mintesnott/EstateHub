import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";

export default function RequirePasswordChangeComplete() {

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const mustChangePassword = useAuthStore(
    (state) => state.mustChangePassword,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}