import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export function NotAuthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <ShieldAlert className="h-8 w-8 text-red-600" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight">Access Denied</h1>

      <p className="mt-2 max-w-sm text-muted-foreground">
        You don't have permission to view this page. If you think this is a
        mistake, contact support.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}