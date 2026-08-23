import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  X,
  LogOut,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { getNavItems } from "./navConfig";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navItems = user
    ? getNavItems(user.role)
    : [];

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to log out?",
    );

    if (!confirmed) {
      return;
    }

    clearAuth();
    onClose();
    window.location.href = "/login";
  };

  const content = (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Building2 className="h-5 w-5" />
        </div>

        <span className="text-lg font-bold tracking-tight">
          Estate<span className="text-secondary">Hub</span>
        </span>

        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md p-2 hover:bg-muted lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation - flex-1 and overflow-y-auto ensures it absorbs extra space without expanding parent */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-secondary/15 text-secondary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="mt-auto shrink-0 border-t border-border p-3">

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop sidebar - sticky top-0 h-screen locks it to the viewport height */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background lg:block">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {content}
      </aside>
    </>
  );
}