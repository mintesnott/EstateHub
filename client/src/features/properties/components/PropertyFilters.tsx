import { useState, useEffect } from "react";
import type { PropertyFilters as PropertyFiltersType } from "../types/property.types";

import { useDebounce } from "@/hooks/useDebounce";

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onChange: (filters: PropertyFiltersType) => void;
}

export function PropertyFilters({
  filters,
  onChange,
}: PropertyFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Location
  const [cityInput, setCityInput] = useState(filters.city ?? "");
  const debouncedCity = useDebounce(cityInput, 400);

  //min price
  const [minInput, setMinInput] = useState(filters.minPrice ?? "");
  const debouncedMinimumPrice = useDebounce(minInput, 500)

  //max price
  const [maxInput, setMaxInput] = useState(filters.maxPrice ?? "");
  const debouncedMaximumPrice = useDebounce(maxInput, 400)

  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    setCityInput(filters.city ?? "");
  }, [filters.city]);

   useEffect(() => {
    setMinInput(filters.minPrice ?? "");
  }, [filters.minPrice]);

   useEffect(() => {
    setMaxInput(filters.maxPrice ?? "");
  }, [filters.maxPrice]);

  // Sync debounced search to URL filters
  useEffect(() => {
    const currentSearch = filters.search ?? "";

    if (debouncedSearch !== currentSearch) {
      onChange({
        ...filters,
        search: debouncedSearch.trim() || undefined,
      });
    }
  }, [debouncedSearch]);

  // Sync debounced location search
  useEffect(() => {
    const currentCity = filters.city ?? "";

    if (debouncedCity !== currentCity) {
      onChange({
        ...filters,
        city: debouncedCity.trim() || undefined,
      });
    }
  }, [debouncedCity]);

  // Sync debounced minimum price
  useEffect(() => {
    const currentMinimumPrice = filters.minPrice ?? undefined;

    const parsedMinPrice = debouncedMinimumPrice ? Number(debouncedMinimumPrice) : undefined;
    if (parsedMinPrice !== currentMinimumPrice) {
      onChange({
        ...filters,
        minPrice: parsedMinPrice,
      });
    }
  }, [debouncedMinimumPrice]);

  // Sync debounced maximum price
  useEffect(() => {
    const currentMaximumValue = filters.maxPrice ?? undefined;

    const parsedMaxPrice = debouncedMaximumPrice ? Number(debouncedMaximumPrice) : undefined;
    if (parsedMaxPrice !== currentMaximumValue) {
      onChange({
        ...filters,
        maxPrice: parsedMaxPrice,
      });
    }
  }, [debouncedMaximumPrice]);

  return (
    <aside className="h-fit  overflow-y-auto rounded-xl border border-border bg-card p-5 max-h-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter homes</h2>
      </div>

      {/* Search */}
      <div className="mt-6">
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>

        <input
          id="search"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search homes..."
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* City */}
      <div className="mt-5">
        <label htmlFor="city" className="text-sm font-medium">
          Location
        </label>

        <input
          id="city"
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="e.g. Bole"
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Listing type */}
      <div className="mt-5">
        <label
          htmlFor="listingType"
          className="text-sm font-medium"
        >
          Looking for
        </label>

        <select
          id="listingType"
          value={filters.listingType ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              listingType:
                e.target.value === ""
                  ? undefined
                  : (e.target.value as "FOR_SALE" | "FOR_RENT"),
            })
          }
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Buy or rent</option>
          <option value="FOR_SALE">For sale</option>
          <option value="FOR_RENT">For rent</option>
        </select>
      </div>

      {/* Property type */}
      <div className="mt-5">
        <label
          htmlFor="propertyType"
          className="text-sm font-medium"
        >
          Home type
        </label>

        <select
          id="propertyType"
          value={filters.propertyType ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              propertyType:
                e.target.value === ""
                  ? undefined
                  : (e.target.value as PropertyFiltersType["propertyType"]),
            })
          }
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All home types</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="CONDO">Condo</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="LAND">Land</option>
        </select>
      </div>

      {/* Price */}
      <div className="mt-5">
        <p className="text-sm font-medium">Price range</p>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            min={1000}
            placeholder="Min"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />

          <input
            type="number"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="Max"
            min={1000}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mt-5">
        <label htmlFor="bedrooms" className="text-sm font-medium">
          Minimum bedrooms
        </label>

        <select
          id="bedrooms"
          value={filters.bedrooms ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              bedrooms: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mt-5">
        <label htmlFor="bathrooms" className="text-sm font-medium">
          Minimum bathrooms
        </label>

        <select
          id="bathrooms"
          value={filters.bathrooms ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              bathrooms: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Sorting */}
      <div className="mt-6 border-t border-border pt-6">
        <p className="text-sm font-medium">Sort properties</p>

        {/* Sort by */}
        <div className="mt-3">
          <label
            htmlFor="sortBy"
            className="text-sm text-muted-foreground"
          >
            Sort by
          </label>

          <select
            id="sortBy"
            value={filters.sortBy ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy:
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as PropertyFiltersType["sortBy"]),
              })
            }
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="createdAt">Date added</option>
            <option value="bedrooms">Bedrooms</option>
            <option value="bathrooms">Bathrooms</option>
          </select>
        </div>

        {/* Sort order */}
        <div className="mt-4">
          <label
            htmlFor="sortOrder"
            className="text-sm text-muted-foreground"
          >
            Order
          </label>

          <select
            id="sortOrder"
            value={filters.sortOrder ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                sortOrder:
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as PropertyFiltersType["sortOrder"]),
              })
            }
            className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => {
          setSearchInput("");
          setCityInput("");
          onChange({});
        }}
        className="mt-6 w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        Clear filters
      </button>
    </aside>
  );
}