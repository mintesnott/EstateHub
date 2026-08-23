import type { PropertyFilters } from "../types/property.types";

interface PropertySortProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}

export function PropertySort({
  filters,
  onChange,
}: PropertySortProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="property-sort"
        className="text-sm text-muted-foreground"
      >
        Sort by
      </label>

      <select
        id="property-sort"
        value={`${filters.sortBy ?? "createdAt"}-${filters.sortOrder ?? "desc"}`}
        onChange={(event) => {
          const [sortBy, sortOrder] =
            event.target.value.split("-");

          onChange({
            ...filters,
            sortBy: sortBy as PropertyFilters["sortBy"],
            sortOrder: sortOrder as PropertyFilters["sortOrder"],
            page: 1,
          });
        }}
        className="h-10 rounded-md border border-border bg-background px-3 text-sm"
      >
        <option value="createdAt-desc">
          Newest
        </option>

        <option value="createdAt-asc">
          Oldest
        </option>

        <option value="price-asc">
          Price: Low to high
        </option>

        <option value="price-desc">
          Price: High to low
        </option>

        <option value="viewCount-desc">
          Most viewed
        </option>
      </select>
    </div>
  );
}