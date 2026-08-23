import { useAuthStore } from "@/stores/auth.store";

import { ProfilePage } from "./ProfilePage";
import { AgentProfilePage } from "./AgentProfilePage";
import { AdminProfilePage } from "./AdminProfilePage";

export function ProfileDispatcher() {
  const role = useAuthStore((state) => state.user?.role);

  if (role === "AGENT") {
    return <AgentProfilePage />;
  }
  if (role === "ADMIN") return <AdminProfilePage />;

  
  return <ProfilePage />;
}