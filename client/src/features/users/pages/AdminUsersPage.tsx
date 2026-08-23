import { useSearchParams } from "react-router-dom";
import { Search, Users, MapPin, Heart, Mail, Phone } from "lucide-react";

import { useUsers } from "../api/user.queries";
import type { UserFilters } from "../types/user.types";

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const sortBy = (searchParams.get("sortBy") as UserFilters["sortBy"]) || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data, isLoading, isError } = useUsers({
    search: search || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 12,
  });

  const users = data?.data ?? [];
  const meta = data?.meta;

  const setParam = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          User management
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {meta?.total ?? 0} registered clients
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setParam("search", e.target.value || undefined)}
            placeholder="Search by name or email..."
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [by, order] = e.target.value.split(":");
            const params = new URLSearchParams(searchParams);
            params.set("sortBy", by);
            params.set("sortOrder", order);
            params.delete("page");
            setSearchParams(params);
          }}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
        >
          <option value="createdAt:desc">Newest first</option>
          <option value="createdAt:asc">Oldest first</option>
          <option value="name:asc">Name A–Z</option>
          <option value="name:desc">Name Z–A</option>
          <option value="favoriteCount:desc">Most favorites</option>
          <option value="favoriteCount:asc">Least favorites</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold">Failed to load users</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-border p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <Users className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">No clients found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {search ? "Try adjusting your search." : "No clients have registered yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary/15 text-lg font-bold text-secondary">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                    <Heart className="h-3 w-3" />
                    {user.favoriteCount}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </p>

                  {user.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </p>
                  )}

                  {user.clientProfile?.preferredCity && (
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      Prefers {user.clientProfile.preferredCity}
                    </p>
                  )}
                </div>

                {/* Preferences */}
                {user.clientProfile && (
                  <div className="mt-3 border-t border-border pt-3">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {user.clientProfile.preferredType && (
                        <span>{user.clientProfile.preferredType}</span>
                      )}
                      {user.clientProfile.minBedrooms !== null && (
                        <span>{user.clientProfile.minBedrooms}+ beds</span>
                      )}
                      {user.clientProfile.maxBudget && (
                        <span>
                          Budget: ETB{" "}
                          {new Intl.NumberFormat("en-US").format(
                            Number(user.clientProfile.maxBudget),
                          )}
                        </span>
                      )}
                      {user.clientProfile.preApprovedMortgage && (
                        <span className="text-emerald-600">Pre-approved</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updatePage(page - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages}
              </span>

              <button
                type="button"
                disabled={page >= meta.totalPages}
                onClick={() => updatePage(page + 1)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}