import { Link } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store"; 

export function NotFoundPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        404
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Page not found
      </h1>

      <p className="mt-4 text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>

      {isAuthenticated ? (
        <Link
          to="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Back to Dashboard
        </Link>
      ) : (
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Back to Home
        </Link>
      )}
    </section>
  );
}