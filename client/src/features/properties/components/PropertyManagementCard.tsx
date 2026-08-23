import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Pencil, Trash2, Loader2 } from "lucide-react";

import type { Property } from "../types/property.types";

interface PropertyManagementCardProps {
  property: Property;
  onDelete: () => void;
  isDeleting: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  SOLD: "bg-gray-100 text-gray-600",
  RENTED: "bg-blue-100 text-blue-700",
  INACTIVE: "bg-gray-100 text-gray-500",
};

export function PropertyManagementCard({
  property,
  onDelete,
  isDeleting,
}: PropertyManagementCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US").format(
    Number(property.price),
  );

  const listingLabel =
    property.listingType === "FOR_SALE" ? "For Sale" : "For Rent";

  const statusLabel =
    property.status.charAt(0) + property.status.slice(1).toLowerCase();

  const statusStyle =
    STATUS_STYLES[property.status] ?? "bg-gray-100 text-gray-600";

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {property.primaryImage ? (
          <img
            src={property.primaryImage.imageUrl}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          {listingLabel}
        </span>

        <span
          className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-1 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {property.city}
        </div>

        <h2 className="mt-1.5 line-clamp-1 font-semibold">{property.title}</h2>

        <p className="mt-2 font-bold text-primary">
          ETB {formattedPrice}
          {property.listingType === "FOR_RENT" &&
            property.pricePeriod !== "TOTAL" && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {property.pricePeriod?.toLowerCase()}
              </span>
            )}
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms}
            </span>
          )}
          <span className="ml-auto text-xs">{property.propertyType}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            to={`/agent/properties/${property.id}/edit`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}