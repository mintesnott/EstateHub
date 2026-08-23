import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/app/theme/ThemeToggle";

const publicNavigation = [
  { name: "Home", to: "/#home" },
  { name: "About Us", to: "/#about" },
  { name: "Our Services", to: "/#services" },
  { name: "Resources", to: "/#resources" },
  { name: "Get in Touch", to: "/#contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

        {/* Mobile menu */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="mr-3 rounded-md p-2 hover:bg-muted md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            E
          </div>

          <span className="text-xl font-bold tracking-tight">
            Estate<span className="text-secondary">Hub</span>
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}
        <nav className="ml-auto hidden items-center gap-7 md:flex">
              {publicNavigation.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  className="text-sm font-medium transition-colors hover:text-secondary"
                >
                  {item.name}
                </a>
              ))}

              <Link
                to="/properties"
                className="text-sm font-medium transition-colors hover:text-secondary"
              >
                Properties
              </Link>
        </nav>

        {/* =====================================================
            DESKTOP CONTROLS
        ===================================================== */}
        <div className="ml-7 hidden items-center gap-3 md:flex">

          <ThemeToggle />
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Register
              </Link>

        </div>
      </div>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}
      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[280px] border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col px-4 py-4">
              {/* Public navigation */}
              {publicNavigation.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={closeMobileMenu}
                  className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
                >
                  {item.name}
                </a>
              ))}

              <Link
                to="/properties"
                onClick={closeMobileMenu}
                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
              >
                Properties
              </Link>

          {/* Theme */}
          <div className="mt-3 flex items-center justify-between rounded-md border border-border px-3 py-2.5">
            <span className="text-sm font-medium">
              Switch Theme
            </span>

            <ThemeToggle />
          </div>

          {/* Public authentication actions */}
            <div className="mt-3 flex gap-3 border-t border-border pt-4">

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex-1 rounded-md border border-border px-4 py-2 text-center text-sm font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Register
              </Link>

            </div>

        </nav>
      </aside>
    </header>
  );
}