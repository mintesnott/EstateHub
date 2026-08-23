import { useAuthStore } from "@/stores/auth.store";

import { PublicLayout } from "@/components/layout/public/PublicLayout";
import { AppLayout } from "@/components/layout/Authenticated/AppLayout";

export function ConditionalLayout() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  if (isAuthenticated) {
    return <AppLayout />;
  }

  return <PublicLayout />;
}