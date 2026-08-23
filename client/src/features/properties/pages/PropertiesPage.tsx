
import { useSearchParams } from "react-router-dom";

import { PropertyFilters } from "../components/PropertyFilters";
import { PropertyCard } from "../components/PropertyCard";

import { useProperties } from "../api/property.queries";

import type { PropertyFilters as PropertyFiltersType } from "../types/property.types";

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: PropertyFiltersType = {
    page: searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1,

    limit: searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10,

    search: searchParams.get("search") || undefined,

    city: searchParams.get("city") || undefined,

    propertyType:
      (searchParams.get(
        "propertyType",
      ) as PropertyFiltersType["propertyType"]) || undefined,

    listingType:
      (searchParams.get(
        "listingType",
      ) as PropertyFiltersType["listingType"]) || undefined,

    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,

    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,

    bedrooms: searchParams.get("bedrooms")
      ? Number(searchParams.get("bedrooms"))
      : undefined,

    bathrooms: searchParams.get("bathrooms")
      ? Number(searchParams.get("bathrooms"))
      : undefined,

    sortBy:
      (searchParams.get(
        "sortBy",
      ) as PropertyFiltersType["sortBy"]) || undefined,

    sortOrder:
      (searchParams.get(
        "sortOrder",
      ) as PropertyFiltersType["sortOrder"]) || undefined,
  };

  const { data, isLoading, isError } = useProperties(filters);

  const updateFilters = (newFilters: PropertyFiltersType) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    // Always start filtered results from page 1.
    params.set("page", "1");

    setSearchParams(params);
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          Loading homes...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold">
          Failed to load homes.
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </main>
    );
  }

  const properties = data?.data ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page heading */}
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">
          Explore homes
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Find your next home
        </h1>

        <p className="mt-2 text-muted-foreground">
          Discover homes and properties that match what you're
          looking for.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onChange={updateFilters}
        />

        {/* Results */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data?.pagination.totalCount ?? 0}{" "}
              {data?.pagination.totalCount === 1
                ? "home"
                : "homes"}{" "}
              found
            </p>
          </div>

          {properties.length === 0 ? (
            <div className="rounded-xl border border-border p-10 text-center">
              <h2 className="text-lg font-semibold">
                No homes found
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your search filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>

              {/* Temporary pagination controls */}
              {data?.pagination.totalPages &&
                data.pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      disabled={!data.pagination.hasPrevPage}
                      onClick={() =>
                        updatePage(filters.page! - 1)
                      }
                      className="rounded-md border border-border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <span className="text-sm text-muted-foreground">
                      Page {data.pagination.page} of{" "}
                      {data.pagination.totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={!data.pagination.hasNextPage}
                      onClick={() =>
                        updatePage(filters.page! + 1)
                      }
                      className="rounded-md border border-border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
