import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";
import { toast } from "sonner";

import { useMyProperties, useDeleteProperty } from "../api/property.queries";
import { PropertyManagementCard } from "../components/PropertyManagementCard";
import type { PropertyFilters } from "../types/property.types";

export function MyPropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filters: PropertyFilters = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 9,
    status:
      (searchParams.get("status") as PropertyFilters["status"]) || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const { data, isLoading, isError } = useMyProperties(filters);
  const { mutate: deleteProperty } = useDeleteProperty();

  const properties = data?.data ?? [];
  const pagination = data?.pagination;

  const handleDelete = (propertyId: string) => {
    if (
      !window.confirm(
        "Delete this property? This cannot be undone.",
      )
    )
      return;

    setDeletingId(propertyId);

    deleteProperty(propertyId, {
      onSuccess: () => {
        toast.success("Property deleted");
        setDeletingId(null);
      },
      onError: () => {
        toast.error("Failed to delete property");
        setDeletingId(null);
      },
    });
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <h1 className="font-semibold">Failed to load your properties</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Property management
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            My Properties
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pagination?.totalCount ?? 0}{" "}
            {pagination?.totalCount === 1 ? "property" : "properties"}
          </p>
        </div>

        <Link
          to="/agent/properties/new"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {/* Empty state */}
      {properties.length === 0 ? (
        <div className="rounded-xl border border-border p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15 text-secondary">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">No properties yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first property listing to get started.
          </p>
          <Link
            to="/agent/properties/new"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyManagementCard
                key={property.id}
                property={property}
                onDelete={() => handleDelete(property.id)}
                isDeleting={deletingId === property.id}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={!pagination.hasPrevPage}
                onClick={() => updatePage(pagination.page - 1)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => updatePage(pagination.page + 1)}
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