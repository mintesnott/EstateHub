import { useAuthStore } from "@/stores/auth.store";

import { ClientDashboard } from "./ClientDashboard";
import { AgentDashboard } from "./AgentDashboard";
import { AdminDashboard } from "./AdminDashboard";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // ProtectedRoute should already prevent this, but stay defensive
    return null;
  }

  switch (user.role) {
    case "AGENT":
      return <AgentDashboard />;
    case "ADMIN":
      return <AdminDashboard />;
    case "CLIENT":
    default:
      return <ClientDashboard />;
  }
}