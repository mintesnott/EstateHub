import { Menu, User as UserIcon } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { ThemeToggle } from "@/app/theme/ThemeToggle";

interface DashboardTopbarProps {
  onMenuClick: () => void;
}

export function DashboardTopbar({
  onMenuClick,
}: DashboardTopbarProps) {


  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 hover:bg-muted lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <UserIcon className="h-4 w-4" />
          </div>

          <div className="hidden text-sm sm:block">
            <p className="font-semibold leading-tight">
              {user?.name}
            </p>

            <p className="text-xs capitalize leading-tight text-muted-foreground">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}